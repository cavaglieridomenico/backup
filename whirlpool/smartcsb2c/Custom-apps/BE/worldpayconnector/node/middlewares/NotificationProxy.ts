import { ForbiddenError } from "@vtex/api"
import { ValidateNotification } from "../utils/validateNotification"
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";

export async function NotificationProxy(ctx: Context, next: () => Promise<any>) {
    ctx.vtex.logger = new CustomLogger(ctx)
    let logger = ctx.vtex.logger
    console.log("Notification validation")
    await ValidateNotification(ctx.ip).then(() => {
        logger.error(logMessage("[Notification] - Notification accepted"))
        console.log("Notification accepted")
    }, err => {
        logger.error(logMessage("[Notification] - Notification rejected, invalid domain"))
        logger.error(err)
        throw new ForbiddenError(JSON.stringify(err))
    })

    await next()
  }
