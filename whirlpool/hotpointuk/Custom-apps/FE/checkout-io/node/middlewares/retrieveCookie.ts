export async function retrieveCookie(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.CheckoutOrderFormOwnershipCookie = ctx.cookies.get("CheckoutOrderFormOwnership") as string
    await next()
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}
