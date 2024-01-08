
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";
import { getToken } from "./token";
import { sendEmail } from "./email";
import { getError } from "./errors";
import json from "co-body";

export async function backInStock(ctx: Context, next: () => Promise<any>, isEvent: boolean = false, availabilityDocumentId: string | undefined = undefined) {

    ctx.vtex.logger = new CustomLogger(ctx);
    const appSettings = await ctx.clients.apps.getAppSettings(`${process.env.VTEX_APP_ID}`);
    ctx.vtex.logger.info("BackInStock - App Settings: " + JSON.stringify(appSettings))
    process.env.TEST = JSON.stringify(appSettings);

    try {
        let vtexAvailabilitySubscriberInfo: any = await getAvailabilitySubscriberInfo(ctx, isEvent, availabilityDocumentId);
        console.log(JSON.stringify(vtexAvailabilitySubscriberInfo));
        ctx.vtex.logger.info("BackInStock - Trigger from vtex MD: " + JSON.stringify(vtexAvailabilitySubscriberInfo))

        // Get product brand
        const brand: string = vtexAvailabilitySubscriberInfo.brand;

        ctx.vtex.logger.info(logMessage("BackInStock - getting Token for SKU Reference Id: " + JSON.stringify(vtexAvailabilitySubscriberInfo.skuRefId)));

        // Get token
        const token = await getToken(ctx, brand);

        ctx.vtex.logger.info(logMessage("BackInStock - Token response : " + JSON.stringify(token)));

        // Send the email
        const { emailAPI_Response, emailBody }: any = await sendEmail(
            ctx,
            'backInStock',
            brand,
            vtexAvailabilitySubscriberInfo,
            token.access_token
        );

        ctx.vtex.logger.info(logMessage("BackInStock - Trigger Email response: " + JSON.stringify(emailAPI_Response) + " - Trigger Email Body: " + JSON.stringify(emailBody)));

        // Log for DEV
        console.log({
            type: 'BACK_IN_STOCK EMAIL',
            emailAPI_Response,
            brand,
            emailBody
        })
        // End DEV log

        ctx.status = 200;
        ctx.body = {
            success: true,
            emailAPI_Response,
            brand,
            type: 'BACK_IN_STOCK',
            emailBody
        };

    } catch (error) {
        ctx.vtex.logger.error(logMessage("Error Back In Stock: " + error));
        console.log('************* Error Back In Stock **************');
        getError(error, ctx);
    }

    if (!isEvent) {
        await next();
    }
}

async function getAvailabilitySubscriberInfo(ctx: Context, isEvent: boolean, availabilityDocumentId: string | undefined) {
    if (!isEvent) {
        return json(ctx.req)
    } else {
        return (await ctx.clients.masterdata.searchDocuments({
            dataEntity: "AS",
            fields: ['_all'],
            pagination: {
                page: 1,
                pageSize: 25
            },
            where: `id=${availabilityDocumentId}`
        })
        )[0];
    }
}
