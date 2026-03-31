#!/usr/bin/env node

const { createProgram } = require('../src/cliSetup');

// 创建并运行 CLI 程序
const program = createProgram();

// 全局错误处理（捕获未被子命令处理的错误）
program.exitOverride((err) => {
  // 处理未知选项错误（在全局级别）
  if (err.code === 'commander.unknownOption') {
    // 由子命令处理，这里静默退出
    process.exit(1);
  }

  // 处理缺少参数值错误
  if (err.code === 'commander.optionMissingArgument') {
    console.error(`错误: 参数缺少值`);
    process.exit(1);
  }

  // 其他错误静默处理
  if (err.code !== 'commander.help' && err.code !== 'commander.version') {
    // 不打印错误，由具体处理器打印
  }
  process.exit(1);
});

program.parse();