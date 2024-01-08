import { guestCheckoutCookie } from "../utils/constants"

export async function fetchGuestUserCookie(ctx: Context, next: () => Promise<any>) {
  const cookieValue = ctx.cookies.get(guestCheckoutCookie);
  ctx.state.cookies = cookieValue ? [`${guestCheckoutCookie}=${ctx.cookies.get(guestCheckoutCookie)}`] : [];
  await next();
}
