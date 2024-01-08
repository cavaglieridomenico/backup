import {checkToken} from "./service";


export async function canceledCreateOrder(
    ctx: Context,
    next: () => Promise<any>
) {
    await checkToken(ctx, "D6F0BC38-3E19-45C5-BB27-1D02BA4CD22E",  "84956")
    ctx.status = 200
    await next()
}
