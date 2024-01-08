import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";
import { MarketPlace } from "../typings/config";
import { AES256Decode, base64Encode } from "../utils/cryptography";
import { stringify, wait } from "../utils/functions";

export default class MPS_API extends ExternalClient {

  private MAX_TIME: number;
  private MAX_RETRY: number;

  constructor(context: IOContext, options?: InstanceOptions) {
    let config: MarketPlace = JSON.parse(process.env[`${context.account}-MarketPlace`]!);
    let psw = AES256Decode(config.Password!);
    let auth = base64Encode(`${config.UserName}:${psw}`);
    options!.headers = {
      ...options?.headers,
      ...{
        Authorization: `Basic ${auth}`
      }
    }
    super(``, context, options);
    this.MAX_TIME = 1000;
    this.MAX_RETRY = 5;
  }

  public async SetBookingStatus(orderId: string, newStatus: string, mP_Name: string, retry: number = 0): Promise<any> {
    let endpoint = `http://${this.context.workspace}--${mP_Name}.myvtex.com/app/fareye/marketplace/setBookingStatus`;
    let body = {
      orderId: orderId,
      status: newStatus
    }
    return new Promise<any>((resolve, reject) => {
      this.http.post(
        endpoint, body, this.options
      ).then((res: any) => resolve(res))
        .catch(async (err: any) => {
          if (retry < this.MAX_RETRY) {
            await wait(this.MAX_TIME);
            return this.SetBookingStatus(orderId, newStatus, mP_Name, retry + 1).then(res0 => resolve(res0)).catch(res1 => reject(res1))
          } else {
            reject(
              {
                msg: `Error while sending orderNotification (orderId = ${orderId}, status = ${newStatus}) to ${mP_Name} --details: ${stringify(err)}`
              })
          }
        })
    })
  }
}
