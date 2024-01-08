//@ts-nocheck

//supposing to receive an invoice id as query parameter and an authentication cookie
export async function getInvoice(ctx: Context, next: () => Promise<any>) {
  try{
    if(isValid(ctx.query.id)){
      ctx.set('Cache-Control', 'no-store');
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
        ctx.clients.masterdata.searchDocuments({dataEntity: "IN", fields: ["id","orderId","invoice"], where: "id="+ctx.query.id, pagination: {page: 1, pageSize: 1000}})
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
        let userOrders = await getAllOrders(ctx,email,[],1);
        if(userOrders.includes(invoice.orderId)){
          ctx.res.setHeader("Content-Type","application/pdf");
          ctx.res.setHeader("Content-Disposition","attachment;filename='invoice.pdf'");
          ctx.status = 200;
          ctx.body = Buffer.from(invoice.invoice, 'base64');
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
    console.log(err)
    ctx.status = 500;
    ctx.body = "Internal error";
  }
  await next()
}

function isValid(field: string): Boolean{
  return field!=undefined && field!=null && field!="null" && field!="" && field!="‎" && field!=!"-" && field!="_";
}

async function getAllOrders(ctx: Context, email, ids: [], page: number): Promise<any>{
  return new Promise<any>((resolve,reject) => {
    ctx.clients.vtexAPI.getOrdersByEmail(email,page)
    .then(res => {
      let ordersArray = res.data.list;
      ordersArray.forEach(o => {
        ids.push(o.orderId);
      })
      if(ordersArray.length<1000){
        resolve(ids)
      }else{
        resolve(getAllOrders(ctx,email,ids,page+1));
      }
    })
    .catch(err => {
      reject(err);
    })
  });
}
