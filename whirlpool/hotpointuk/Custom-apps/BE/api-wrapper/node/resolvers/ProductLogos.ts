import { APP } from "@vtex/api"
import { CustomLogger } from "../utils/customLogger"

export const productLogos = async (
  _: any,
  { skuId }: { skuId: string },
  ctx: Context
) => {
  try {
    const [skuDetails, { logosMapping: { specificationName, mapping } }]: [{ ProductSpecifications: { FieldName: string, FieldValues: string[] }[] }, AppSettings] = await Promise.all([
      ctx.clients.vtexAPI.GetSKU(skuId),
      ctx.clients.apps.getAppSettings(APP.ID)
    ])
    const logos = skuDetails.ProductSpecifications?.find(spec => spec.FieldName == specificationName)?.FieldValues[0]
    return logos?.split('|').map(prodLogo => mapping.find(logo => logo.id.trim().toLowerCase() == prodLogo.trim().toLowerCase())?.url).filter(logo => logo != undefined) || []
  } catch (err) {
    const logger = new CustomLogger(ctx)
    logger.error("[productLogos] - Error getting product logos")
    logger.debug(err)
    return []
  }
}
