import { cancellationOrder } from "./cancellationOrder";
import { confirmationOrder } from "./confirmationOrder";
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";

// Order confirmation event
export async function orderConfirmationEvent(ctx: any, next: () => Promise<any>) {
    ctx.vtex.logger = new CustomLogger(ctx);
    // Define setting and env
    const appSettings = await ctx.clients.apps.getAppSettings(`${process.env.VTEX_APP_ID}`);
    process.env.TEST = JSON.stringify(appSettings);
    
    // Call confirmation order
    ctx.vtex.logger.info(logMessage("Confirmation Order Event received"));
    console.log('**************** CONFIRMATION ORDER EVENT ****************')
    confirmationOrder(ctx, next, true);

    await next();
}

// Order cancellation event
export async function orderCancellationEvent(ctx: any, next: () => Promise<any>) {
    ctx.vtex.logger = new CustomLogger(ctx);
    // Define setting and env
    const appSettings = await ctx.clients.apps.getAppSettings(`${process.env.VTEX_APP_ID}`);
    process.env.TEST = JSON.stringify(appSettings);
    
    // Call cancellation order
    ctx.vtex.logger.info(logMessage("Cancellation Order Event received"));
    console.log('**************** CANCELLATION ORDER EVENT ****************')
    cancellationOrder(ctx, next, true);

    await next();
}
