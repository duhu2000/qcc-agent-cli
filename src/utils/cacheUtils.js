/**
 * MCP 工具缓存工具函数
 * 提供缓存的读取和查询功能，切断 update.js 与其他模块的循环依赖
 */

const configService = require('../services/configService');

/**
 * 获取缓存的工具列表（严格检查过期）
 * @returns {object|null} 缓存数据
 */
function getCachedTools() {
  return configService.loadToolsCache();
}

/**
 * 获取缓存的工具列表（忽略过期，用于降级备用）
 * @returns {object|null} 缓存数据
 */
function getCachedToolsWithFallback() {
  return configService.loadToolsCacheWithFallback();
}

/**
 * 获取服务器的所有工具（从缓存获取，无缓存返回空数组）
 * @param {string} serverName - 服务器名称（简短名如 "company"）
 * @returns {Array} 工具列表
 */
function getServerToolsFromCache(serverName) {
  const cache = getCachedTools();
  return cache?.[serverName]?.tools || [];
}

/**
 * 获取服务器的所有工具（使用降级缓存）
 * @param {string} serverName - 服务器名称（简短名如 "company"）
 * @returns {Array} 工具列表
 */
function getServerToolsFromCacheWithFallback(serverName) {
  const cache = getCachedToolsWithFallback();
  return cache?.[serverName]?.tools || [];
}

/**
 * 获取工具定义（从缓存获取）
 * @param {string} serverName - 服务器名称（简短名）
 * @param {string} toolName - 工具名称
 * @returns {object|null} 工具定义
 */
function getToolDefinition(serverName, toolName) {
  const tools = getServerToolsFromCache(serverName);
  return tools.find(t => t.name === toolName) || null;
}

/**
 * 获取所有工具的扁平列表（从缓存获取）
 * @returns {Array<object>} 工具列表，每项包含 server, serverName, name, description, inputSchema
 */
function getAllToolsFlat() {
  const cache = getCachedTools();
  if (!cache) return [];

  const tools = [];

  Object.keys(cache).forEach((serverName) => {
    const serverData = cache[serverName];
    const serverTools = serverData?.tools || [];
    const serverConfig = serverData?.serverConfig;

    serverTools.forEach((tool) => {
      tools.push({
        server: serverName,
        serverName: serverConfig?.name || serverName,
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
  getCachedToolsWithFallback,
  getServerToolsFromCache,
  getServerToolsFromCacheWithFallback,
  getToolDefinition,
  getAllToolsFlat
};