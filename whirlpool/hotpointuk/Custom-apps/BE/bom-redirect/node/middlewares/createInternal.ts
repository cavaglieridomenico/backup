import { Settings } from "../typings/configs";
import { json } from "co-body";
import { FinishedGood } from "../typings/request";
import { Route } from "../typings/Rewriter";
import { Authentication } from "../utils/Authentication";
import { DECLARER, TYPE } from "../utils/constants";
import { transformInUrl } from "../utils/functions";


export async function createInternal(ctx:Context, next: () => Promise<any>) {

  await Authentication(ctx);

  let createInternalRequest: FinishedGood = await json(ctx.req);

  let modelNumber = createInternalRequest.modelNumber
  let industrialCode = createInternalRequest.industrialCode

  let modelNumberUrl = transformInUrl(modelNumber);
  let industrialCodeUrl = transformInUrl(industrialCode);

  const appSettings: Settings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);

  let disableSitemapEntryAS = appSettings.disableSitemapEntry;

  let route: Route = {
    from: `/spare-parts/bom/${modelNumberUrl}-${industrialCodeUrl}`,  //  /spare-parts/bom/he62fixha-aq555800000
    resolveAs: "/bom",
    declarer: DECLARER,
    type: TYPE,
    id: `${modelNumberUrl}-${industrialCodeUrl}`,
    query: {
      industrialCode : industrialCode,
      modelNumber : modelNumber
    },
    disableSitemapEntry: disableSitemapEntryAS

  }

  try{

    await ctx.clients.Rewriter.CreateInternal(route)
    next();

  }catch(err){
    ctx.status = 400
    ctx.body = {
      message: "Error creating internal for url: " + "/spare-parts/bom/" + modelNumberUrl + "-" + industrialCodeUrl
    }
  }

  ctx.status = 200
  ctx.body = {
    message: " Internal created for url: " + "/spare-parts/bom/" + modelNumberUrl + "-" + industrialCodeUrl
  }
}
