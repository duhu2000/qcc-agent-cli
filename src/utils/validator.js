/**
 * MCP 参数验证模块
 */

/**
 * 验证 MCP 工具参数
 * 基于 inputSchema 进行白名单验证和必填参数检查
 * @param {object} tool - 工具定义对象，包含 inputSchema
 * @param {object} userInput - 用户输入的参数对象
 * @returns {object} 验证结果 { valid: boolean, errors: string[], params: object }
 */
function validateMcpParams(tool, userInput) {
  const errors = [];
  const params = {};

  if (!tool) {
    return { valid: false, errors: ['工具定义不存在'], params: {} };
  }

  const inputSchema = tool.inputSchema || {};
  const properties = inputSchema.properties || {};
  const required = inputSchema.required || [];

  // 获取定义的参数键
  const definedKeys = new Set(Object.keys(properties));

  // 获取用户输入的所有参数键
  const userInputKeys = Object.keys(userInput || {});

  // 白名单校验：检查用户输入的参数是否都在定义中存在
  userInputKeys.forEach(key => {
    if (!definedKeys.has(key)) {
      errors.push(`未知参数：--${key}`);
    }
  });

  // 如果有白名单错误，直接返回
  if (errors.length > 0) {
    return { valid: false, errors, params: {} };
  }

  // 必填参数校验
  required.forEach(key => {
    const value = userInput[key];
    if (value === undefined || value === null || value === '') {
      const propDef = properties[key] || {};
      errors.push(`缺少必填参数：--${key}${propDef.description ? ` (${propDef.description})` : ''}`);
    }
  });

  // 收集有效参数
  userInputKeys.forEach(key => {
    if (definedKeys.has(key) && userInput[key] !== undefined && userInput[key] !== null) {
      params[key] = userInput[key];
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    params
  };
}

/**
 * 类型验证辅助函数
 * @param {string} type - JSON Schema 类型
 * @param {any} value - 要验证的值
 * @returns {boolean} 是否符合类型
 */
function validateType(type, value) {
  if (value === undefined || value === null) {
    return true; // 允许可选参数为空
  }

  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
    case 'integer':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && !Array.isArray(value) && value !== null;
    default:
      return true; // 未知类型允许通过
  }
}

/**
 * 验证 MCP 工具参数（包含类型检查）
 * @param {object} tool - 工具定义对象
 * @param {object} userInput - 用户输入的参数对象
 * @param {object} options - 验证选项 { checkType: boolean }
 * @returns {object} 验证结果 { valid: boolean, errors: string[], params: object }
 */
function validateMcpTool(tool, userInput, options = {}) {
  const { checkType = false } = options;

  // 先进行基本验证（白名单 + 必填）
  const basicResult = validateMcpParams(tool, userInput);
  if (!basicResult.valid) {
    return basicResult;
  }

  // 如果启用类型检查
  if (checkType) {
    const errors = [];
    const properties = tool.inputSchema?.properties || {};

    Object.entries(basicResult.params).forEach(([key, value]) => {
      const propDef = properties[key] || {};
      const expectedType = propDef.type;

      if (expectedType && !validateType(expectedType, value)) {
        errors.push(`参数 --${key} 类型错误：期望 ${expectedType}，实际 ${typeof value}`);
      }
    });

    if (errors.length > 0) {
      return { valid: false, errors, params: {} };
    }
  }

  return basicResult;
}

module.exports = {
  validateMcpParams,
  validateMcpTool,
  validateType
};