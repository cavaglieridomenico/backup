export interface CronBody {
  request: Request;
  scheduler: Scheduler;
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