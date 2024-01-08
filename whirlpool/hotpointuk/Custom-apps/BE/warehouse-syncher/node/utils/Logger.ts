import { APP, Logger, LogLevel } from "@vtex/api";

export class CustomLogger extends Logger {

  ctx: Context

  constructor(ctx: any) {
    super(ctx)
    this.ctx = ctx
    this.info = (msg: any) => this.writeLog(msg, LogLevel.Info)
    this.debug = (msg: any) => this.writeLog(msg, LogLevel.Debug)
    this.warn = (msg: any) => this.writeLog(msg, LogLevel.Warn)
    this.error = (msg: any) => this.writeLog(msg, LogLevel.Error)

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
    }).then(() => console.log("log " + severity.toUpperCase() + " ok"), (err: any) => console.error(err))
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
