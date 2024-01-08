export async function GetOrder(ctx: Context, next: () => Promise<any>) {


  let orderid = ctx.vtex.route.params.id as string
  let email = ctx.query.email as string
  let order = await ctx.clients.vtexAPI.GetOrder(orderid)
  //ctx.body = loggedUser.userId == order.clientProfileData.userProfileId?order:{}
  let user = await ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: "CL",
    fields: ["email"],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: "userId=" + order.clientProfileData.userProfileId
  })

  if (user.length > 0 && user[0].email == email) {
    ctx.status = 200
    let pec = order.customData?.customApps?.find((app: { id: string }) => app.id == "fiscaldata")?.fields?.SDIPEC
    ctx.body = {
      pec: pec && pec != "null" ? pec : "",
      ...order.invoiceData,
      invoiceName: order.clientProfileData.tradeName ? order.clientProfileData.tradeName : "",
      fiscalCode: order.clientProfileData.stateInscription ? order.clientProfileData.stateInscription : "",
      phone: order.clientProfileData.phone ? order.clientProfileData.phone : ""
    }
  } else {
    ctx.status = 403
  }

  ctx.set("Cache-Control", "no-store")

  await next()
}
