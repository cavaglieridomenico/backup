import { APP, Logger, LogLevel } from "@vtex/api";

export class CustomLogger extends Logger {

  private ctx: Context

  constructor(ctx: any) {
    super(ctx)
    this.ctx = ctx
    this.info = (message: any) => this.writeLog(message, LogLevel.Info)
    this.error = (message: any) => this.writeLog(message, LogLevel.Error)
    this.warn = (message: any) => this.writeLog(message, LogLevel.Warn)
    this.debug = (message: any) => this.writeLog(message, LogLevel.Debug)
  }

  writeLog(message: any, severity: LogLevel) {
    this.ctx.clients.masterdata.createDocument({
      dataEntity: "LC",
      fields: {
        app: APP.NAME,
        message: typeof message == "object" ? JSON.stringify(message, this.getCircularReplacer()) : message,
        severity: severity,
        timestamp: new Date().toISOString()
      }
    }).then(() => console.log("log " + severity.toLocaleUpperCase() + ": OK"), err => console.error(err))
  }

  getCircularReplacer = () => {
    const seen = new WeakSet();
    return ({ }, value: object | null) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }
}
