import { json } from "co-body";
import { CheckRequest } from "../typings/request";
import { CheckResponse } from "../typings/type";


export async function checkInternal(ctx: Context, next: () => Promise<any>) {

  let request: CheckRequest = await json(ctx.req);

  let response: CheckResponse = {
    isExistent: true,
    from: request.from
  }

  try {

    let responseGet = await ctx.clients.Rewriter.GetInternal(request.from);
    if (responseGet.data.internal.get == null) {
      response.isExistent = false;
      response.from = request.from;
    }

    ctx.status = 200;
    ctx.body = response;
    next();

  } catch (err) {
    ctx.status = 500
    ctx.body = {
      message: " Error getting the internal: From string => " + request.from
    }
  }
}
