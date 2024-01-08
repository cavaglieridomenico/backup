import { Logger, APP } from "@vtex/api";

export class CustomLogger extends Logger {

  ctx: Context
  app: string

  constructor(ctx: any) {
    super(ctx)
    this.ctx = ctx
    this.app = APP.NAME
    this.info = this.custominfo
    this.error = this.customerror
    this.warn = this.customwarning
    this.debug = this.customdebug
  }

  custominfo(message: any) {
    this.ctx.clients.masterdata.createDocument({
      dataEntity: "LC",
      fields: {
        app: this.app,
        message: typeof message == "object" ? JSON.stringify(message, this.getCircularReplacer()) : message,
        severity: "info",
        timestamp: new Date().toISOString()
      }
    }).then(() => console.log("logger ok"), err => console.error(err))
  }

  customwarning(message: any) {
    this.ctx.clients.masterdata.createDocument({
      dataEntity: "LC",
      fields: {
        app: this.app,
        message: typeof message == "object" ? JSON.stringify(message, this.getCircularReplacer()) : message,
        severity: "warning",
        timestamp: new Date().toISOString()
      }
    }).then(() => console.log("logger ok"), err => console.error(err))
  }

  customerror(message: any) {
    this.ctx.clients.masterdata.createDocument({
      dataEntity: "LC",
      fields: {
        app: this.app,
        message: typeof message == "object" ? JSON.stringify(message, this.getCircularReplacer()) : message,
        severity: "error",
        timestamp: new Date().toISOString()
      }
    }).then(() => console.log("logger ok"), err => console.error(err))
  }

  customdebug(message: any) {
    this.ctx.clients.masterdata.createDocument({
      dataEntity: "LC",
      fields: {
        app: this.app,
        message: typeof message == "object" ? JSON.stringify(message, this.getCircularReplacer()) : message,
        severity: "debug",
        timestamp: new Date().toISOString()
      }
    }).then(() => console.log("logger ok"), err => console.error(err))
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
