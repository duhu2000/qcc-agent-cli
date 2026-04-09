const chalk = require('chalk');
const mcpService = require('../services/mcpService');
const configService = require('../services/configService');

/**
 * 更新 MCP 工具缓存
 */
async function updateTools() {
  console.log(chalk.bold('\n正在更新工具信息...\n'));

  // 检查配置
  if (!configService.isMcpConfigValid()) {
    console.error(chalk.red('错误: 配置不完整'));
    console.log(chalk.yellow('请先运行 qcc init --authorization "Bearer YOUR_API_KEY" 进行配置'));
    process.exit(1);
  }

  const servers = mcpService.getShortServerNames();
  const allTools = {};
  const results = {
    success: [],
    failed: [],
    totalTools: 0
  };

  // 单次遍历：获取工具并保存结果
  for (const serverName of servers) {
    process.stdout.write(chalk.gray(`  获取 ${serverName} 工具列表... `));

    try {
      const tools = await mcpService.fetchToolsFromServer(serverName);
      results.success.push({
        server: serverName,
        toolCount: tools.length
      });
      results.totalTools += tools.length;

      if (tools.length > 0) {
        allTools[serverName] = {
          serverName,
          serverConfig: mcpService.getServerByShortName(serverName),
          tools
        };
      }
      console.log(chalk.green(`✓ ${tools.length} 个工具`));
    } catch (error) {
      results.failed.push({
        server: serverName,
        error: error.message
      });
      console.log(chalk.red(`✗ ${error.message}`));
    }
  }

  // 只有至少有一个服务成功时才保存缓存
  if (results.success.length > 0) {
    configService.saveToolsCache(allTools);
    console.log(chalk.bold('\n更新结果:'));
    console.log(chalk.green(`  成功: ${results.success.length} 个服务`));
    console.log(chalk.green(`  工具: ${results.totalTools} 个`));

    if (results.failed.length > 0) {
      console.log(chalk.yellow(`  失败: ${results.failed.length} 个服务`));
      results.failed.forEach(f => {
        console.log(chalk.yellow(`    - ${f.server}: ${f.error}`));
      });
    }

    console.log(chalk.gray(`\n缓存已保存到: ${configService.getConfigPath().replace('config.json', 'cache/tools.json')}`));
  } else {
    // 所有服务都失败，不保存缓存
    console.log(chalk.bold('\n更新结果:'));
    console.log(chalk.red(`  成功: 0 个服务`));
    console.log(chalk.red(`  失败: ${results.failed.length} 个服务`));
    results.failed.forEach(f => {
      console.log(chalk.red(`    - ${f.server}: ${f.error}`));
    });
    console.log(chalk.yellow('\n所有服务更新失败，缓存未更新'));
    console.log(chalk.yellow('请检查身份凭证是否有效: qcc init --authorization "Bearer YOUR_API_KEY"'));
  }
}

module.exports = {
  updateTools
};