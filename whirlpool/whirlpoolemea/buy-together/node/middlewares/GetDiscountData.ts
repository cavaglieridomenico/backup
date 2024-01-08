import { getAppSettings } from "../utils/CommonFunctions";
import { CustomLogger } from "../utils/Logger";

// resolver graphql
export const GetDiscountDataResolver = async (
	_: any,
	{ listSku }: { listSku: number[] },
	ctx: Context
) => await GetDiscountData(listSku, ctx)

const GetDiscountData = async (listSku: number[], ctx: Context) => {
	const logger = new CustomLogger(ctx)
	try {
		const appSettings = await getAppSettings(ctx)
		return await ctx.clients.VtexAPI.discountData(await mapSkuListForSimulation(ctx, listSku, appSettings.salesChannel), appSettings.salesChannel);
	} catch (e) {
		logger.error("[GetDiscountData] - failed to get discount data")
		logger.debug(e)
		return null
	}

}


const mapSkuListForSimulation = async (ctx: Context, skuList: number[], salesChannel = "1") => {
	const productDetails = await ctx.clients.Graphql.productsBySkuId(skuList, salesChannel)
	if (!productDetails.data) throw new Error(productDetails.errors?.toString())
	return productDetails.data.productsByIdentifier.map((product,) => ({
		"id": product.items[0].itemId,
		"quantity": 1,
		"seller": product.items[0].sellers.find(seller => seller.commertialOffer.AvailableQuantity > 0)?.sellerId || product.items[0].sellers.find(seller => seller.sellerDefault)?.sellerId!
	}))
}
