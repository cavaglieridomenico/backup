import { APP } from "@vtex/api";

export const GetAdditionalServicesResolver = async (
  _: any, 
  {skuId, salesChannelId}: {skuId: string, salesChannelId: string}, 
  ctx: Context
) =>  GetAdditionalServices(ctx, skuId, salesChannelId)

export async function GetAdditionalServicesMiddleware(ctx: Context, next: () => Promise<any>) {
  const additionalServices = await GetAdditionalServices(ctx, ctx.vtex.route.params.sku as string, ctx.query.sc as string || "1")
  const enhancedAS = additionalServices.map(addService => ({...addService, Options: [{Name: addService.Name, Price: addService.Price}]}))
  console.log("enhancedAS: ", enhancedAS);
  ctx.body = enhancedAS;
  ctx.status = 200
  await next()
}

export const GetAdditionalServices = async (ctx: Context, skuId: string, salesChannelId: string) => {
  ctx.state.appSettings = await ctx.clients.apps.getAppSettings(APP.ID);
  let ids = ctx.state.appSettings.servicesPerSC?.find(f => f.scid==salesChannelId)?.services?.split(",");
  ids = ids?ids:[];
  let services = [];
  if(!ctx.state.appSettings.isMarketplace){
    services = (await ctx.clients.vtexAPI.GetSKU(skuId)).Services?.filter((f: { ServiceTypeId: number }) => ids?.includes(f.ServiceTypeId+""))
  }else{
    process.env.SELLERACC = JSON.stringify(ctx.state.appSettings.sellerAccount);
    let sellerSkuId = (await ctx.clients.vtexAPI.GetSKU(skuId)).SkuSellers?.find((s: {SellerId: string}) => s.SellerId==ctx.state.appSettings.sellerAccount?.name)?.SellerStockKeepingUnitId;
    services = (await ctx.clients.VtexSeller.GetSKUContext(sellerSkuId, ctx.state.appSettings?.sellerAccount)).Services?.filter((f: { ServiceTypeId: number }) => ids?.includes(f.ServiceTypeId+""))
  }
  console.log("services: ", services)
  let servicesToShow: { Id: number; ServiceTypeId: number; Name: string; Description: string; Price: number; Position: number }[] = []
  services?.forEach((s: { ServiceTypeId: string; Name: any; Id: any; Options: { Price: any }[] }) => {
    let service = ctx.state.appSettings.serviceInfo?.find(f => f.id.split(",")?.includes(s.ServiceTypeId+""));
    let name = service?.name?service.name:s.Name;
    let description = service?.description?service.description:"";

    // manage position property to sort the additional services list
    let position = service?.position?service.position:0;

    servicesToShow.push({
      Id: s.Id,
      ServiceTypeId: parseInt(s.ServiceTypeId),
      Name: name,
      Description: description,
      Price: s.Options[0]?.Price ? s.Options[0]?.Price?.toFixed(2) : 0,
      Position: position
    })
  })

  // sort additional services by position field
  let sortedServicesToShow = servicesToShow.sort((a,b) => a.Position - b.Position)

  return sortedServicesToShow
}
