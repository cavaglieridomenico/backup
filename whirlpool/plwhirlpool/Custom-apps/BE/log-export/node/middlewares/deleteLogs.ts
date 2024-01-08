//@ts-nocheck

import { vtexKeyToken } from "../utils/constants";
import CoBody from "co-body";

export async function deleteLogs(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  let credential = vtexKeyToken[ctx.vtex.account];
  if(credential.key==ctx.req.headers["x-vtex-api-appkey"] && credential.token==ctx.req.headers["x-vtex-api-apptoken"]){
    try{
      let ids: [] = await CoBody(ctx.req);
      let promises = [];
      ids.forEach(i => {
        promises.push(new Promise<any>((resolve,reject) => {
          ctx.clients.masterdata.deleteDocument({dataEntity: "LC", id: i})
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          })
        }));
      })
      await Promise.all(promises);
      ctx.status = 200;
      ctx.body = "OK";
    }catch(err){
      //console.log(err);
      ctx.status = 500;
      ctx.body = "Internal error";
    }
  }else{
    ctx.body = "Not Authorized";
    ctx.status = 403;
  }
  await next();
}
