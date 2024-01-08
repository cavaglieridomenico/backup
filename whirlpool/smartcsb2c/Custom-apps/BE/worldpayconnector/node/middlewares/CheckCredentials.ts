import { AuthenticationError } from "@vtex/api"
import { credentials, testCredentials } from "../utils/constants"
import { HandleTestRequest } from "./TestRequestHandler"
import crypto from 'crypto'
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";

export async function CheckCredentials(ctx: Context, next: () => Promise<any>) {

    if (ctx.get("X-VTEX-API-Is-TestSuite")) {
        console.log("test request")
        let key = ctx.get('X-VTEX-API-AppKey')
        let token = crypto.createHash("sha256").update(ctx.get('X-VTEX-API-AppToken')).digest("hex");
        if (token != testCredentials[key]) {
            throw new AuthenticationError("Credentials are not valid")
        }
        await HandleTestRequest(ctx);
    }
    else {
        ctx.vtex.logger = new CustomLogger(ctx)
        let logger = ctx.vtex.logger
        let key = ctx.get('X-VTEX-API-AppKey')
        let token = crypto.createHash("sha256").update(ctx.get('X-VTEX-API-AppToken')).digest("hex");
        if (token != credentials[key]) {
            logger.error(logMessage("[CheckCredentials] Request blocked: invalid credentials"))
            console.log(new Date().toLocaleString('en-GB', { timeZone: 'Europe/Rome' }) + " - Request blocked: invalid credentials")
            throw new AuthenticationError("Credentials are not valid")
        }
        console.log("request accepted")
        await next()
    }
}
