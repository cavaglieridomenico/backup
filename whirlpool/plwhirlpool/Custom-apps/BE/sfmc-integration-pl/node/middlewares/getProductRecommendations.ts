//@ts-ignore
//@ts-nocheck

export async function getProductRecommendations(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  try{
    process.env.SFMC = JSON.stringify(await ctx.clients.apps.getAppSettings(process.env.VTEX_APP_ID+""));
    let authToken = ctx.cookies.get(JSON.parse(process.env.SFMC).authCookie);
    let email = (await ctx.clients.Vtex.getAuthenticatedUser(authToken)).data?.user;
    let recommendations = await ctx.clients.Recommender.getRecommendations(email);
    let skuToReturn = [];
    let skuPromises = [];
    recommendations[0]?.items?.forEach(r => {
      if((r.image_link+"").includes(ctx.vtex.account)){
        skuPromises.push(new Promise<any>((resolve,rejects) => {
          ctx.clients.Vtex.getSkuByRefId(r.sku_id)
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            resolve(undefined);
          })
        }))
      }
    })
    let skuPromisesResponses = await Promise.all(skuPromises);
    skuPromisesResponses.forEach(s => {
      if(s!=undefined){
        skuToReturn.push(s.Id);
      }
    })
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
