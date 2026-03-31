const chalk = require('chalk');
const mcpService = require('../services/mcpService');
const { findTool } = require('./list-tools');
const { QccError, ErrorType } = require('../utils/httpClient');
const { jsonToMarkdown } = require('../utils/jsonToMarkdown');
const validator = require('../utils/validator');
const configService = require('../services/configService');

/**
 * 调用 MCP 工具
 * @param {string} serverName - 服务器名称（简短名，如 "company"）
 * @param {string} toolName - 工具名称
 * @param {object} params - 工具参数
 * @param {object} options - 命令选项（包含 json 标志）
 */
async function callMcp(serverName, toolName, params, options = {}) {
  // 先检查配置是否有效
  if (!configService.isMcpConfigValid()) {
    console.error(chalk.red('\n错误: 未找到配置文件或配置不完整'));
    console.error(chalk.yellow('\n请先初始化配置:'));
    console.error(chalk.gray('  qcc init --authorization <token>  配置授权信息'));
    console.error(chalk.gray('  qcc check                         检查配置状态'));
    process.exit(1);
  }

  // 检查缓存是否过期，如果过期则自动更新指定服务器的工具列表
  if (configService.isToolsCacheExpired()) {
    console.log(chalk.gray('工具缓存已过期，正在从服务器更新...\n'));
    const updated = await mcpService.ensureToolsCache(serverName);
    if (updated) {
      console.log(chalk.green(`已更新 ${serverName} 服务工具列表\n`));
    } else {
      console.log(chalk.yellow('更新失败，使用静态配置\n'));
    }
  }

  // 查找工具定义
  const tool = findTool(serverName, toolName);

  if (!tool) {
    const shortNames = mcpService.getShortServerNames();
    console.error(chalk.red(`错误: 未找到工具 "${serverName}/${toolName}"`));
    console.log(chalk.yellow('使用 "qcc list-tools" 查看可用工具'));
    console.log(chalk.yellow(`可用服务: ${shortNames.join(', ')}`));
    process.exit(1);
    return;
  }

  // 使用扩展的验证器进行参数验证（白名单 + 必填）
  const validation = validator.validateMcpTool(tool, params);
  if (!validation.valid) {
    console.error(chalk.red('错误: 参数验证失败'));
    validation.errors.forEach(err => console.error(chalk.red(`  - ${err}`)));
    console.log(chalk.yellow('\n工具参数说明:'));
    const props = tool.inputSchema?.properties || {};
    const required = tool.inputSchema?.required || [];
    Object.entries(props).forEach(([key, value]) => {
      const isRequired = required.includes(key);
      const reqMark = isRequired ? chalk.red('(必填)') : chalk.gray('(可选)');
      console.log(chalk.gray(`  --${key} ${reqMark} ${value.description || ''}`));
    });
    process.exit(1);
  }

  // 调用 MCP 服务
  try {
    console.log(chalk.gray(`正在调用 ${serverName}/${toolName}...\n`));

    const result = await mcpService.callTool(serverName, toolName, validation.params);

    // 根据 --json 选项决定输出格式
    if (options.json) {
      // 输出原始 JSON
      try {
        console.log(JSON.stringify(result, null, 2));
      } catch (e) {
        console.error(chalk.red('错误：无法序列化响应数据'));
        console.log(String(result));
      }
    } else {
      // 尝试解析为 Markdown 格式
      const markdown = jsonToMarkdown(result);
      if (markdown) {
        console.log(markdown);
      } else {
        // 无法格式化时输出原始 JSON
        console.log(JSON.stringify(result, null, 2));
      }
    }
  } catch (error) {
    if (error instanceof QccError) {
      console.error(chalk.red(`\n错误: ${error.message}`));
      if (error.suggestion) {
        console.error(chalk.yellow(`建议:\n${error.suggestion}`));
      }
    } else {
      console.error(chalk.red(`\n错误: ${error.message}`));
    }
    process.exit(1);
  }
}

module.exports = callMcp;