//@ts-ignore
//@ts-nocheck
 
export async function getProductRecommendations(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  try{
    process.env.TEST = JSON.stringify(await ctx.clients.apps.getAppSettings(process.env.VTEX_APP_ID+""));
    let authToken = ctx.cookies.get(JSON.parse(process.env.TEST).authCookie);    
    let email = (await ctx.clients.Vtex.getAuthenticatedUser(authToken)).data?.user;     
    let recommendations = await ctx.clients.Recommender.getRecommendations(email, ctx.query.pagetype);
    
    let skuToReturn = recommendations[0].items.map( item => {
      return item.sku_id
    });

    ctx.status = 200;
    ctx.res.setHeader("Content-Type","application/json");
    ctx.body = skuToReturn;
  }catch(err){
    //console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error"
  }
  await next()
}
