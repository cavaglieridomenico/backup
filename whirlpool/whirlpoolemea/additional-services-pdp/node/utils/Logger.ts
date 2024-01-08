//@ts-nocheck
import { Logger, APP, LINKED } from "@vtex/api";

export class CustomLogger extends Logger {

  private ctx: Context

  constructor(ctx: any) {
    super(ctx)
    this.ctx = ctx
    this.info = (message: any) => this.customLog('info', message)
    this.error = (message: any) => this.customLog('error', message)
    this.warn = (message: any) => this.customLog('warn', message)
    this.debug = (message: any) => this.customLog('debug', message)
  }

  private customLog(severity: 'info' | 'error' | 'warn' | 'debug', message: any) {
    if (!message) return

    LINKED ? console[severity](message) :
      this.ctx.clients.masterdata.createDocument({
        dataEntity: "LC",
        fields: {
          app: APP.NAME,
          message: this.formatMessage(message),
          severity: severity,
          timestamp: new Date().toISOString()
        }
      })
  }

  private formatMessage = (message: any) => typeof message == "object" ? JSON.stringify(message, this.getCircularReplacer()) : message

  private getCircularReplacer = () => {
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
