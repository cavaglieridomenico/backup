//@ts-nocheck

export async function GetAdditionalServicesContents(ctx: Context, next: () => Promise<any>) {

  let appSettings = await ctx.clients.apps.getAppSettings("" + process.env.VTEX_APP_ID);
  let specialCategorys: string = appSettings['additional_services_contents_categpries']

  let productId: string = ctx.query.productId.toString();

  let constructionType: string = await searchProductConstructionType(ctx, productId);
  let categoryName: string = await getProductCategory(ctx, productId);

  console.log(categoryName)
  console.log(constructionType)

  if (specialCategorys.toLocaleLowerCase().indexOf(categoryName.toLocaleLowerCase()) >= 0 || constructionType == 'Built In') {
    let whereCondition = `categoryName=${categoryName.replace(/\s/g, '')}`
    console.log(whereCondition);
    ctx.body = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "AC",
      fields: ['_all'],
      pagination: {
        page: 1,
        pageSize: 25
      },
      where: whereCondition
    });
  } else {
    ctx.body = [];
  }



  ctx.set("Cache-Control", "no-store")
  ctx.status = 200
  console.log("await for next element");
  await next()
}

async function searchProductConstructionType(ctx: Context, productId: string): Promise<string> {

  let productSpecs: any = await ctx.clients.vtexAPI.GetProductSpecification(productId);

  let constructionTypes = productSpecs
    .filter(function (spec: any) { return spec['Name'] == 'constructionType' })
    .map(function (spec: any) {
      return spec["Value"][0];
    });

  if (constructionTypes.length > 0) {
    return constructionTypes[0];
  } else {
    return '';
  }
}

async function getProductCategory(ctx: Context, productId: string): Promise<string> {
  let productDesc = await ctx.clients.vtexAPI.GetProduct(productId);
  let categoryid = productDesc.CategoryId;
  let categoryName: string = (await ctx.clients.vtexAPI.GetCategory(categoryid)).Name;
  return categoryName;
}
