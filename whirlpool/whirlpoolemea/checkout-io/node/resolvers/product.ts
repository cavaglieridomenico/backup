import { APP } from "@vtex/api"

export const productQueries = {
  specifications: async (
    _: unknown,
    args: { productId: string; specificationNames: string[] },
    ctx: any,
  ): Promise<any> => {
    ctx.state.AppSettings = await ctx.clients.apps.getAppSettings(APP.ID)
    const { productId, specificationNames } = args
    return await getSpecificationValuesByNameList(
      ctx,
      productId,
      specificationNames,
    )
  },
  specificationsMultipleItems: async (
    _: unknown,
    args: { productIds: string[]; specificationNames: string[] },
    ctx: any,
  ): Promise<any> => {
    ctx.state.AppSettings = await ctx.clients.apps.getAppSettings(APP.ID)
    const { productIds, specificationNames } = args
    let specificationsPromises: any[] = []
    productIds.forEach(productId => {
      specificationsPromises.push(
        new Promise(resolve => {
          resolve(
            getSpecificationValuesByNameList(
              ctx,
              productId,
              specificationNames,
              true,
            ),
          )
        }),
      )
    })
    let promisesResults = await Promise.all(specificationsPromises)
    return promisesResults
  },
}

function getSpecificationValuesByNameList(
  ctx: any,
  productId: string,
  specificationNames: string[],
  addProductId: boolean = false,
) {
  return ctx.clients.Vtex
    .getProductSpecifications(productId)
    .then((itemSpecs: any) => {
      let filteredSpecs = itemSpecs?.filter(
        (spec: { Name: string }) =>
          specificationNames?.includes(spec.Name) || false,
      )
      return addProductId
        ? { productId: productId, specifications: filteredSpecs }
        : filteredSpecs
    })
}
