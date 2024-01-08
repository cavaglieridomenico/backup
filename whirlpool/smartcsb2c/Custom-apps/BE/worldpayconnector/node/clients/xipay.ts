import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class XipayAPI extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(process.env.XP_URL + '', context, options)
  }

  public async ManualAuth(body: string): Promise<string> {
    return this.http.post('/PMXIGGE/XiPay30WS.asmx', body, {
      headers: {
        "Content-Type": 'application/soap+xml;charset=UTF-8;action="Paymetric/XiPaySoap30/action/XiGGE.SoapOp"'
      }
    })
  }

}
