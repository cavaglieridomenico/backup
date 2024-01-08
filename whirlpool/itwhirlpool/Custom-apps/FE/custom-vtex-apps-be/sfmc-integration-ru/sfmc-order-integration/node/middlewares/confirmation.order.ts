import {checkToken} from "./service";

export async function confirmationCreateOrder(
    ctx: Context,
    next: () => Promise<any>
) {
    console.log("Confirmation")
    ctx.set('Cache-Control', 'no-store')
    checkToken(ctx, "D6F0BC38-3E19-45C5-BB27-1D02BA4CD22E", "84144")
    ctx.status = 200
    await next()
}
