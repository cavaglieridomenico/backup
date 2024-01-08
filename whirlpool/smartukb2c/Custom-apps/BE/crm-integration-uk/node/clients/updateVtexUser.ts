
import { InstanceOptions, IOContext, JanusClient } from '@vtex/api'
import logMessage from '../utils/loggingUtils'

export default class UpdateVtexUser extends JanusClient 
{
  appKey: string | undefined
  appToken: string | undefined

  constructor(context: IOContext, options?: InstanceOptions)
  { super(context, options) }
  //Updates a user on VTEX with the document id that was passed in the call that originated from the trigger on VTEX's master data.
  //I.N. Assumes you are in quality stage so modifies data on the quality version. Please switch to production version once released.
  public async updateUser(vtexUserInfo: any, ctx: Context): Promise<string> 
  {
    let documentId = vtexUserInfo['id']
    let account = vtexUserInfo['accountName'] as string

    let url = 'https://'+account+'.vtexcommercestable.com.br/api/dataentities/CL/documents/'+documentId

    let body = 
    {
        "webId": vtexUserInfo['webId'],
        "crmBpId": vtexUserInfo['crmBpId']
    }

    let headers =
    {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-VTEX-API-AppKey": this.appKey,
        "X-VTEX-API-AppToken": this.appToken
    }

    ctx.vtex.logger.info(logMessage("updating vtex user with:\n"+JSON.stringify(body, null, "\t")))

    return this.http.patch
    (
        url,
        body,
        {
            headers: headers
        }
    )
  }
}