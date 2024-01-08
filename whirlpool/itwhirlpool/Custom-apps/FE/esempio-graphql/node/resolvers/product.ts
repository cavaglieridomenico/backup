import { ProductType } from './../clients/product';
export const queries = {
    getProduct: async (
      _: any,
      args: any,
      ctx: Context
    ): Promise<ProductType> => {
      const { refId } = args
      const {
        clients: { product: ProductClient },
      } = ctx

      let product = await ProductClient.getProd(refId)
      let response : ProductType = {
          Id:product.Id,
          CategoryId:product.CategoryId,
          DepartmentId:product.DepartmentId,
          Name:product.Name
      }

      return response
    }
}