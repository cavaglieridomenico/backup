import { AuthenticationError } from "@vtex/api"
import { credentials, testCredentials } from "../utils/constants"
import { HandleTestRequest } from "./TestRequestHandler"
import { CustomLogger } from "../utils/Logger"
import { GetHash } from "../utils/AuthenticationUtils"

export async function CheckCredentials(ctx: Context, next: () => Promise<any>) {

    if (ctx.get("X-VTEX-API-Is-TestSuite")) {
        let key = ctx.get('X-VTEX-API-AppKey')
        let token = GetHash(ctx.get('X-VTEX-API-AppToken'))
        if (token != testCredentials[key]) {
            throw new AuthenticationError("Credentials are not valid")
        }
        await HandleTestRequest(ctx);
    }
    else {
        let logger = new CustomLogger(ctx)
        let key = ctx.get('X-VTEX-API-AppKey')
        let token = GetHash(ctx.get('X-VTEX-API-AppToken'))
        if (token != credentials[key]) {
            logger.error("Request blocked: invalid credentials")
            throw new AuthenticationError("Credentials are not valid")
        }
        await next()
    }
}
