export async function GetOrderShipmentCustomData(ctx: Context, next: () => Promise<any>) {


    let orderid = ctx.vtex.route.params.orderId as string
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
  
    console.log(user)
    

    if (user.length > 0 && user[0].email == email) {
      ctx.status = 200
      
      let tpAPpFIelds = order.customData?.customApps?.find((app: { id: string }) => app.id == "tradeplace")?.fields;
      
      ctx.body = {
          isGAs : tpAPpFIelds.connectedGas,
          shipTogether : tpAPpFIelds.shipTogether
      }
    } else {
      ctx.status = 403
    }
  
    ctx.set("Cache-Control", "no-store")
  
    await next()
  }
  