//@ts-nocheck

import { getInvoiceName, isValid } from "../utils/functions";

//supposing to receive an invoice id as query parameter and an authentication cookie
export async function getInvoice(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  try{
    if(isValid(ctx.query.id)){
      process.env.WRAPPER = JSON.stringify(await ctx.clients.apps.getAppSettings(process.env.VTEX_APP_ID+""));
      let authToken = ctx.cookies.get(JSON.parse(process.env.WRAPPER).authcookie);
      let p0 = new Promise<any>((resolve,reject) => {
        ctx.clients.AuthUser.GetLoggedUser(authToken)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
      })
      let p1 = new Promise<any>((resolve,reject) => {
        ctx.clients.masterdata.searchDocuments({dataEntity: "IN", fields: ["id","orderId","invoiceName","invoiceContent"], where: "id="+ctx.query.id, pagination: {page: 1, pageSize: 100}})
        .then(res => {
          resolve(res[0]);
        })
        .catch(err => {
          reject(err);
        })
      })
      let results = await Promise.all([p0,p1]);
      let email = results[0].user;
      let invoice = results[1];
      if(invoice!=undefined){
        let foundOrderId = await orderExists(ctx, invoice.orderId, email, 1, 100);
        if(foundOrderId){
          ctx.res.setHeader("Content-Type","application/pdf");
          ctx.res.setHeader("Content-Disposition","attachment;filename="+getInvoiceName(ctx, invoice.invoiceName)+".pdf");
          ctx.status = 200;
          ctx.body = Buffer.from(invoice.invoiceContent, 'base64');
        }else{
          ctx.status = 400;
          ctx.body = "Bad request";
        }
      }else{
        ctx.status = 400;
        ctx.body = "Bad request";
      }
    }else{
      ctx.status = 400;
      ctx.body = "Bad request";
    }
  }catch(err){
    //console.log(err)
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next()
}

async function orderExists(ctx: Context, orderId: string, email: string, page: number, per_page: number): Promise<any>{
  return new Promise<any>((resolve,reject) => {
    ctx.clients.vtexAPI.getOrdersByEmail(email, page, per_page)
    .then(res => {
      let found = false;
      for(let i=0; i<res.data.list.length && !found; i++){
        if(res.data.list[i].orderId==orderId){
          found=true;
        }
      }
      if(res.data.list.length<per_page || found){
        resolve(found);
      }else{
        return orderExists(ctx, orderId, email, page+1, per_page).then(res => resolve(res)).catch(err => reject(err));
      }
    })
    .catch(err => {
      reject(err);
    })
  });
}
