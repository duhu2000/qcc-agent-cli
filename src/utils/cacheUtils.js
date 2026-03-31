/**
 * MCP 工具缓存工具函数
 * 提供缓存的读取和查询功能，切断 update.js 与其他模块的循环依赖
 */

const configService = require('../services/configService');
const mcpTools = require('../config/mcpTools');

/**
 * 获取缓存的工具列表
 * @returns {object|null} 缓存数据
 */
function getCachedTools() {
  return configService.loadToolsCache();
}

/**
 * 获取服务器的所有工具（优先缓存，无缓存或空缓存则使用静态配置）
 * @param {string} serverName - 服务器名称（简短名如 "company"）
 * @returns {Array} 工具列表
 */
function getServerToolsFromCache(serverName) {
  // 尝试从缓存获取
  const cache = getCachedTools();
  const cachedTools = cache?.[serverName]?.tools;

  // 缓存有效且有工具时返回缓存数据
  if (cachedTools && cachedTools.length > 0) {
    return cachedTools;
  }

  // 回退到静态配置
  const serverKey = `qcc_${serverName}`;
  return mcpTools[serverKey]?.tools || [];
}

/**
 * 获取工具定义（优先缓存，无缓存或空缓存则使用静态配置）
 * @param {string} serverName - 服务器名称（简短名）
 * @param {string} toolName - 工具名称
 * @returns {object|null} 工具定义
 */
function getToolDefinition(serverName, toolName) {
  // 使用 getServerToolsFromCache 确保一致性
  const tools = getServerToolsFromCache(serverName);
  return tools.find(t => t.name === toolName) || null;
}

/**
 * 获取所有工具的扁平列表
 * @returns {Array<object>} 工具列表，每项包含 server, serverName, name, description, inputSchema
 */
function getAllToolsFlat() {
  const tools = [];

  // 使用 getServerToolsFromCache 确保一致性，遍历所有服务
  Object.keys(mcpTools).forEach((fullKey) => {
    const shortName = fullKey.replace(/^qcc_/, '');
    const serverTools = getServerToolsFromCache(shortName);
    const serverConfig = mcpTools[fullKey];

    serverTools.forEach((tool) => {
      tools.push({
        server: shortName,
        serverName: serverConfig.name,
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema
      });
    });
  });

  return tools;
}

module.exports = {
  getCachedTools,
  getServerToolsFromCache,
  getToolDefinition,
  getAllToolsFlat
};