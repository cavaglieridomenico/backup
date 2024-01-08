import { json } from "co-body";
import { ListInternalRequest } from "../typings/request";
import { Authentication } from "../utils/Authentication";


export async function getListInternal(ctx: Context, next: () => Promise<any>){

  await Authentication(ctx);

  let listInternalRequest: ListInternalRequest = await json(ctx.req);

  interface lis {
    next: string
    routes: any[]
  }

  try {

    let listInternalResponse = await ctx.clients.Rewriter.GetListInternals(listInternalRequest.next);

    let response:lis = {
      next: listInternalResponse.data.internal.listInternals.next,
      routes: listInternalResponse.data.internal.listInternals.routes
    }
    ctx.body = response;
    ctx.status = 200;
    next();

  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      message: ` Error getting the internal list, next string: ${listInternalRequest.next}`
    }
  }

}
