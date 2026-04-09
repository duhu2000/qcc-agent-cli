const chalk = require('chalk');
const configService = require('../services/configService');
const mcpService = require('../services/mcpService');

/**
 * 初始化配置命令
 * @param {object} options - 命令行选项
 */
async function init(options) {
  console.log(chalk.bold('\n企业信息查询 CLI 配置初始化\n'));

  // 检查配置文件完整性
  const integrity = configService.checkConfigIntegrity();
  if (integrity.exists && !integrity.valid) {
    console.log(chalk.red('警告: 配置文件已损坏'));
    console.log(chalk.gray(`错误详情：${integrity.error}`));
    console.log(chalk.yellow('将创建新的配置文件覆盖损坏的配置\n'));
  }

  // 加载或创建默认配置
  let config = configService.load() || { ...configService.DEFAULT_CONFIG };

  // 检查是否提供了任何参数
  const hasAnyParam = options.mcpBaseUrl || options.authorization;

  if (hasAnyParam) {
    // MCP 配置
    if (options.mcpBaseUrl) {
      config.mcp.baseUrl = options.mcpBaseUrl;
    }
    if (options.authorization) {
      config.mcp.authorization = options.authorization;
    }

    // 根据提供的配置自动启用对应模式
    if (options.mcpBaseUrl || options.authorization) {
      config.mcp.enabled = true;
    }

    // 确保 mcp.baseUrl 有默认值
    if (!config.mcp.baseUrl) {
      config.mcp.baseUrl = configService.MCP_DEFAULT_BASE_URL;
    }

    configService.save(config);
    console.log(chalk.green('✓ 配置已保存!'));
    console.log(chalk.gray(`配置文件路径: ${configService.getConfigPath()}`));

    // 配置成功后自动更新工具列表
    console.log(chalk.gray('\n正在从服务器更新工具列表...'));
    try {
      await mcpService.updateToolsCache();
      console.log(chalk.green('✓ 工具列表已更新!'));
    } catch (error) {
      if (error.type === 'AUTH_FAILED') {
        console.log(chalk.red('✗ 凭证不正确，工具列表更新失败'));
        console.log(chalk.yellow('建议: 请检查 Authorization 是否正确'));
      } else {
        console.log(chalk.yellow('工具列表更新失败'));
        console.log(chalk.gray(`错误: ${error.message}`));
      }
    }
    return;
  }

  // 无参数时显示使用说明
  console.log(chalk.yellow('请通过命令行参数进行配置：'));
  console.log(chalk.gray('\n  qcc init --authorization "Bearer YOUR_API_KEY"'));
  console.log(chalk.gray('  qcc init --mcpBaseUrl <url> --authorization "Bearer YOUR_API_KEY"'));
  console.log(chalk.gray('\n提示: mcpBaseUrl 默认为 https://agent.qcc.com/mcp，通常可省略'));
  process.exit(1);
}

module.exports = init;