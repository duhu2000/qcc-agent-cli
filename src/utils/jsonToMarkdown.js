/**
 * JSON 转 Markdown 格式化工具
 * 将 JSON 对象转换为易读的 Markdown 格式
 */

/**
 * 检查值是否为普通对象（非数组、非 null）
 * @param {*} value - 要检查的值
 * @returns {boolean}
 */
function isJsonObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * 检查值是否为空值（null、undefined、空字符串、空数组）
 * @param {*} value - 要检查的值
 * @returns {boolean}
 */
function isEmptyValue(value) {
  if (value === null || value === undefined) {
    return true;
  }
  if (value === '') {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  return false;
}

/**
 * 格式化基本类型值
 * - 空值（null、undefined、空字符串）显示为 "-"
 * - 布尔值：true → "是"，false → "否"
 * - 数值：保持原样（包括 0）
 * - 字符串：保持原样
 * @param {*} value - 要格式化的值
 * @returns {string}
 */
function formatPrimitive(value) {
  // 空值显示为 "-"
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  // 布尔值转换
  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }

  // 其他类型直接返回字符串
  return String(value);
}

/**
 * 获取对象数组的所有字段名（合并）
 * @param {Array<object>} arr - 对象数组
 * @returns {string[]} 所有字段名
 */
function getAllKeys(arr) {
  const keySet = new Set();
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (isJsonObject(item)) {
      const keys = Object.keys(item);
      for (let j = 0; j < keys.length; j++) {
        keySet.add(keys[j]);
      }
    }
  }
  return Array.from(keySet);
}

/**
 * 格式化数组值为可读字符串
 * - 基本类型数组：逗号分隔
 * - 对象数组：JSON 字符串（简化）
 * @param {Array} arr - 数组
 * @returns {string}
 */
function formatArrayValue(arr) {
  // 检查是否全部为基本类型
  let allPrimitive = true;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item !== null && typeof item === 'object') {
      allPrimitive = false;
      break;
    }
  }

  if (allPrimitive) {
    // 基本类型数组用逗号分隔
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(formatPrimitive(arr[i]));
    }
    return result.join(', ');
  }

  // 对象数组使用简化 JSON 格式
  return JSON.stringify(arr)
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ');
}

/**
 * 转义 Markdown 表格中的特殊字符
 * @param {*} value - 要转义的值
 * @returns {string}
 */
function escapeTableValue(value) {
  // 空值显示为 "-"
  if (isEmptyValue(value)) {
    return '-';
  }

  // 布尔值转换
  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }

  // 数组：用逗号分隔或简化 JSON
  if (Array.isArray(value)) {
    return formatArrayValue(value);
  }

  // 对象：简化 JSON 格式
  if (typeof value === 'object') {
    return JSON.stringify(value)
      .replace(/\|/g, '\\|')
      .replace(/\n/g, ' ');
  }

  return String(value)
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ');
}

/**
 * 将对象数组转换为 Markdown 表格
 * @param {Array<object>} arr - 对象数组
 * @param {number} indent - 缩进级别
 * @returns {string}
 */
function arrayToTable(arr, indent = 0) {
  const indentStr = '  '.repeat(indent);
  const keys = getAllKeys(arr);

  if (keys.length === 0) {
    return '';
  }

  const lines = [];

  // 表头
  lines.push(`${indentStr}| ${keys.join(' | ')} |`);
  lines.push(`${indentStr}| ${keys.map(() => ':---').join(' | ')} |`);

  // 数据行 - 使用 for 循环优化性能
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const values = [];
    for (let j = 0; j < keys.length; j++) {
      values.push(escapeTableValue(item[keys[j]]));
    }
    lines.push(`${indentStr}| ${values.join(' | ')} |`);
  }

  return lines.join('\n');
}

/**
 * 将值转换为 Markdown 格式（带循环引用检测）
 * @param {*} value - 要转换的值
 * @param {number} indent - 缩进级别
 * @param {WeakSet} seen - 已访问对象集合（用于检测循环引用）
 * @returns {string}
 */
function valueToMarkdown(value, indent = 0, seen = new WeakSet()) {
  const indentStr = '  '.repeat(indent);

  // 空值显示为 "-"
  if (isEmptyValue(value)) {
    return '-';
  }

  if (Array.isArray(value)) {
    // 检查是否为对象数组
    let isObjectArray = false;
    for (let i = 0; i < value.length; i++) {
      if (isJsonObject(value[i])) {
        isObjectArray = true;
        break;
      }
    }

    if (isObjectArray) {
      // 对象数组转表格
      return '\n' + arrayToTable(value, indent);
    } else {
      // 基本类型数组用逗号分隔
      const result = [];
      for (let i = 0; i < value.length; i++) {
        result.push(formatPrimitive(value[i]));
      }
      return result.join(', ');
    }
  }

  if (isJsonObject(value)) {
    // 循环引用检测
    if (seen.has(value)) {
      return '[循环引用]';
    }
    seen.add(value);

    // 嵌套对象，递归处理
    const lines = [];
    const entries = Object.entries(value);
    for (let i = 0; i < entries.length; i++) {
      const [k, v] = entries[i];
      const nestedValue = valueToMarkdown(v, indent + 1, seen);
      lines.push(`${indentStr}  * ${k}: ${nestedValue}`);
    }
    return '\n' + lines.join('\n');
  }

  // 基本类型（包括布尔值转换）
  return formatPrimitive(value);
}

/**
 * 将 JSON 对象转换为 Markdown 格式
 * @param {*} data - 要转换的数据
 * @returns {string} Markdown 格式字符串
 */
function jsonToMarkdown(data) {
  // 处理 null 输入
  if (data === null || data === undefined) {
    return '-';
  }

  // 处理非对象输入（字符串等）
  if (!isJsonObject(data)) {
    return String(data);
  }

  // 循环引用检测
  const seen = new WeakSet();
  seen.add(data);

  const lines = [];
  const entries = Object.entries(data);

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];

    // 空数组显示为 "-"
    if (Array.isArray(value) && value.length === 0) {
      lines.push(`* ${key}: -`);
      continue;
    }

    if (Array.isArray(value)) {
      // 检查是否为对象数组
      let isObjectArray = false;
      for (let j = 0; j < value.length; j++) {
        if (isJsonObject(value[j])) {
          isObjectArray = true;
          break;
        }
      }

      if (isObjectArray) {
        // 对象数组
        lines.push(`* ${key}:`);
        lines.push(arrayToTable(value, 0));
      } else {
        // 基本类型数组
        const formattedValue = valueToMarkdown(value, 0, seen);
        lines.push(`* ${key}: ${formattedValue}`);
      }
    } else if (isJsonObject(value)) {
      // 循环引用检测
      if (seen.has(value)) {
        lines.push(`* ${key}: [循环引用]`);
      } else {
        seen.add(value);
        // 嵌套对象
        lines.push(`* ${key}:`);
        const nestedEntries = Object.entries(value);
        for (let j = 0; j < nestedEntries.length; j++) {
          const [k, v] = nestedEntries[j];
          const nestedValue = valueToMarkdown(v, 1, seen);
          lines.push(`  * ${k}: ${nestedValue}`);
        }
      }
    } else {
      // 基本类型
      const formattedValue = valueToMarkdown(value, 0, seen);
      lines.push(`* ${key}: ${formattedValue}`);
    }
  }

  return lines.join('\n');
}

module.exports = {
  jsonToMarkdown,
  isJsonObject,
  isEmptyValue,
  formatPrimitive,
  formatArrayValue,
  escapeTableValue
};