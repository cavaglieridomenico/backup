//@ts-nocheck
export const GetAdditionalServices = async (_: any, {skuId, salesChannelId}: {skuId: string, salesChannelId: string}, ctx: Context) => {

	try{
		ctx.state.appSettings = await ctx.clients.apps.getAppSettings("whirlpoolemea.additional-services-pdp");
		let ids = ctx.state.appSettings.servicesPerSC?.find(f => f.scid==salesChannelId)?.services?.split(",");
		ids = ids?ids:[];
		let services = [];
		if(!ctx.state.appSettings.isCCProject){
			services = (await ctx.clients.vtexAPI.GetSKU(skuId)).Services?.filter((f: { ServiceTypeId: number }) => ids?.includes(f.ServiceTypeId+""))
		}else{
			process.env.SELLERACC = JSON.stringify(ctx.state.appSettings.sellerAccount);
			let sellerSkuId = (await ctx.clients.vtexAPI.GetSKU(skuId)).SkuSellers?.find((s: {SellerId: string}) => s.SellerId==ctx.state.appSettings.sellerAccount?.name)?.SellerStockKeepingUnitId;
			
			services = (await ctx.clients.VtexSeller.GetSKUContext(sellerSkuId, ctx.state.appSettings?.sellerAccount)).Services?.filter((f: { ServiceTypeId: number }) => ids?.includes(f.ServiceTypeId+""))
		}
		let servicesToShow: { Id: number; ServiceTypeId: number; Name: string; Description: string; Price: number; ListPrice: number; Position: number }[] = []

		for(let i = 0; i < services.length; i++) {
			let s = services[i]

			let service = ctx.state.appSettings.serviceInfo?.find(f => f.id.split(",")?.includes(s.ServiceTypeId+""));
			let name = service?.name?service.name : s.Name;
			let description = service?.description?service.description : s.Options[0]?.Description;
			let listPrice = service?.listPrice? service?.listPrice : s.Options[0]?.ListPrice?.toFixed(2)

			// manage position property to sort the additional services list
			let position = service?.position?service.position:0;
			servicesToShow.push({
				Id: s.Id,
				ServiceTypeId: parseInt(s.ServiceTypeId),
				Name: name,
				Description: description,
				Price: s.Options[0]?.Price ? s.Options[0]?.Price?.toFixed(2) : 0,
				ListPrice: listPrice,
				Position: position
			})
		}

		// sort additional services by position field
		let sortedServicesToShow = servicesToShow.sort((a,b) => a.Position - b.Position)

		return sortedServicesToShow
	} catch (e) {
		console.log(e)
	}

}
