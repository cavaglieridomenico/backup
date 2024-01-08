export const productQueries = {
  specifications: async (
    _: unknown,
    args: { productId: string, specificationNames: string[] },
    ctx: any
  ): Promise<any> => {
    const { productId, specificationNames } = args;
    return await getSpecificationValuesByNameList(ctx, productId, specificationNames);
  },
}

function getSpecificationValuesByNameList(ctx: any, productId: string, specificationNames: string[]) {
  return ctx.clients.vtexAPI.getProductSpecifications(productId)
          .then((itemSpecs: any) => itemSpecs?.filter((spec: { Name: string; }) => specificationNames?.includes(spec.Name) || false));
}
