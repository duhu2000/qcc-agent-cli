const chalk = require('chalk');
const mcpService = require('../services/mcpService');
const { findTool } = require('./list-tools');
const { QccError } = require('../utils/httpClient');
const { jsonToMarkdown } = require('../utils/jsonToMarkdown');
const validator = require('../utils/validator');
const configService = require('../services/configService');
const { buildToolCommandExample, getArrayParamHint } = require('../utils/commandExample');

async function callMcp(serverName, toolName, params, options = {}) {
  const log = options.json ? console.error : console.log;
  if (!configService.isMcpConfigValid()) {
    try {
      configService.getMcpConfig();
    } catch (error) {
      if (error.type === 'CONFIG_INVALID_BASE_URL') {
        console.error(chalk.red(`\n错误: ${error.message}`));
        console.error(chalk.yellow(`建议: ${error.suggestion}`));
      } else {
        console.error(chalk.red('\n错误: 未找到配置文件或配置不完整'));
        console.error(chalk.yellow('\n请先初始化配置:'));
        console.error(chalk.yellow('  qcc init --authorization "<token>"  配置授权信息'));
        console.error(chalk.yellow('  qcc check                         检查配置状态'));
      }
    }
    process.exit(1);
    return;
  }

  if (configService.isToolsCacheExpired()) {
    log(chalk.gray('工具缓存已过期，正在从服务器更新...\n'));
    try {
      const updated = await mcpService.ensureToolsCache(serverName);
      if (!updated) {
        const failureSummary = mcpService.getLastUpdateFailureSummary();
        log(chalk.yellow('缓存更新失败，使用已有缓存\n'));
        if (failureSummary?.message) {
          log(chalk.yellow(`${failureSummary.message}\n`));
        }
      }
    } catch (error) {
      if (error.type === 'AUTH_FAILED') {
        console.error(chalk.red('错误: 更新失败: 凭证不正确\n'));
        console.error(chalk.red('错误: 工具列表获取失败'));
        console.error(chalk.yellow('建议: 请检查 Authorization 是否正确，或运行 qcc init 更新配置'));
        process.exit(1);
      } else {
        const failureSummary = mcpService.getFailureSummaryFromError(error);
        log(chalk.yellow(`更新失败: ${error.message}\n`));
        if (failureSummary?.message) {
          log(chalk.yellow(`${failureSummary.message}\n`));
        }
      }
    }
  }

  // 刷新失败后复用既有旧缓存；与启动时选择的降级工具列表保持一致。
  const tool = findTool(serverName, toolName)
    || configService.loadToolsCacheWithFallback()?.[serverName]?.tools?.find(item => item.name === toolName);
  if (!tool) {
    const shortNames = mcpService.getShortServerNames();
    console.error(chalk.red(`错误: 未找到工具 "${serverName}/${toolName}"`));
    log(chalk.yellow('使用 "qcc list-tools" 查看可用工具'));
    log(chalk.yellow('或运行 "qcc update" 更新工具列表'));
    log(chalk.yellow(`可用服务: ${shortNames.join(', ')}`));
    process.exit(1);
    return;
  }

  const validation = validator.validateMcpTool(tool, params, { coerceTypes: true, checkType: true });
  if (!validation.valid) {
    console.error(chalk.red('错误: 参数校验失败'));
    validation.errors.forEach((err) => console.error(chalk.red(`  - ${err}`)));

    const props = tool.inputSchema?.properties || {};
    const required = tool.inputSchema?.required || [];
    const example = buildToolCommandExample(serverName, toolName, tool, params);
    const arrayHint = getArrayParamHint(tool, params);

    log(chalk.yellow('\n正确调用示例:'));
    log(chalk.gray(`  ${example}`));
    if (arrayHint) {
      log(chalk.gray(`  ${arrayHint}`));
    }

    log(chalk.yellow('\n工具参数说明:'));
    Object.entries(props).forEach(([key, value]) => {
      const isRequired = required.includes(key);
      const reqMark = isRequired ? chalk.red('(必填)') : chalk.gray('(可选)');
      log(chalk.gray(`  --${key} ${reqMark} ${value.description || ''}`));
    });
    process.exit(1);
  }

  try {
    log(chalk.gray(`正在调用 ${serverName}/${toolName}...\n`));

    const result = await mcpService.callTool(serverName, toolName, validation.params);

    if (options.json) {
      try {
        console.log(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error(chalk.red('错误: 无法序列化响应数据'));
        console.log(String(result));
      }
    } else {
      const markdown = jsonToMarkdown(result);
      if (markdown) {
        console.log(markdown);
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    }
  } catch (error) {
    if (error instanceof QccError) {
      if (options.json && error.rawResponse !== undefined) {
        console.log(JSON.stringify(error.rawResponse, null, 2));
      }
      console.error(chalk.red(`\n错误: ${error.message}`));
      if (error.serverMessage && error.serverMessage !== error.message) {
        console.error(chalk.red(`  原因: ${error.serverMessage}`));
      }
      if (error.serverCode !== undefined) console.error(chalk.red(`  code: ${error.serverCode}`));
      if (error.suggestion) {
        console.error(chalk.yellow(`建议:\n${error.suggestion}`));
      }
    } else {
      console.error(chalk.red(`\n错误: ${error.message}`));
    }
    // Let stdout/stderr drain before the failed command exits.
    process.exitCode = 1;
  }
}

module.exports = callMcp;
