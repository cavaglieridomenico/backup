//@ts-nocheck

export async function GetSKU(ctx: Context, next: () => Promise<any>) {
  //ctx.set("Cache-Control", "no-cache");
  try{
    let skuid = ctx.vtex.route.params.id as string
    let sku = await ctx.clients.vtexAPI.GetSKU(skuid);
    let categoryids = sku.ProductCategoryIds?.split("/")?.filter(f => f!="");
    let mepCategory = await ctx.clients.vtexAPI.GetCategory(categoryids[categoryids.length-1]);
    ctx.status = 200;
    ctx.body = {
      ...sku,
      mepCategory: mepCategory.AdWordsRemarketingCode
    }
  }catch(err){
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next()
}
