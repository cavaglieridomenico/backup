import { json } from "co-body";
import { DeleteRequest } from "../typings/request";
import { Authentication } from "../utils/Authentication";


export async function deleteInternal(ctx:Context, next: () => Promise<any>) {

  await Authentication(ctx);

  let deleteRequest: DeleteRequest = await json(ctx.req);

  let from = deleteRequest.from;

  try{

    let deleteResponse = await ctx.clients.Rewriter.DeleteInternal(from);


    if(deleteResponse.data.internal.delete == null){
      ctx.status = 500
      ctx.body = {
        message: "Error deleting internal for url: " + from
      }
    }else{

      ctx.status = 200;
      ctx.body = {
      message: " Internal deleted for url: " + from
      }
    }

    next();

  }catch(error){

    ctx.status = 400
    ctx.body = {
      message: "Error deleting internal for url: " + from
    }

  }

}
