import {checkTokenEvent} from "./service";


export async function someStates(
    ctx: StatusChangeContext,
    next: () => Promise<any>
) {
    console.log(ctx.body)
    console.log('event**************************')
    checkTokenEvent(ctx, "D6F0BC38-3E19-45C5-BB27-1D02BA4CD22E", "84857")

    await next()
}

export async function allStates(
    ctx: StatusChangeContext,
    next: () => Promise<any>
) {
    console.log('all '+ctx.state)

    await next()
}
