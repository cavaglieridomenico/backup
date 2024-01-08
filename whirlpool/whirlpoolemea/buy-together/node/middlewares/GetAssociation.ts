
import { BundleAssociations } from "../typing/product"
import { getAppSettings } from "../utils/CommonFunctions"
import { CustomLogger } from "../utils/Logger"

// resolver graphql
export const GetAssociationResolver = async (
	_: any,
	{ skuId, categoryId }: { skuId: number, categoryId: number },
	ctx: Context,
) => await GetAssociation(skuId, categoryId, ctx)

// get bundle associated products by skuId or categoryId
const GetAssociation = async (skuId: number, categoryId: number, ctx: Context) => {
	const logger = new CustomLogger(ctx)
	try {
		const appSettings = await getAppSettings(ctx)
		const associations: BundleAssociations[] = await ctx.clients.masterdata.searchDocuments({
			dataEntity: 'AB',
			fields: ["target", "associationType", "associatedSku"],
			where: "(target=" + skuId + " AND associationType=\"sku\") OR (target=" + categoryId + " AND associationType=\"category\")",
			pagination: { page: 1, pageSize: 10 }
		})
		if (associations.length > 0) {
			const products = await ctx.clients.Graphql.productsBySkuId(associations.map(association => association.associatedSku), appSettings.salesChannel)
			if (products.errors) logger.error(products.errors)
			return products.data?.productsByIdentifier || []
		}
		return []
	} catch (error) {
		logger.error(`[GetAssociation] - Failed to retrieve associations for sku ${skuId} and category ${categoryId}`)
		logger.debug(error)
		return []
	}
}
