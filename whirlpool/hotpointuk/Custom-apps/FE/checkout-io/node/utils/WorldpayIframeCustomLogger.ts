import { Logger, LINKED } from "@vtex/api"

export class WorldpayIframeCustomLogger extends Logger {
  private ctx: Context

  constructor(ctx: any) {
    super(ctx)
    this.ctx = ctx
    this.info = (message: any) => this.customLog("info", message)
  }

  private customLog(logType: "info", message: any) {
    if (!message) return

    LINKED
      ? console[logType](message)
      : this.ctx.clients.masterdata.createDocument({
        dataEntity: "WL",
        fields: {
          ...message,
          logType: logType,
          timestamp: new Date().toISOString(),
        },
      })
  }
}
