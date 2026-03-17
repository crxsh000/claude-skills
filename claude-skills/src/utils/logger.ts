import chalk from "chalk";

export type LogLevel = "debug" | "info" | "warn" | "error";

let verboseEnabled = false;

export function setVerbose(enabled: boolean): void {
  verboseEnabled = enabled;
}

export function debug(...args: unknown[]): void {
  if (verboseEnabled) {
    console.error(chalk.gray("[debug]"), ...args);
  }
}

export function info(...args: unknown[]): void {
  console.error(chalk.blue("[info]"), ...args);
}

export function warn(...args: unknown[]): void {
  console.error(chalk.yellow("[warn]"), ...args);
}

export function error(...args: unknown[]): void {
  console.error(chalk.red("[error]"), ...args);
}
