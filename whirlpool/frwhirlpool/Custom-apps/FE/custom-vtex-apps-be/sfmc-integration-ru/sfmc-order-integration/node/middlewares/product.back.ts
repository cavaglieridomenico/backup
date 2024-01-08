import {checkAccessTokenProduct} from "./service";


export async function productBack(
    ctx: Context,
    next: () => Promise<any>
) {

    checkAccessTokenProduct(ctx, "84145", true)
    ctx.status = 200
    await next()
}
