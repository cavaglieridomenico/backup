import { InstanceOptions, IOContext, JanusClient } from "@vtex/api";
import { CouponRequest } from "../typings/CouponApi";
import FormData from 'form-data'
import { maxRetries, maxTime, stringify, wait } from "../utils/constants";

export default class VtexAPI extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options && options.headers),
        VtexIdclientAutCookie: context.adminUserAuthToken || ""
      }
    })

  }

  public GenerateCoupons(quantity: number, body: CouponRequest): Promise<string[]> {
    return this.http.post("/api/rnb/pvt/coupons?quantity=" + quantity, body);
  }

  public async UploadFile(id: string, fileField: string, fileName: string, body: string, retry: number = 0): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let form = new FormData()
      form.append("", body, fileName)
      this.http.post(`/api/dataentities/CG/documents/${id}/${fileField}/attachments`, form, {
        headers: form.getHeaders()
      }).then(res => resolve(res))
        .catch(async (err) => {
          if (retry < maxRetries) {
            await wait(maxTime);
            return this.UploadFile(id, fileField, fileName, body, retry + 1).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          } else {
            reject({ message: "error while uploading file --details: " + stringify(err.response?.data ? err.response.data : err) });
          }
        })
    });
  }

}
