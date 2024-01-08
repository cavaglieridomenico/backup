
export async function Test(ctx: Context, next: () => Promise<any>) {


  let orderid = ctx.vtex.route.params.orderid as string
  let authDate = new Date(Date.now() + (2 * 3600000)) //added timezone hours

  ctx.body = {
    CC_TYPE: "WMC",
    CC_NUMBER: "99444433111648171111",
    CC_VALID_T: "11.2021",
    CC_NAME: "Vincenzo Conte",
    BILLAMOUNT: 200.00,
    AUTH_FLAG: "X",
    AUTHAMOUNT: 200.00,
    CURRENCY: "EUR",
    CURR_ISO: "EUR",
    AUTH_DATE: `${authDate.getDate().toString().padStart(2, "0")}.${(authDate.getMonth() + 1).toString().padStart(2, "0")}.${authDate.getFullYear()}`,
    AUTH_TIME: authDate.toLocaleTimeString("it-CH", { timeZone: "UTC"}),
    AUTH_CC_NO: "928882",
    AUTH_REFNO: "209450502",
    CC_REACT: "A",
    CC_RE_AMOUNT: 200.00,
    GL_ACCOUNT: "0000000000",
    CC_STAT_EX: "C",
    CC_REACT_T: orderid,
    MERCHIDCL: "VTEXIT",
    DATAORIGIN: "E"
  }

  ctx.status = 200
  await next()
}
