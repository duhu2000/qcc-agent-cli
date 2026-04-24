const {
  createHttpClient,
  parseSSEResponse,
  extractMcpContent,
  QccError,
  ErrorType,
  isAuthErrorResponse
} = require('../utils/httpClient');
const configService = require('./configService');
const mcpServers = require('../config/mcpServers.json');

class McpService {
  constructor() {
    this.httpClient = createHttpClient();
    this._serverNameMap = null;
    this._toolsCache = null;
    this._updateAttempted = false;
    this._lastUpdateError = null;
    this._lastUpdateResults = null;
  }

  static extractServerName(endpoint) {
    const match = endpoint.match(/^\/([^/]+)/);
    return match ? match[1] : endpoint.replace(/^\//, '').replace(/\/.*$/, '');
  }

  static getServerNameMap() {
    const map = new Map();
    Object.entries(mcpServers).forEach(([fullName, config]) => {
      const shortName = McpService.extractServerName(config.endpoint);
      map.set(shortName, {
        fullName,
        shortName,
        ...config
      });
    });
    return map;
  }

  getServerNameMap() {
    if (!this._serverNameMap) {
      this._serverNameMap = McpService.getServerNameMap();
    }
    return this._serverNameMap;
  }

  getShortServerNames() {
    return Array.from(this.getServerNameMap().keys());
  }

  getServerByShortName(shortName) {
    return this.getServerNameMap().get(shortName) || null;
  }

  resolveServerConfig(serverName) {
    let serverConfig = this.getServerByShortName(serverName);

    if (!serverConfig && mcpServers[serverName]) {
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

    return serverConfig;
  }

  async callTool(serverName, toolName, args) {
    const serverConfig = this.resolveServerConfig(serverName);
    const config = configService.getMcpConfig();
    const url = `${config.baseUrl}${serverConfig.endpoint}`;

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
          Authorization: config.authorization,
          Accept: 'application/json, text/event-stream'
        },
        timeout: config.timeout,
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

  async fetchToolsFromServer(serverName) {
    const serverConfig = this.resolveServerConfig(serverName);
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
          Authorization: config.authorization,
          Accept: 'application/json, text/event-stream'
        },
        timeout: config.timeout,
        responseType: 'text'
      });

      return this.parseToolsListResponse(response.data) || [];
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

  parseToolsListResponse(data) {
    const throwMcpResponseError = (response) => {
      if (!response?.error) {
        return;
      }

      const code = typeof response.error.code === 'number' ? response.error.code : undefined;
      const message = response.error.message || '获取工具列表失败';

      if (isAuthErrorResponse(code, response)) {
        throw new QccError(ErrorType.AUTH_FAILED, message, {
          code,
          suggestion: '身份凭证错误，请检查 Authorization 是否正确，或运行 qcc init 更新配置'
        });
      }

      throw new QccError(ErrorType.MCP_ERROR, message, {
        code,
        suggestion: '请检查服务权限或稍后重试'
      });
    };

    const sseData = parseSSEResponse(data);
    if (sseData) {
      throwMcpResponseError(sseData);
      if (Array.isArray(sseData?.result?.tools)) {
        return sseData.result.tools;
      }
    }

    try {
      const jsonData = JSON.parse(data);
      throwMcpResponseError(jsonData);
      if (Array.isArray(jsonData?.result?.tools)) {
        return jsonData.result.tools;
      }
    } catch (error) {
      if (error instanceof QccError) {
        throw error;
      }
    }

    return null;
  }

  async fetchAllTools() {
    const results = {};
    const serverNames = this.getShortServerNames();

    await Promise.all(serverNames.map(async (serverName) => {
      try {
        const tools = await this.fetchToolsFromServer(serverName);
        results[serverName] = {
          serverName,
          serverConfig: this.getServerByShortName(serverName),
          tools
        };
      } catch (error) {
        if (error instanceof QccError && error.type === ErrorType.AUTH_FAILED) {
          throw error;
        }

        results[serverName] = {
          serverName,
          serverConfig: this.getServerByShortName(serverName),
          tools: [],
          error: error.message,
          errorType: error.type,
          suggestion: error.suggestion
        };
      }
    }));

    this._lastUpdateResults = results;
    this._lastUpdateError = null;
    return results;
  }

  hasSuccessfulResults(results = {}) {
    return Object.values(results).some((result) => !result.error);
  }

  getUpdateFailureSummary(results = {}) {
    const failures = Object.values(results).filter((result) => result.error);
    if (failures.length === 0) {
      return null;
    }

    const authFailure = failures.find((result) => result.errorType === ErrorType.AUTH_FAILED);
    if (authFailure) {
      return {
        message: '请检查身份凭证是否有效: qcc init --authorization "Bearer YOUR_API_KEY"',
        suggestion: authFailure.suggestion || '请检查 Authorization 是否正确，或运行 qcc init 更新配置'
      };
    }

    const serverFailure = failures.find((result) => result.errorType === ErrorType.SERVER_ERROR);
    if (serverFailure) {
      return {
        message: '请检查网络连接，或稍后重试',
        suggestion: serverFailure.suggestion || '请检查网络连接，或稍后重试'
      };
    }

    const networkFailure = failures.find((result) => (
      result.errorType === ErrorType.NETWORK_ERROR || result.errorType === ErrorType.TIMEOUT
    ));
    if (networkFailure) {
      return {
        message: '请检查网络连接，或稍后重试',
        suggestion: networkFailure.suggestion || '请检查网络连接，或稍后重试'
      };
    }

    const firstFailure = failures[0];
    return {
      message: firstFailure.suggestion || '请检查请求配置或稍后重试',
      suggestion: firstFailure.suggestion || ''
    };
  }

  getFailureSummaryFromError(error) {
    if (!error) {
      return null;
    }

    return this.getUpdateFailureSummary({
      latest: {
        error: error.message,
        errorType: error.type,
        suggestion: error.suggestion
      }
    });
  }

  getLastUpdateFailureSummary() {
    if (this._lastUpdateResults) {
      return this.getUpdateFailureSummary(this._lastUpdateResults);
    }

    if (this._lastUpdateError) {
      return this.getFailureSummaryFromError(this._lastUpdateError);
    }

    return null;
  }

  async updateToolsCache() {
    const results = await this.fetchAllTools();
    this._lastUpdateResults = results;
    this._lastUpdateError = null;

    if (this.hasSuccessfulResults(results)) {
      configService.saveToolsCache(results);
      this._toolsCache = results;
    }

    return results;
  }

  getCachedTools() {
    if (this._toolsCache) {
      return this._toolsCache;
    }
    return configService.loadToolsCache();
  }

  async ensureToolsCache(serverName) {
    if (!configService.isToolsCacheExpired()) {
      return true;
    }

    if (this._updateAttempted) {
      return false;
    }

    this._updateAttempted = true;

    try {
      if (serverName) {
        const tools = await this.fetchToolsFromServer(serverName);

        if (tools && tools.length >= 0) {
          const existingCache = this.getCachedTools() || {};
          existingCache[serverName] = {
            serverName,
            serverConfig: this.getServerByShortName(serverName),
            tools: tools || []
          };

          configService.saveToolsCache(existingCache);
          this._toolsCache = existingCache;
          this._updateAttempted = false;
          return true;
        }

        return false;
      }

      const results = await this.updateToolsCache();
      const hasSuccess = this.hasSuccessfulResults(results);

      if (hasSuccess) {
        this._updateAttempted = false;
      }

      return hasSuccess;
    } catch (error) {
      if (error instanceof QccError && error.type === ErrorType.AUTH_FAILED) {
        this._lastUpdateError = error;
        throw error;
      }

      this._lastUpdateError = error;
      return false;
    }
  }

  parseResponse(data) {
    const sseData = parseSSEResponse(data);
    if (sseData) {
      return extractMcpContent(sseData);
    }

    try {
      const jsonData = JSON.parse(data);
      return extractMcpContent(jsonData);
    } catch (error) {
      return data;
    }
  }

  getServers() {
    return Array.from(this.getServerNameMap().entries()).map(([shortName, config]) => ({
      name: shortName,
      fullName: config.fullName,
      displayName: config.name,
      description: config.description,
      endpoint: config.endpoint
    }));
  }

  getServerInfo(serverName) {
    const config = this.getServerByShortName(serverName);
    if (!config) {
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

  isConfigured() {
    return configService.isMcpConfigValid();
  }
}

const mcpService = new McpService();

module.exports = mcpService;
module.exports.McpService = McpService;
module.exports.extractServerName = McpService.extractServerName;
module.exports.getServerNameMap = McpService.getServerNameMap;
