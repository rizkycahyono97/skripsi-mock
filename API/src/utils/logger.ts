import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';
import { AsyncLocalStorage } from 'node:async_hooks';

export const logStorage = new AsyncLocalStorage<{ requestId: string }>();

const consoleFormat = format.printf(({ level, message, timestamp }) => {
  const context = logStorage.getStore();
  const reqIdStr = context ? `[${chalk.cyan(context.requestId)}]` : '';

  let coloredLevel = level.toUpperCase();
  if (level === 'info') coloredLevel = chalk.green(coloredLevel);
  if (level === 'error') coloredLevel = chalk.red(coloredLevel);
  if (level === 'warn') coloredLevel = chalk.yellow(coloredLevel);

  return `${chalk.gray(timestamp)} ${coloredLevel} ${reqIdStr}${message}`;
});

export const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    consoleFormat
  ),
  transports: [new transports.Console()]
});
