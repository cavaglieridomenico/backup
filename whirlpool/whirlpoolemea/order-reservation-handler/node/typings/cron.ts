export interface CronBody {
  request: Request;
  scheduler: Scheduler;
  retry: CronRetry
}

export interface Request {
  uri: string;
  method: string;
  headers: any;
  body: Body;
}

export interface Body { }

export interface Scheduler {
  endDate: string;
  expression: string;
}

export interface CronResponse {
  id: string;
  workspace: string;
  app: string;
  request: Request;
  retry: Retry;
  attempt: number;
  endDate: string;
  expression: string;
  NextExecution: string;
}

export interface Retry {
  delay: Delay;
  times: number;
  backOffRate: number;
}

export interface Delay {
  addMinutes: number;
  addHours: number;
  addDays: number;
}

interface CronRetry {
  delay: {
    addMinutes: number,
    addHours: number,
    addDays: number
  },
  times: number,
  backOffRate: number
}
