const chalk = require('chalk');
const configService = require('../services/configService');
const mcpService = require('../services/mcpService');

function getFirstFailure(results = {}) {
  return Object.values(results).find((item) => item.error);
}

/**
 * 初始化配置命令
 * @param {object} options - 命令行选项
 */
async function init(options) {
  console.log(chalk.bold('\n企业信息查询 CLI 配置初始化\n'));

  const integrity = configService.checkConfigIntegrity();
  if (integrity.exists && !integrity.valid) {
    console.log(chalk.red('警告: 配置文件已损坏'));
    console.log(chalk.gray(`错误详情: ${integrity.error}`));
    console.log(chalk.yellow('将创建新的配置文件覆盖损坏的配置\n'));
  }

  const config = configService.load() || { ...configService.DEFAULT_CONFIG };
  const hasAnyParam = options.mcpBaseUrl || options.authorization;

  if (!hasAnyParam) {
    console.log(chalk.yellow('请通过命令行参数进行配置:'));
    console.log(chalk.gray('\n  qcc init --authorization "Bearer YOUR_API_KEY"'));
    console.log(chalk.gray('  qcc init --mcpBaseUrl <url> --authorization "Bearer YOUR_API_KEY"'));
    console.log(chalk.gray('\n提示: mcpBaseUrl 默认为 https://agent.qcc.com/mcp，通常可省略'));
    process.exit(1);
  }

  if (options.mcpBaseUrl) {
    config.mcp.baseUrl = options.mcpBaseUrl;
  }
  if (options.authorization) {
    config.mcp.authorization = options.authorization;
  }

  if (options.mcpBaseUrl || options.authorization) {
    config.mcp.enabled = true;
  }

  if (!config.mcp.baseUrl) {
    config.mcp.baseUrl = configService.MCP_DEFAULT_BASE_URL;
  }

  configService.save(config);
  console.log(chalk.green('✓ 配置已保存!'));
  console.log(chalk.gray(`配置文件路径: ${configService.getConfigPath()}`));

  console.log(chalk.gray('\n正在从服务器更新工具列表...'));
  try {
    const results = await mcpService.updateToolsCache();
    const hasSuccess = mcpService.hasSuccessfulResults(results);

    if (hasSuccess) {
      console.log(chalk.green('✓ 工具列表已更新!'));
      return;
    }

    const firstFailure = getFirstFailure(results);
    const failureSummary = mcpService.getUpdateFailureSummary(results);
    console.log(chalk.yellow('工具列表更新失败'));
    if (firstFailure?.error) {
      console.log(chalk.gray(`错误: ${firstFailure.error}`));
    }
    if (failureSummary?.message) {
      console.log(chalk.yellow(`建议: ${failureSummary.message}`));
    }
  } catch (error) {
    if (error.type === 'AUTH_FAILED') {
      console.log(chalk.red('✗ 凭证不正确，工具列表更新失败'));
      console.log(chalk.yellow('建议: 请检查 Authorization 是否正确'));
    } else {
      console.log(chalk.yellow('工具列表更新失败'));
      console.log(chalk.gray(`错误: ${error.message}`));
      if (error.suggestion) {
        console.log(chalk.yellow(`建议: ${error.suggestion}`));
      }
    }
  }
}

module.exports = init;
