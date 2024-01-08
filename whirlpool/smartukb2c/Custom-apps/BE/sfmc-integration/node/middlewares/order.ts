import { getError } from "./errors";
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";


// Returns order details
export async function getOrderById(ctx: Context, isEvent: boolean) {
    // Get order id
    let id: string = '';
    if (isEvent) {
        //@ts-ignore
        id = ctx.body.id ? ctx.body.id : ctx.body.orderId;
    } else {
        //@ts-ignore
        id = ctx.query.id;
    }
    // Get order from VTEX API
    const res = await ctx.clients.vtexAPI.getOrder(id);

    // Parse response from API
    return JSON.parse(JSON.stringify(res.data));
}


// Build the body for the order details
export async function buildOrderDetails(ctx: Context, data: any) {
    // Init orders
    let orders: Array<any> = [];

    // Number of decimal digits
    // const decimalDigits: number = data.storePreferencesData.currencyFormatInfo.CurrencyDecimalDigits;

    // Kit management
    let items = []
    for (let element of data.items) {
        if (element.components.length > 0) {
            element.components.forEach((component: any) => {
                component.quantity = component.quantity * element.quantity
                component.price = component.price * component.quantity
                items.push(component)
            })
        } else {
            items.push(element)
        }
    }
    for (let element of items) {
        // Get SKU
        const sku = JSON.parse(JSON.stringify((await ctx.clients.vtexAPI.getProductSkuAlternative(element.id)).data));
        // Get main image URL
        const images = JSON.parse(JSON.stringify((await ctx.clients.vtexAPI.getImagesMain(sku.Id)).data));
        const imageSingle = images.find((image: any) => image.IsMain) === undefined ? images.find((image: any) => image.IsMain === false) : images.find((image: any) => image.IsMain);
        const image = sku.Images.find((i: any) => i.ImageName === imageSingle.Label)?.ImageUrl;
        const productDetails = JSON.parse(JSON.stringify((await ctx.clients.vtexAPI.getProductDetails(element.productId)).data));
        // Define baseURL
        const baseUrl: string = ctx.vtex.host == undefined ? ctx.vtex.account + ".myvtex.com" : ctx.vtex.host;

        let order = {
            keys: {
                orderId: data.orderId,
                orderItemId: element.uniqueId
            },
            values: {
                ProductJCode: sku.ProductSpecifications.find((f: any) => f.FieldName === 'jCode')?.FieldValues[0],
                description: productDetails.Description ? productDetails.Description : productDetails.Name,
                commercialCode: sku.ProductSpecifications.find((f: any) => f.FieldName === 'CommercialCode_field')?.FieldValues[0],
                code12NC: element.refId,
                orderItemQuantity: element.quantity,
                price: Number((element.price / 100).toFixed(2)),
                productUrl: `https://${baseUrl}${element.detailUrl}`,
                imageUrl: image,
                category: element.additionalInfo.categories === null ? null : element.additionalInfo.categories[0].name,
                deliveryType: data.shippingData.logisticsInfo[0].selectedSla
            }
        }
        // Update orders
        orders.push(order);
    }
    return orders;
}

// Return key based on the brand
export function orderKey(brand: string) {
    let key: string = '';

    if (process.env.TEST) {
        if (brand === 'whirlpool') {
            key = JSON.parse(process.env.TEST).ORDER_WHIRLPOOL_KEY;
        } else if (brand === 'bauknecht') {
            key = JSON.parse(process.env.TEST).ORDER_BAUKNECHT_KEY;
        } else if (brand === 'hotpoint') {
            key = JSON.parse(process.env.TEST).ORDER_HOTPOINT_KEY;
        } else if (brand === 'indesit') {
            key = JSON.parse(process.env.TEST).ORDER_INDESIT_KEY;
        }
    }
    return key;
}

// Send the details order to Salesforce
export async function sendOrderDetails(ctx: Context, brand: string, order: any, token: string) {
    ctx.vtex.logger = new CustomLogger(ctx);

    try {
        // Build body
        const orderBody = await buildOrderDetails(ctx, order);

        // Define the key based on the brand
        let key: string = orderKey(brand);

        ctx.vtex.logger.info(logMessage("Order Details Key: " + key + " - Payload: " + JSON.stringify(orderBody)));

        // Post order
        return await ctx.clients.sfmcAPI.productDetails(orderBody, key, token);

    } catch (error) {
        ctx.vtex.logger.error(logMessage("Error Order Details: " + error));
        console.log('************* Error Order Details **************');
        getError(error, ctx);
        return null;
    }
}
