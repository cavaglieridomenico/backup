import json from 'co-body';
import { getError } from "./errors";
import { IOResponse } from "@vtex/api";
import { checkCredentials } from "../utils/credentials";

const BACK_IN_STOCK_EVENT:string = "back-in-stock"

export async function triggerBackInStockEmail(ctx: Context, next: () => Promise<any> ) {

    try {
        const {
            clients: { sku, document, masterdata }  // Get needed client from context
        } = ctx;

        //Get the request body
        let requestBody = await json(ctx.req)

        ctx.set('Cache-Control', 'no-store');

        checkCredentials(ctx);

        if (ctx.status !== 403) {
            const dataEntityName: string = 'AS';

            //Make checks on the input data
            if (requestBody.refId == undefined || requestBody.refId == "" || requestBody.refId == null) {
                ctx.status = 400
                ctx.body = {
                    error: "Invalid or missing product refId"
                }
            } else {
                //Get the skuId of the product from the refId
                let vtexResponse: any
                vtexResponse = await sku.getSkuByRefId(requestBody.refId)

                let skuId = vtexResponse.Id

                //If the product was found
                if (skuId != undefined) {
                    //Get all records where skuId is equal to what we just got from the availability subscriber entity
                    let records: IOResponse<any>
                    let queryString: string = `?_fields=_all&_size=1000&_sort=createdIn ASC&_where=skuId=${skuId} AND notificationSend=false`;

                    // Get the first 1000 records
                    records = await document.scrollDocuments(dataEntityName, queryString);

                    // Check if total content is more than 1000 records
                    const contentTotal: number = Number(records.headers['rest-content-total']);

                    // Add token to query string
                    const token: string = records.headers['x-vtex-md-token'];
                    queryString += `&_token=${token}`;

                    if (contentTotal > 1000) {
                        let n_iterations: number = Math.ceil(contentTotal / 1000) - 1;

                        while (n_iterations > 0) {
                            // Get next records
                            records.data.push(...(await document.scrollDocuments(dataEntityName, queryString)).data);
                            // Update iteration
                            n_iterations--;
                        }
                    }

                    // Exhaust token
                    await document.scrollDocuments(dataEntityName, queryString);

                    //Check record length. If zero, it means nobody subscribed to be notified about the availability of the product
                    if (records.data.length === 0) {
                        ctx.status = 200
                        ctx.body = {
                            warning: "There are no subscribers for the product with SKU Reference Id: " + requestBody.refId
                        }
                    } else {
                        console.log("Triggering sending emails")
                        //Send the email notification to all emails in the records array the salesforce by leveraging triggers.
                        
                        let updatedDocuments = [];

                        for (let i = 0; i < records.data.length; i++) {
                            
                            vtexResponse = await masterdata.updatePartialDocument({
                                dataEntity: 'AS',
                                id: records.data[i].id,
                                fields: {
                                    notificationSend: 'true',
                                    skuRefId: requestBody.refId
                                }
                            });

                            updatedDocuments.push(records.data[i].id);

                            console.log("Notification sent for the user: " + records.data[i].email)
                        }

                        console.log(`Sending event ${BACK_IN_STOCK_EVENT} for elements ${updatedDocuments}`);

                        ctx.clients.events.sendEvent('', BACK_IN_STOCK_EVENT, {
                            customersToSend : updatedDocuments
                        });

                        ctx.status = 200
                        ctx.body = {
                            message: "Notifications sent successfully for the product with SKU Reference Id: " + requestBody.refId
                        }
                    }
                }
            }
        }
    } catch (error) {
        getError(error, ctx);
    }

    await next()
}
