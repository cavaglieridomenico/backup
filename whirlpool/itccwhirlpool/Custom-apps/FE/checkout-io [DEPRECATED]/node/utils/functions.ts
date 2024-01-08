export async function getPostalCodeByAD(addressId: string, ctx: Context) {

  let postalCode = "";

  try {
    console.log("addId -> ", addressId)
    let postalCodeMD: any = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "AD",
      fields: ["postalCode"],
      pagination: { page: 1, pageSize: 10 },
      where: `addressName=${addressId}`
    });
    postalCode = postalCodeMD[0].postalCode;
    ctx.status = 200;
    return postalCode;

  } catch (error) {
    ctx.status = 500;
    return error;
  }

}
