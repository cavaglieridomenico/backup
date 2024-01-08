import { Logger } from "@vtex/api";

export class LLCustomLogger extends Logger {

  ctx: Context
  info: any
  error: any

  constructor(ctx: any) {
    super(ctx)
    this.ctx = ctx
    this.info = this.custominfo
    this.error = this.customerror
  }

  custominfo(message: any) {
      this.ctx.clients.masterdata.createDocument({
        dataEntity: "LL",
        fields: {
          ...this.ctx.state.llCustomLog,
          logDescription: typeof message == "object" ? JSON.stringify(message, this.getCircularReplacer()) : message,
          logType: "info",
          timestamp: new Date().toISOString()
        }
      }).then(() => console.log("logger ok"), err => console.error(err))
  }

  customerror(message: any) {
      this.ctx.clients.masterdata.createDocument({
        dataEntity: "LL",
        fields: {
          ...this.ctx.state.llCustomLog,
          logDescription: typeof message == "object" ? JSON.stringify(message, this.getCircularReplacer()) : message,
          logType: "error",
          timestamp: new Date().toISOString()
        }
      }).then(() => console.log("Login logger ok"), err => console.error(err))
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