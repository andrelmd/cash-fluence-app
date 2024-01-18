import { invoke } from "@tauri-apps/api";
import { LogLevels } from "../enums/LogLevels";

export default class Logger {
  static log(level: LogLevels, message: string) {
    // if (process.env.LOG === 'false') return
    // if (process.env.LOG_LEVEL && level < parseInt(process.env.LOG_LEVEL)) return

    invoke("log", {
      level,
      message,
    });
  }

  static error(message: string) {
    Logger.log(LogLevels.error, message);
  }

  static info(message: string) {
    this.log(LogLevels.info, message);
  }

  static debug(message: string) {
    this.log(LogLevels.debug, message);
  }

  static warn(message: string) {
    this.log(LogLevels.warn, message);
  }
}
