import { IncomingMessage } from "http"
import { stringify } from "../utils/functions"

export async function WorldPayProxy(ctx: Context, next: () => Promise<any>) {
  try {
    const body = await ReadBody(ctx.req)
    const WP_RESPONSE = await ctx.clients.worldpayAPI.PaymentService(body, ctx.state.settings.wpusername, ctx.state.settings.wppassword)
    ctx.state.logger.debug(`[WORLDPAY PROXY] response: ${stringify(WP_RESPONSE.data)}`)
    ctx.body = WP_RESPONSE.data
    ctx.status = WP_RESPONSE.status
  } catch (error) {
    ctx.state.logger.error(`[WORLDPAY PROXY] error: ${stringify(error)}`)
    ctx.status = error.status ?? 500
    ctx.body = error.message ?? "Internal Server Error"
  }
  await next()
}

export async function ReadBody(reqBody: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ""
    reqBody.on('data', data => {
      body += data
    })

    reqBody.on('end', () => {
      resolve(body)
    })

    reqBody.on('error', (err) => {
      reject(err)
    })
  })
}