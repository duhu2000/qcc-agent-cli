const { createHttpClient, parseSSEResponse, extractMcpContent, QccError, ErrorType } = require('../utils/httpClient');
const configService = require('./configService');
const mcpServers = require('../config/mcpServers.json');

/**
 * MCP 服务类
 * 处理与 MCP 服务器的通信
 */
class McpService {
  constructor() {
    this.httpClient = createHttpClient();
    this._serverNameMap = null;
    this._toolsCache = null;
    this._updateAttempted = false;
    this._lastUpdateError = null;
  }

  /**
   * 从 endpoint 提取简短服务名（静态方法）
   * @param {string} endpoint - 端点路径 (如 "/company/stream")
   * @returns {string} 简短名称 (如 "company")
   */
  static extractServerName(endpoint) {
    const match = endpoint.match(/^\/([^/]+)/);
    return match ? match[1] : endpoint.replace(/^\//, '').replace(/\/.*$/, '');
  }

  /**
   * 获取服务名映射（静态方法，无缓存）
   * @returns {Map<string, object>}
   */
  static getServerNameMap() {
    const map = new Map();
    Object.entries(mcpServers).forEach(([fullKey, config]) => {
      const shortName = McpService.extractServerName(config.endpoint);
      map.set(shortName, {
        fullName: fullKey,
        shortName,
        ...config
      });
    });
    return map;
  }

  /**
   * 获取服务名映射（实例方法，带缓存）
   * @returns {Map<string, object>}
   */
  getServerNameMap() {
    if (!this._serverNameMap) {
      this._serverNameMap = McpService.getServerNameMap();
    }
    return this._serverNameMap;
  }

  /**
   * 获取简短服务名列表
   * @returns {string[]}
   */
  getShortServerNames() {
    return Array.from(this.getServerNameMap().keys());
  }

  /**
   * 根据简短名获取服务配置
   * @param {string} shortName - 简短名称 (如 "company")
   * @returns {object|null}
   */
  getServerByShortName(shortName) {
    return this.getServerNameMap().get(shortName) || null;
  }

  /**
   * 调用 MCP 工具
   * @param {string} serverName - 服务器名称 (支持简短名如 "company" 或完整名如 "qcc_company")
   * @param {string} toolName - 工具名称 (如 get_company_registration_info)
   * @param {object} args - 工具参数
   * @returns {Promise<object>} 工具执行结果
   */
  async callTool(serverName, toolName, args) {
    // 支持简短名和完整名
    let serverConfig = this.getServerByShortName(serverName);

    if (!serverConfig && mcpServers[serverName]) {
      // 使用完整名
      serverConfig = {
        fullName: serverName,
        shortName: McpService.extractServerName(mcpServers[serverName].endpoint),
        ...mcpServers[serverName]
      };
    }

    if (!serverConfig) {
      throw new QccError(
        ErrorType.SERVER_NOT_FOUND,
        `未知的服务器: ${serverName}`,
        { suggestion: `可用服务器: ${this.getShortServerNames().join(', ')}` }
      );
    }

    const config = configService.getMcpConfig();

    // 构建请求 URL
    const url = `${config.baseUrl}${serverConfig.endpoint}`;

    // 构建请求体
    const payload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args,
        _meta: {
          progressToken: 1
        }
      }
    };

    try {
      const response = await this.httpClient.post(url, payload, {
        headers: {
          'Authorization': config.authorization,
          'Accept': 'application/json, text/event-stream'
        },
        responseType: 'text'
      });

      return this.parseResponse(response.data);
    } catch (error) {
      if (error instanceof QccError) {
        throw error;
      }
      throw new QccError(
        ErrorType.MCP_ERROR,
        `调用 MCP 工具失败: ${error.message}`,
        { suggestion: '请检查网络连接和配置' }
      );
    }
  }

  /**
   * 从 MCP 服务获取工具列表
   * @param {string} serverName - 服务器名称
   * @returns {Promise<Array>} 工具列表
   */
  async fetchToolsFromServer(serverName) {
    const serverConfig = this.getServerByShortName(serverName);
    if (!serverConfig) {
      throw new QccError(
        ErrorType.SERVER_NOT_FOUND,
        `未知的服务器: ${serverName}`,
        { suggestion: `可用服务器: ${this.getShortServerNames().join(', ')}` }
      );
    }

    const config = configService.getMcpConfig();
    const url = `${config.baseUrl}${serverConfig.endpoint}`;

    const payload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/list',
      params: {}
    };

    try {
      const response = await this.httpClient.post(url, payload, {
        headers: {
          'Authorization': config.authorization,
          'Accept': 'application/json, text/event-stream'
        },
        responseType: 'text'
      });

      // 解析响应并提取工具列表
      const parsed = this.parseToolsListResponse(response.data);
      return parsed || [];
    } catch (error) {
      if (error instanceof QccError) {
        throw error;
      }
      throw new QccError(
        ErrorType.MCP_ERROR,
        `获取工具列表失败: ${error.message}`,
        { suggestion: '请检查网络连接和配置' }
      );
    }
  }

  /**
   * 解析 tools/list 响应
   * @param {string} data - 响应数据
   * @returns {Array|null} 工具列表
   */
  parseToolsListResponse(data) {
    // 先尝试解析 SSE 格式
    const sseData = parseSSEResponse(data);
    if (sseData?.result?.tools) {
      return sseData.result.tools;
    }

    // 尝试解析普通 JSON
    try {
      const jsonData = JSON.parse(data);
      if (jsonData?.result?.tools) {
        return jsonData.result.tools;
      }
    } catch (e) {
      // 解析失败
    }

    return null;
  }

  /**
   * 从所有 MCP 服务获取工具列表
   * @returns {Promise<object>} 服务器名 -> 工具列表
   */
  async fetchAllTools() {
    const results = {};
    const serverNames = this.getShortServerNames();

    for (const serverName of serverNames) {
      try {
        const tools = await this.fetchToolsFromServer(serverName);
        results[serverName] = {
          serverName,
          serverConfig: this.getServerByShortName(serverName),
          tools
        };
      } catch (error) {
        // 认证错误立即抛出，让调用方处理
        if (error instanceof QccError && error.type === ErrorType.AUTH_FAILED) {
          throw error;
        }
        // 其他错误记录但继续获取其他服务器
        results[serverName] = {
          serverName,
          serverConfig: this.getServerByShortName(serverName),
          tools: [],
          error: error.message
        };
      }
    }

    return results;
  }

  /**
   * 更新工具缓存
   * @returns {Promise<object>} 更新结果（可能为空对象如果全部失败）
   */
  async updateToolsCache() {
    const results = await this.fetchAllTools();

    // 检查是否有成功的工具
    const hasSuccess = Object.values(results).some(
      (r) => r.tools && r.tools.length > 0
    );

    // 只有至少有一个服务成功时才保存缓存
    if (hasSuccess) {
      configService.saveToolsCache(results);
      this._toolsCache = results;
    }

    return results;
  }

  /**
   * 获取缓存的工具列表
   * @returns {object|null}
   */
  getCachedTools() {
    if (this._toolsCache) {
      return this._toolsCache;
    }
    return configService.loadToolsCache();
  }

  /**
   * 确保工具缓存有效（如果过期则自动更新）
   * @param {string} [serverName] - 可选，指定只更新某个服务器的缓存
   * @returns {Promise<boolean>} 是否成功更新或缓存有效
   */
  async ensureToolsCache(serverName) {
    // 检查缓存是否过期
    if (!configService.isToolsCacheExpired()) {
      return true;
    }

    // 如果已经尝试过更新，不再重复尝试（也不重复抛出错误）
    if (this._updateAttempted) {
      return false;
    }

    // 缓存过期，需要更新
    this._updateAttempted = true;
    try {
      if (serverName) {
        // 只更新指定服务器的缓存
        const tools = await this.fetchToolsFromServer(serverName);

        // 只有获取成功且有工具时才更新缓存
        if (tools && tools.length > 0) {
          const existingCache = this.getCachedTools() || {};

          existingCache[serverName] = {
            serverName,
            serverConfig: this.getServerByShortName(serverName),
            tools
          };

          configService.saveToolsCache(existingCache);
          this._toolsCache = existingCache;
          this._updateAttempted = false;  // 成功后重置标记
          return true;
        }

        return false;
      } else {
        // 更新所有服务器的缓存
        const results = await this.updateToolsCache();

        // 检查是否有成功的工具
        const hasSuccess = Object.values(results).some(
          (r) => r.tools && r.tools.length > 0
        );

        if (hasSuccess) {
          this._updateAttempted = false;  // 成功后重置标记
        }
        return hasSuccess;
      }
    } catch (error) {
      // 认证错误立即抛出，让调用方处理
      if (error instanceof QccError && error.type === ErrorType.AUTH_FAILED) {
        this._lastUpdateError = error;
        throw error;
      }
      // 其他错误返回 false
      this._lastUpdateError = error;
      return false;
    }
  }

  /**
   * 解析 MCP 响应
   * @param {string} data - 响应数据
   * @returns {object} 解析后的结果
   */
  parseResponse(data) {
    const sseData = parseSSEResponse(data);
    if (sseData) {
      return extractMcpContent(sseData);
    }

    try {
      const jsonData = JSON.parse(data);
      return extractMcpContent(jsonData);
    } catch (e) {
      return data;
    }
  }

  /**
   * 获取所有可用的服务器列表
   * @returns {Array<object>} 服务器列表
   */
  getServers() {
    return Array.from(this.getServerNameMap().entries()).map(([shortName, config]) => ({
      name: shortName,
      fullName: config.fullName,
      displayName: config.name,
      description: config.description,
      endpoint: config.endpoint
    }));
  }

  /**
   * 获取指定服务器的信息
   * @param {string} serverName - 服务器名称（支持简短名或完整名）
   * @returns {object|null} 服务器信息
   */
  getServerInfo(serverName) {
    const config = this.getServerByShortName(serverName);
    if (!config) {
      // 尝试完整名
      if (mcpServers[serverName]) {
        return {
          name: McpService.extractServerName(mcpServers[serverName].endpoint),
          fullName: serverName,
          displayName: mcpServers[serverName].name,
          description: mcpServers[serverName].description,
          endpoint: mcpServers[serverName].endpoint
        };
      }
      return null;
    }

    return {
      name: config.shortName,
      fullName: config.fullName,
      displayName: config.name,
      description: config.description,
      endpoint: config.endpoint
    };
  }

  /**
   * 检查 MCP 配置是否有效
   * @returns {boolean} 是否有效
   */
  isConfigured() {
    return configService.isMcpConfigValid();
  }
}

// 导出单例实例
const mcpService = new McpService();

// 导出实例作为默认导出
module.exports = mcpService;

// 同时导出类和静态方法，便于测试和直接使用
module.exports.McpService = McpService;
module.exports.extractServerName = McpService.extractServerName;
module.exports.getServerNameMap = McpService.getServerNameMap;