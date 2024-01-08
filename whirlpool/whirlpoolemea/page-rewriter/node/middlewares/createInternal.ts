import { Route } from "../typings/Rewriter";
import { DECLARER, QueryParamType, TYPE } from "../utils/constants";
import { getIdByFromString, saveQueryParameter } from "../utils/functions";


export async function createInternal(ctx: Context, next: () => Promise<any>) {

  let createInternalRequest = ctx.state.createInternalRequest

  let fromReq = createInternalRequest!.from;
  let resolveAsReq = createInternalRequest!.resolveAs;
  let disableSitemapEntryAS = ctx.state.appSettings.disableSitemapEntry;
  let routeId = getIdByFromString(fromReq);
  let queryReq = ctx.state.createInternalRequest!.query;

  if (checkQueryParameters(queryReq)) {

    //stringify needed by FE to map "nameOfQueryParam":"properties as string"
    Object.keys(queryReq).map(key => {
      queryReq[key] = JSON.stringify(queryReq[key])
    })

    let route: Route = {
      from: fromReq,
      resolveAs: resolveAsReq,
      declarer: DECLARER,
      type: TYPE,
      id: routeId,
      query: queryReq,
      disableSitemapEntry: disableSitemapEntryAS

    }

    try {
      if (ctx.state.appSettings.isVBaseEnabled) {

        //save query parameters in VBase
        await saveQueryParameter(ctx, fromReq, ctx.state.createInternalRequest!.query);
        route.query = {
          message: "Saved in VBase"
        };

      }

      await ctx.clients.Rewriter.CreateInternal(route);
      ctx.status = 200;
      ctx.body = {
        message: " Internal created for url: " + fromReq
      }

      await next();

    } catch (err) {
      ctx.status = 500;
      ctx.body = {
        message: "Error creating internal: " + err + " - From string: " + fromReq
      }
    }

  } else {

    ctx.status = 400;
    ctx.body = "Invalid query parameters"
  }

}

//check to verify if the properties of the query parameter passed are right compared to the type
function checkQueryParameters(query: any) {

  let isValidReq = true;

  let keys: any = [];
  Object.keys(query).map(key => {
    keys.push(key)
  })

  let index = 0;
  while (index < keys.length && isValidReq == true) {

    let key = keys[index];
    let type = query[key].type;

    if (QueryParamType.includes(type)) {

      switch (type) {
        case 'LEGACY': if (query[key].name == undefined || query[key].content == undefined) { isValidReq = false };
          break;

        case 'OG': if (query[key].property == undefined || query[key].content == undefined) { isValidReq = false };
          break;

        case 'TITLE': if (query[key].value == undefined) { isValidReq = false };
          break;

        case 'HTTP': if (query[key].http_equiv == undefined || query[key].content == undefined) { isValidReq = false };
          break;

        case 'LINK': if (query[key].rel == undefined || query[key].href == undefined) { isValidReq = false };
          break;

        case 'CHARSET': if (query[key].charSet == undefined) { isValidReq = false };
          break;

        case 'STRUCTURED_DATA': if (query[key].data == undefined) { isValidReq = false };
          break;
      }

    } else {
      isValidReq = false;
    }
    index++;

  }


  return isValidReq
}
