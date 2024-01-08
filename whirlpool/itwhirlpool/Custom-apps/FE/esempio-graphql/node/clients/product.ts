import { InstanceOptions, IOContext, JanusClient } from "@vtex/api";

export interface ProductType {
  Id: number;
  Name: string;
  DepartmentId: number;
  CategoryId: number;
}

export default class Product extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,

      headers: {
        ...(options && options.headers),

        VtexIdclientAutCookie: context.authToken,
      },
    });
  }

  public async getProd(refId: string): Promise<ProductType> {
    const endpoint = `/api/catalog_system/pvt/products/productgetbyrefid/${refId}`;

    return this.http.get(endpoint);
  }
}
