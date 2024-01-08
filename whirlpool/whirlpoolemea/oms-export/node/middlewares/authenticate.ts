import { adminCookie } from "../utils/constants";
import { stringify } from "../utils/functions";

export async function authenticate(ctx: Context, next: () => Promise<any>) {
  try {
    if ((await ctx.clients.Vtex.authenticatedUser(ctx.cookies.get(adminCookie) as string))?.user) {
      await next();
    } else {
      ctx.status = 401;
      ctx.body = "Invalid Credentials";
    }
  } catch (err) {
    ctx.status = 500;
    ctx.body = `Internal Server Error --details: ${stringify(err)}`;
  }
}
