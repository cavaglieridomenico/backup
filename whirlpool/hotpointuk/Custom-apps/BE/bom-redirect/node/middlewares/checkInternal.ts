import { transformInUrl } from "../utils/functions";
import{ CheckRequest, FinishedGood } from "../typings/request";
import { Authentication } from "../utils/Authentication";
import { json } from "co-body";


export async function checkInternal(ctx:Context, next: () => Promise<any>) {

  await Authentication(ctx);

  let request:FinishedGood = await json(ctx.req);

  let response: CheckRequest = {
    isExistent:true,
    from: ""
  }


  let modelNumberUrl = transformInUrl(request.modelNumber);
  let industrialCodeUrl = transformInUrl(request.industrialCode);

  let from = `/spare-parts/bom/${modelNumberUrl}-${industrialCodeUrl}`;

  try{

    let responseGet = await ctx.clients.Rewriter.GetInternal(from);

    if(responseGet.data.internal.get == null){
      response.isExistent = false;
      response.from = from;
    }

    ctx.body = response;

  }catch(err){
    ctx.status = 500
    ctx.body = {
      message: " Error in try-catch"
    }
  }




  next();

}
