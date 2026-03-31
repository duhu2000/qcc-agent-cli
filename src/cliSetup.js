/**
 * CLI 设置模块
 * 负责注册所有命令和处理默认行为
 */

const { Command } = require('commander');
const { version } = require('../package.json');
const listToolsCommand = require('./commands/list-tools');
const initCommand = require('./commands/init');
const checkCommand = require('./commands/check');
const callMcpCommand = require('./commands/call-mcp');
const configCommand = require('./commands/config');
const { updateTools } = require('./commands/update');
const mcpTools = require('./config/mcpTools');
const mcpService = require('./services/mcpService');
const { getServerToolsFromCache } = require('./utils/cacheUtils');

/**
 * 获取服务器的工具列表（优先缓存）
 * @param {string} serverName - 服务器名称
 * @returns {Array} 工具列表
 */
function getServerTools(serverName) {
  const cachedTools = getServerToolsFromCache(serverName);
  if (cachedTools.length > 0) {
    return cachedTools;
  }
  const fullKey = `qcc_${serverName}`;
  return mcpTools[fullKey]?.tools || [];
}

/**
 * 注册静态命令（init, list-tools, update, check, config）
 * @param {Command} program - Commander 程序实例
 */
function registerStaticCommands(program) {
  // init 子命令
  program
    .command('init')
    .description('初始化配置')
    .option('--mcpBaseUrl <url>', 'MCP 服务基础地址')
    .option('--authorization <token>', 'MCP Authorization Token')
    .action((options) => {
      initCommand(options);
    });

  // list-tools 子命令
  program
    .command('list-tools [serverName]')
    .description('显示 MCP 工具列表')
    .action((serverName) => {
      listToolsCommand.listTools(serverName);
    });

  // update 子命令
  program
    .command('update')
    .description('从 MCP 服务更新工具信息缓存')
    .action(async () => {
      await updateTools();
    });

  // check 子命令
  program
    .command('check')
    .description('检查配置状态')
    .action(() => {
      checkCommand();
    });

  // config 子命令
  const configCmd = program
    .command('config')
    .description('配置管理')
    .action(() => {
      // 不带子命令时默认列出所有配置
      configCommand.listConfig();
    });

  configCmd
    .command('set <keyPath> <value>')
    .description('设置配置项')
    .action((keyPath, value) => {
      configCommand.setConfig(keyPath, value);
    });

  configCmd
    .command('get <keyPath>')
    .description('获取配置项')
    .action((keyPath) => {
      configCommand.getConfig(keyPath);
    });

  configCmd
    .command('list')
    .description('列出所有配置')
    .action(() => {
      configCommand.listConfig();
    });
}

/**
 * 注册 MCP 服务器命令
 * @param {Command} program - Commander 程序实例
 */
function registerMcpCommands(program) {
  const shortServerNames = mcpService.getShortServerNames();

  shortServerNames.forEach((shortName) => {
    const serverConfig = mcpService.getServerByShortName(shortName);
    if (!serverConfig) return;

    const serverCmd = program
      .command(shortName)
      .description(`${serverConfig.name} - ${serverConfig.description}`)
      .action(() => {
        // 不带工具名时，提示用户指定工具
        console.error(`错误: 请指定要使用的工具`);
        console.log(`\n使用 "qcc list-tools ${shortName}" 查看可用工具`);
        const tools = getServerTools(shortName);
        if (tools.length > 0) {
          console.log('\n可用工具:');
          tools.slice(0, 10).forEach(t => {
            console.log(`  ${t.name}`);
          });
          if (tools.length > 10) {
            console.log(`  ... 共 ${tools.length} 个工具`);
          }
        }
        process.exit(1);
      })
      .on('command:*', (operands) => {
        // 捕获无效工具名
        console.error(`错误: 服务 "${shortName}" 中未找到工具 "${operands[0]}"`);
        console.log(`\n使用 "qcc list-tools ${shortName}" 查看可用工具`);
        const tools = getServerTools(shortName);
        if (tools.length > 0) {
          console.log('\n可用工具:');
          tools.slice(0, 10).forEach(t => {
            console.log(`  ${t.name}`);
          });
          if (tools.length > 10) {
            console.log(`  ... 共 ${tools.length} 个工具`);
          }
        }
        process.exit(1);
      });

    const tools = getServerTools(shortName);

    tools.forEach((tool) => {
      const toolCmd = serverCmd
        .command(tool.name)
        .description(tool.description || '')
        .configureOutput({
          writeErr: () => {} // 抑制 Commander 默认错误输出
        })
        .exitOverride((err) => {
          // 处理未知选项错误
          if (err.code === 'commander.unknownOption') {
            const option = err.message.match(/'([^']+)'/)?.[1] || err.message;
            console.error(`错误: 未知选项 ${option}`);
            console.log(`\n工具 ${tool.name} 参数说明:`);
            const toolProps = tool.inputSchema?.properties || {};
            const toolRequired = tool.inputSchema?.required || [];
            Object.entries(toolProps).forEach(([key, value]) => {
              const isRequired = toolRequired.includes(key);
              const reqMark = isRequired ? '(必填)' : '(可选)';
              console.log(`  --${key} ${reqMark} ${value.description || ''}`);
            });
            process.exit(1);
          }
          // 处理缺少参数值错误
          if (err.code === 'commander.optionMissingArgument') {
            const option = err.message.match(/'([^']+)'/)?.[1] || '参数';
            console.error(`错误: 选项 ${option} 缺少值`);
            console.log('\n使用 --help 查看参数说明');
            process.exit(1);
          }
          throw err;
        });

      toolCmd.option('--json', '输出原始 JSON 格式');

      const props = tool.inputSchema?.properties || {};
      const required = tool.inputSchema?.required || [];

      Object.entries(props).forEach(([key, value]) => {
        const isRequired = required.includes(key);
        const flag = isRequired ? `--${key} <value>` : `--${key} [value]`;
        const desc = isRequired
          ? `${value.description || ''} (必填)`
          : `${value.description || ''} (可选)`;
        toolCmd.option(flag, desc);
      });

      const defaultParamKey = props.searchKey ? 'searchKey' : required[0];
      if (defaultParamKey) {
        toolCmd.argument('[positionalArg]', `默认参数（映射到 --${defaultParamKey}）`);
      }

      toolCmd.action(async (positionalArg, options) => {
        const { json, ...params } = options;

        if (defaultParamKey && positionalArg !== undefined && !params[defaultParamKey]) {
          params[defaultParamKey] = positionalArg;
        }

        await callMcpCommand(shortName, tool.name, params, { json });
      });
    });
  });
}

/**
 * 注册默认行为处理器
 * @param {Command} program - Commander 程序实例
 */
function registerDefaultHandler(program) {
  const shortServerNames = mcpService.getShortServerNames();

  program
    .argument('[arg1]')
    .argument('[arg2]')
    .argument('[positionalArg]', '搜索关键词')
    .action(async (arg1, arg2, positionalArg) => {
      // 如果 arg1 是 MCP 服务器名（简短名）
      const serverConfig = mcpService.getServerByShortName(arg1);

      if (serverConfig) {
        if (!arg2) {
          listToolsCommand.listTools(arg1);
          return;
        }

        const tools = getServerTools(arg1);
        const tool = tools.find(t => t.name === arg2);

        if (!tool) {
          console.error(`错误：服务 ${arg1} 中未找到工具 ${arg2}`);
          console.log(`使用 "qcc list-tools ${arg1}" 查看可用工具`);
          process.exit(1);
        }

        const props = tool.inputSchema?.properties || {};
        const required = tool.inputSchema?.required || [];
        const defaultParamKey = props.searchKey ? 'searchKey' : required[0];

        if (positionalArg) {
          const params = defaultParamKey ? { [defaultParamKey]: positionalArg } : {};
          await callMcpCommand(arg1, arg2, params, {});
          return;
        }

        console.error(`错误：请提供工具参数`);
        console.log(`\n用法: qcc ${arg1} ${arg2} <参数值>`);
        console.log(`      qcc ${arg1} ${arg2} --<参数名> <参数值>`);
        console.log('\n参数说明:');
        Object.entries(props).forEach(([key, value]) => {
          const req = required.includes(key) ? '(必填)' : '(可选)';
          const isDefault = key === defaultParamKey ? ' [默认]' : '';
          console.log(`  --${key} ${req}${isDefault} ${value.description || ''}`);
        });
        process.exit(1);
      }

      // 未知命令
      if (arg1) {
        console.error(`错误：未知命令或服务 ${arg1}`);
        console.log('\n可用命令:');
        console.log('  qcc init          初始化配置');
        console.log('  qcc list-tools    显示 MCP 工具列表');
        console.log('  qcc update        更新工具信息缓存');
        console.log('  qcc config        配置管理');
        console.log('\nMCP 服务:');
        shortServerNames.forEach(s => {
          const cfg = mcpService.getServerByShortName(s);
          console.log(`  ${s.padEnd(12)} ${cfg?.name || ''}`);
        });
        process.exit(1);
      }

      program.help();
    });
}

/**
 * 创建并配置 CLI 程序
 * @returns {Command} 配置好的 Commander 程序实例
 */
function createProgram() {
  const program = new Command();

  program
    .name('qcc')
    .description('企业信息查询 CLI 工具')
    .version(version)
    .allowUnknownOption(true); // 允许未知选项，由默认处理器处理

  // 注册各类命令
  registerStaticCommands(program);
  registerMcpCommands(program);
  registerDefaultHandler(program);

  // 全局错误处理：捕获未知命令（当没有匹配任何子命令时）
  program.on('command:*', (operands) => {
    const unknownCmd = operands[0];
    console.error(`错误: 未知命令或服务 "${unknownCmd}"`);
    console.log('\n可用命令:');
    console.log('  qcc init          初始化配置');
    console.log('  qcc list-tools    显示 MCP 工具列表');
    console.log('  qcc update        更新工具信息缓存');
    console.log('  qcc check         检查配置状态');
    console.log('  qcc config        配置管理');
    console.log('\nMCP 服务:');
    const shortServerNames = mcpService.getShortServerNames();
    shortServerNames.forEach(s => {
      const cfg = mcpService.getServerByShortName(s);
      console.log(`  ${s.padEnd(12)} ${cfg?.name || ''}`);
    });
    console.log('\n使用 "qcc --help" 查看更多帮助');
    process.exit(1);
  });

  return program;
}

module.exports = {
  createProgram,
  registerStaticCommands,
  registerMcpCommands,
  registerDefaultHandler,
  getServerTools
};