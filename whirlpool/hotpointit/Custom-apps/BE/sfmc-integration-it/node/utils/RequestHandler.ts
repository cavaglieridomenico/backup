import { IOClient } from "@vtex/api";

export interface Request {
    client: IOClient,
    request: string,
    args: any[],
    callback: (result: any, error?: any) => any
}

export class RequestQueue {
    private Queue: Request[]
    private isActive: boolean
    private pendingRequests: number
    private intervalId: NodeJS.Timeout
    private OnEnd: () => void
  
    constructor(finalCallback: () => void = () => { }, interval = 500) {
      this.OnEnd = finalCallback
      this.Queue = []
      this.isActive = true
      this.pendingRequests = 0
      this.intervalId = setInterval(() => this.ExecuteRequest(), interval)
    }
  
    PushRequest(req: Request) {
      this.Queue.push(req)
    }
  
    GetQueueLength() {
      return this.Queue.length
    }
  
    private ExecuteRequest() {
      let next = this.Queue?.shift()
      if (!next && !this.isActive && this.pendingRequests <= 0) {
        clearInterval(this.intervalId)
        this.OnEnd()
      } else if (next) {
        this.pendingRequests++
        RequestWithRetry<any>(next.client, next.request, next.args).then(res => {
          this.pendingRequests--
          next?.callback(res)
        }).catch(err => {
          this.pendingRequests--
          next?.callback(null, err)
        })
      }
    }
  
    Stop() {
      this.isActive = false
    }
}
  
export const RequestWithRetry = <T>(client: IOClient, request: string, args: any[], maxRetries = 2, timeout = 500): Promise<T> => {
    return new Promise<T>(async (resolve, reject) => {
      (client as any)[request](...args).then((res: T) => resolve(res)).catch((err: any) => {
        if (maxRetries > 0) {
          setTimeout(() => {
            resolve(RequestWithRetry<T>(client, request, args, maxRetries - 1))
          }, timeout);
        }
        else {
          reject(err)
        }
      })
    })
}
  