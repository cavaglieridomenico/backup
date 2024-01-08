import { delay, formatErrorMessage, sendAlert } from "../utils/utils";
import { getBrand } from "./brand";
import { sendEmail } from "./email";
import { getError } from "./errors";
import { getOrderbyId, sendOrderDetails } from "./order";
import { getToken } from "./token";
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";

export async function confirmationOrder(ctx: Context, next: () => Promise<any>, isEvent: boolean = false) {
    ctx.vtex.logger = new CustomLogger(ctx);
    const appSettings = await ctx.clients.apps.getAppSettings(`${process.env.VTEX_APP_ID}`);
    process.env.TEST = JSON.stringify(appSettings);

    try {
        // Get order by ID
        const order = await getOrderbyId(ctx, isEvent);

        // Get product order brand
        const brand: string = getBrand(order);

        ctx.vtex.logger.info(logMessage("OrderConfirmation - getting Token for Order: " + JSON.stringify(order)));

        // Get token
        const token = await getToken(ctx, brand);

        ctx.vtex.logger.info(logMessage("OrderConfirmation - Token response : " + JSON.stringify(token)));

        // Send the order details
        const orderDetailsAPI_Response = await sendOrderDetails(
            ctx,
            brand,
            order,
            token.access_token
        );

        ctx.vtex.logger.info(logMessage("OrderConfirmation - Order Details response: " + JSON.stringify(orderDetailsAPI_Response)));

        // Wait 5-10 seconds
        await delay(5000);

        // Send the email
        const { emailAPI_Response, emailBody }: any = await sendEmail(
            ctx,
            'confirmation',
            brand,
            order,
            token.access_token
        );

        ctx.vtex.logger.info(logMessage("OrderConfirmation - Trigger Email response: " + JSON.stringify(emailAPI_Response) + " - Trigger Email Body: " + JSON.stringify(emailBody)));

        // Log for DEV
        console.log({
            type: 'CONFIRMATION ORDER',
            orderDetailsAPI_Response,
            emailAPI_Response,
            brand,
            order,
            emailBody
        })
        // End DEV log

        ctx.status = 200;
        ctx.body = {
            success: true,
            orderDetailsAPI_Response,
            emailAPI_Response,
            brand,
            type: 'CONFIRMATION',
            order,
            emailBody
        };

    } catch (error) {
        const err: string = (ctx.body as any).error ? JSON.stringify(ctx.body) : formatErrorMessage(error)
        if (!(err.includes("The event data contains duplicate value for an existing primary key. Please correct the event data and try again.")))
            sendAlert(ctx, `Create order ${(ctx.body as any).orderId ? (ctx.body as any).orderId : ctx.query.id + " via manual API call"} - VTEX ERROR`,
                `Create order ${(ctx.body as any).orderId ? (ctx.body as any).orderId : ctx.query.id}: ${err}`)

        ctx.vtex.logger.error(logMessage("Error Order Confirmation: " + error));
        console.log('************* Error Order Confirmation **************');
        getError(error, ctx);
    }
    await next();
}
