import { GoogleAuth } from "google-auth-library";
import { AES256Decode } from "../utils/auth";
import { getGCPAuthToken, getGCPClient } from "../clients/GcpAPI";
import { deleteEventRecord, removeWER } from '../utils/functions'
import { GCPPayload } from "../typings/interface";
import { json } from "co-body";
const priceUpdateBucket = 'pu-check'

export async function triggerHandler(ctx: Context, next: () => Promise<any>) {
  try {
    const { id: skuId } = await json(ctx.req)
    const account = ctx.vtex.account
    const [fixedPrices, sku12NC] = await Promise.all([ctx.clients.VtexAPI.getPriceBySkuId(skuId, account), ctx.clients.VtexAPI.get12nc(skuId)])
    const { country, clusterMapping } = ctx.state.appSettings
    if (!country || country == "") {
      ctx.vtex.logger.warn(`Price update - country err": "from mapCountry(); --> ", country: ${account} `)
      return
    }

    const lastGCPPayload = await ctx.clients.vbase.getJSON( //Get the last payload persisted by skuId
      priceUpdateBucket,
      skuId,
      true
    )

    if (JSON.stringify(lastGCPPayload) != JSON.stringify(fixedPrices)) { //if the payloads are the same is bc the event goes in loop, here we avoid it, comparing a vbase JSON saved just a few lines below
      const gcpAuth = new GoogleAuth({  //GCP AUTH
        projectId: ctx.state.appSettings.gcpProjectId,
        credentials: {
          client_email: ctx.state.appSettings.gcpClientEmail,
          private_key: AES256Decode(ctx.state.appSettings.gcpPrivateKey)
        }
      });

      const gcpClient = await getGCPClient(gcpAuth);    //create GCP connection
      const gcpToken = await getGCPAuthToken(ctx, gcpClient); // Get GCP token

      await ctx.clients.vbase.saveJSON( //persist the JSON: it will be compared in the second loop to see if there are any changes
        priceUpdateBucket,
        skuId,
        fixedPrices
      )

      fixedPrices.forEach((el) => {
        const cluster = clusterMapping.find(cluster => cluster.salesChannel == el.tradePolicyId)?.cluster
        if (!cluster || cluster == "") {
          ctx.vtex.logger.warn(`Price update - cluster err": "from mapCountry(); --> Trade Policy not handled for sku ${skuId}", price: ${JSON.stringify(el)} }`)
          return
        }
        const GCPPayload: GCPPayload = {
          skuid: removeWER(sku12NC),
          price: el.value,
          country: country,
          cluster: cluster as string
        }
        ctx.clients.GCP.sendPriceToGCPClient(GCPPayload, gcpToken)
          .then((data: any) => ctx.vtex.logger.info(`Price updated - GCP res": ${data}, priceobj: ${JSON.stringify(GCPPayload)} `))
          .catch((e: any) => {
            const msg = e.response.data ? e.response.data : "GCP error";
            ctx.vtex.logger.error(`Price update - GCP res: ${msg}, bodyReq:${JSON.stringify(GCPPayload)}`)
          })
      })
    }
    //delete record
    await deleteEventRecord(ctx, skuId)
    ctx.status = 200;
    ctx.body = 'ok'
    await next()
  } catch (e) {
    ctx.vtex.logger.error(`Price update - triggerHandler, ${JSON.stringify(e)}`)
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}
