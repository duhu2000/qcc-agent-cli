const chalk = require('chalk');

/**
 * 日志工具
 */
const logger = {
  info: (msg) => console.log(chalk.blue(msg)),
  success: (msg) => console.log(chalk.green(msg)),
  warn: (msg) => console.log(chalk.yellow(msg)),
  error: (msg) => console.error(chalk.red(msg)),
  gray: (msg) => console.log(chalk.gray(msg))
};

module.exports = logger;