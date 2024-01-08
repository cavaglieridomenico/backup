import { APP, InstanceOptions, IOContext, ExternalClient } from "@vtex/api";
import { CronBody, CronResponse, Scheduler } from "../typings/cron";
import { stringify } from "../utils/functions";

export default class CronJob extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.vtexcommercestable.com.br/api/scheduler/${context.workspace}/${APP.NAME}`, context, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  public async getCronJobs() {
    return new Promise<CronResponse[]>((resolve, reject) => {
      this.http.get('', {
        params: {
          version: 4
        }
      })
        .then(res => resolve(res))
        .catch(err => reject({ msg: `Error while retrieving cron jobs -- details: ${stringify(err)}` }))
    })
  }

  public async getCronJob(cronJobId: string) {
    return new Promise<CronResponse>((resolve, reject) => {
      this.http.get(`/${cronJobId}`, {
        params: {
          version: 4
        }
      })
        .then(res => resolve(res))
        .catch(err => reject({ msg: `Error while retrieving cron job ${cronJobId} -- details: ${stringify(err)}` }))
    })
  }

  private async createCronJob(cronBody: CronBody) {
    return new Promise<any>((resolve, reject) => {
      this.http.post('', cronBody, {
        params: {
          version: 4,
        },
      })
        .then(res => resolve(res))
        .catch(err => reject({ msg: `Error while creating cron job -- details: ${stringify(err)}` }))
    })
  }

  public createCronBody(uri: string, scheduler: Scheduler, method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"): CronBody {
    return {
      request: {
        uri: `https://${this.context.workspace}--${this.context.account}.myvtex.com${uri}`,
        method,
        headers: {},
        body: {}
      },
      scheduler,
    }
  }

  public async createCronIfNotExists(uri: string, cronBody: CronBody) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const crons: CronResponse[] = await this.getCronJobs();
        const isActiveCron = crons.find((cron) => cron.request.uri.includes(uri));
        if (!isActiveCron) {
          await this.createCronJob(cronBody);
        }
        resolve(!isActiveCron);
      } catch (err) {
        reject(err)
      }
    })
  }

  public async deleteCronJob(cronJobId: string) {
    return new Promise<any>((resolve, reject) => {
      this.http.delete(`/${cronJobId}`, {
        params: {
          version: 4,
        },
      })
        .then(res => resolve(res))
        .catch(err => reject({ msg: `Error while deleting cron job -- details: ${stringify(err)}` }))
    })
  }
}