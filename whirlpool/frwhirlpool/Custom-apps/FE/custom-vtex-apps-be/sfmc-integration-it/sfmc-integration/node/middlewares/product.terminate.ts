import {checkAccessTokenProduct} from "./service";

export async function productTerminate(
    ctx: Context,
    next: () => Promise<any>
) {

    checkAccessTokenProduct(ctx,"84145",false)
    ctx.status = 200
    await next()
}
