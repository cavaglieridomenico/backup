import {UserInputError} from "@vtex/api";
import {callSalesforceTokenApiRefund} from "./service.refoundreturn.order";
import {json} from 'co-body'

export async function returnOrder(
    ctx: Context,
    next: () => Promise<any>
) {
    ctx.status = 200

    let product = await json(ctx.req)
    if (product == undefined) {
        ctx.status = 500
        throw new UserInputError('Object body is not present object = ' + product)
    } else {
        callSalesforceTokenApiRefund(ctx, "85635", product,2)
    }

    await next()
}
