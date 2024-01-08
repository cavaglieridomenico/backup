import { delay } from "../utils/utils";
import { getBrand } from "./brand";
import { sendEmail } from "./email";
import { getError } from "./errors";
import { getOrderById, sendOrderDetails } from "./order";
import { getToken } from "./token";
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";

export async function cancellationOrder(ctx: Context, next: () => Promise<any>, isEvent: boolean = false) {
    ctx.vtex.logger = new CustomLogger(ctx);
    const appSettings = await ctx.clients.apps.getAppSettings(`${process.env.VTEX_APP_ID}`);
    process.env.TEST = JSON.stringify(appSettings);

    try {
        // Get order by ID
        const order = await getOrderById(ctx, isEvent);

        // Get product order brand
        const brand: string = getBrand(order);

        ctx.vtex.logger.info(logMessage("OrderCancellation - getting Token for Order: " + JSON.stringify(order)));

        // Get token
        const token = await getToken(ctx, brand);

        ctx.vtex.logger.info(logMessage("OrderCancellation - Token response : " + JSON.stringify(token)));

        // Send the order details
        const orderDetailsAPI_Response = await sendOrderDetails(
            ctx,
            brand,
            order,
            token.access_token
        );

        ctx.vtex.logger.info(logMessage("OrderCancellation - Order Details response: " + JSON.stringify(orderDetailsAPI_Response)));

        // Wait 5-10 seconds
        await delay(5000);

        // Send the email
        const { emailAPI_Response, emailBody }: any = await sendEmail(
            ctx,
            'cancellation',
            brand,
            order,
            token.access_token
        );

        ctx.vtex.logger.info(logMessage("OrderCancellation - Trigger Email response: " + JSON.stringify(emailAPI_Response) + " - Trigger Email Body: " + JSON.stringify(emailBody)));

        // Log for DEV
        console.log({
            type: 'CANCELLATION ORDER',
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
            type: 'CANCELLATION',
            order,
            emailBody
        };

    } catch (error) {
        ctx.vtex.logger.error(logMessage("Error Order Cancellation: " + error));
        console.log('************* Error Order Cancellation **************');
        getError(error, ctx);
    }
    await next();
}
