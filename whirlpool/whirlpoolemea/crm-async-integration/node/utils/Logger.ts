import { APP, Logger, LogLevel } from "@vtex/api";

const LoggerEntityName = "LC";
const maxRetries = 5;
const maxWaitTime = 500;

interface LogRecord {
  app: string,
  message: string,
  severity: string,
  timestamp: string
}

export class CustomLogger extends Logger {

  ctx: Context
  app: string

  constructor(ctx: Context | any) {
    super(ctx);
    this.ctx = ctx;
    this.app = APP.NAME,
      this.info = this.customInfo;
    this.debug = this.customDebug;
    this.warn = this.customWarning;
    this.error = this.customError;
  }

  customInfo(msg: any): void { this.writeLog(msg, LogLevel.Info) }
  customDebug(msg: any): void { this.writeLog(msg, LogLevel.Debug) }
  customWarning(msg: any): void { this.writeLog(msg, LogLevel.Warn) }
  customError(msg: any): void { this.writeLog(msg, LogLevel.Error) }

  writeLog(message: any, severity: string): void {
    let log: LogRecord = {
      app: this.app,
      message: getMessage(message),
      severity: severity,
      timestamp: new Date().toISOString()
    }
    createDocument(this.ctx, LoggerEntityName, log)
      .then(() => console.log(`log ${severity.toUpperCase()}: ok`))
      .catch(err => console.log(`error: ${getMessage(err)}`))
  }

}

function getMessage(msg: any): string {
  return typeof msg == "object" ? JSON.stringify(msg, getCircularReplacer()) : (msg + "");
}

const getCircularReplacer = () => {
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

async function wait(time: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  })
}

async function createDocument(ctx: Context, dataEntity: string, payload: LogRecord, retry: number = 0): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.createDocument({ dataEntity: dataEntity, fields: payload })
      .then(res => resolve(res))
      .catch(async (err) => {
        if (retry < maxRetries) {
          await wait(maxWaitTime);
          return createDocument(ctx, dataEntity, payload, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0))
        } else {
          reject(err);
        }
      })
  })
}
