import { getError } from "./errors";
import { CustomLogger } from "../utils/Logger";
import logMessage from "../utils/loggingUtils";


export async function buildEmailMessage(ctx: Context, type: string, brand: string, body: any) {

    // Get email from vtex
    const emailJson = JSON.parse(JSON.stringify((await ctx.clients.vtexAPI.getEmail(body.clientProfileData.userProfileId)).data))[0];

    // MESSAGE PARAMETERS
    // Shipping price
    let shippingPrice = Number((body.totals.find((t: { id: string; }) => t.id === "Shipping").value / 100).toFixed(2));
    // Totals
    const itemsTotalCost: number = Number((body.totals[0].value / 100).toFixed(2));
    const totalDiscount: number = Number((Math.abs(body.totals[1].value) / 100).toFixed(2));
    const totalOrderCost: number = Number((body.value / 100).toFixed(2));

    // Get language
    const language: string = await ctx.clients.vtexAPI.getLanguage(body.clientProfileData.userProfileId);

    // Get API Event key
    const eventKey: string = apiEventKey(type, brand);

    return {
        ContactKey: emailJson.email,
        EventDefinitionKey: eventKey,
        Data: {
            orderId: body.orderId,
            EmailAddress: emailJson.email,
            SubscriberKey: emailJson.email,
            orderNumberSAP: '',
            purchaseDate: body.creationDate,
            //paymentMethod: body.paymentData.transactions[0].payments[0].paymentSystemName,
            paymentMethod: getPaymentMethod(language),
            creditCardNumber: body.paymentData.transactions[0].payments[0].lastDigits,
            orderProductPrice: itemsTotalCost,
            orderTotalAdjustment: totalDiscount,
            orderSubtotal: itemsTotalCost,
            orderShippingPrice: shippingPrice,
            orderTotal: totalOrderCost,
            coupon: body.marketingData !== null ? body.marketingData.coupon : '',
            shippingFirstName: body.shippingData.address?.receiverName.split(' ')[0],
            shippingLastName: body.shippingData.address?.receiverName.split(' ')[1],
            shippingAddress: body.shippingData.address ? `${body.shippingData.address?.street ? body.shippingData.address?.street : ''} ${body.shippingData.address?.number ? body.shippingData.address?.number : ''} ${body.shippingData.address?.complement ? body.shippingData.address?.complement : ''}`.trim() : '',
            shippingZipCode: body.shippingData.address?.postalCode,
            shippingCity: body.shippingData.address?.city,
            shippingState: body.shippingData.address?.state,
            shippingCountry: body.shippingData.address?.country.slice(0, 2),
            shippingEmail: emailJson.email,
            shippingPhone: body.clientProfileData.phone,
            billingFirstName: body.clientProfileData.firstName,
            billingLastName: body.clientProfileData.lastName,
            billingAddress: body.paymentData.transactions[0].payments[0].billingAddress ? `${body.paymentData.transactions[0].payments[0].billingAddress?.street ? body.paymentData.transactions[0].payments[0].billingAddress?.street : ''} ${body.paymentData.transactions[0].payments[0].billingAddress?.number ? body.paymentData.transactions[0].payments[0].billingAddress?.number : ''} ${body.paymentData.transactions[0].payments[0].billingAddress?.complement ? body.paymentData.transactions[0].payments[0].billingAddress?.complement : ''}`.trim() : null,
            billingZipCode: body.paymentData.transactions[0].payments[0].billingAddress?.postalCode,
            billingCity: body.paymentData.transactions[0].payments[0].billingAddress?.city,
            billingState: body.paymentData.transactions[0].payments[0].billingAddress?.state,
            billingCountry: body.paymentData.transactions[0].payments[0].billingAddress?.country.slice(0, 2),
            billingEmail: emailJson.email,
            billingPhone: body?.clientProfileData.phone,
            billingOfficeAddress: body.shippingData.address?.street,
            shipInstructions: body?.paymentData.transactions[0].payments[0].billingAddress?.complement,
            currency: body.storePreferencesData.currencySymbol,
            delivery: shippingPrice,
            estimatedDeliveryDate: body?.shippingData.logisticsInfo[0]?.deliveryWindow != null ? parseDataFormat(body?.shippingData.logisticsInfo[0]?.deliveryWindow.startDateUtc, body?.shippingData.logisticsInfo[0]?.deliveryWindow.endDateUtc) : parseDataFormatSingle(body?.shippingData.logisticsInfo[0]?.shippingEstimateDate),
            language: `CH_${language}`
        }
    }
}



// Call the SalesForce API to send the email
export async function sendEmail(ctx: Context, type: string, brand: string, order: any, token: string) {
    ctx.vtex.logger = new CustomLogger(ctx);

    try {

        // Get message
        const message = await buildEmailMessage(ctx, type, brand, order);

        ctx.vtex.logger.info(logMessage("Send Email payload: " + JSON.stringify(message)));

        // Send email
        const res = await ctx.clients.sfmcAPI.sendEmail(message, token);

        return { emailAPI_Response: res, emailBody: message };

    } catch (error) {
        ctx.vtex.logger.error(logMessage("Error Send Email: " + error));
        console.log('************* Error Mail **************');
        getError(error, ctx);
        return null;
    }
}




// UTILITY FUNCTIONS

// Return API EVENT key based on the type of request and the brand (confirmation or cancellation)
export function apiEventKey(type: string, brand: string) {
    let key: string = '';
    if (process.env.TEST) {
        if (type === 'confirmation') {
            if (brand === 'whirlpool') {
                key = JSON.parse(process.env.TEST).CONFIRMATION_APIEVENT_WHIRLPOOL;
            } else if (brand === 'bauknecht') {
                key = JSON.parse(process.env.TEST).CONFIRMATION_APIEVENT_BAUKNECHT;
            } else if (brand === 'indesit') {
                key = JSON.parse(process.env.TEST).CONFIRMATION_APIEVENT_INDESIT;
            }
        } else if (type === 'cancellation') {
            if (brand === 'whirlpool') {
                key = JSON.parse(process.env.TEST).CANCELLATION_APIEVENT_WHIRLPOOL;
            } else if (brand === 'bauknecht') {
                key = JSON.parse(process.env.TEST).CANCELLATION_APIEVENT_BAUKNECHT;
            } else if (brand === 'indesit') {
                key = JSON.parse(process.env.TEST).CANCELLATION_APIEVENT_INDESIT;
            }
        } else {
            throw Error(`Order type ${type} not implemented.`);
        }
    }
    return key;
}

function parseDataFormat(data: string, data2: string) {
    let dataOriginal = new Date(data)
    let dataOriginal2 = new Date(data2)
    let dateMounth = dataOriginal.getDate() < 10 ? '0' + dataOriginal.getDate() : dataOriginal.getDate()
    let month = (dataOriginal.getMonth() + 1) < 10 ? '0' + (dataOriginal.getMonth() + 1) : (dataOriginal.getMonth() + 1)
    return '' + dateMounth + '/' + month + '/' + dataOriginal.getFullYear() + ' ' + dataOriginal.getHours() + ':' + (dataOriginal.getMinutes() === 0 ? '00' : dataOriginal.getMinutes()) + ' - ' + dataOriginal2.getHours() + ':' + (dataOriginal2.getMinutes() === 0 ? '00' : dataOriginal2.getMinutes())
}

function parseDataFormatSingle(data: string) {
    let dataOriginal = new Date(data)
    let dateMounth = dataOriginal.getDate() < 10 ? '0' + dataOriginal.getDate() : dataOriginal.getDate()
    let month = (dataOriginal.getMonth() + 1) < 10 ? '0' + (dataOriginal.getMonth() + 1) : (dataOriginal.getMonth() + 1)
    return '' + dateMounth + '/' + month + '/' + dataOriginal.getFullYear() + ' ' + dataOriginal.getHours() + ':' + (dataOriginal.getMinutes() === 0 ? '00' : dataOriginal.getMinutes())
}

function getPaymentMethod(locale: string) {
    const paymentMethodDe = 'Kreditkarte'
    const paymentMeethodIt = 'Carta di Credito'
    const paymentMethodFr = 'Carte de Crédit'
    let paymenthMetodTranslated = ''
    locale = locale.trim().toLowerCase()

    if (locale.includes('de')) {
        paymenthMetodTranslated = paymentMethodDe
    } else if (locale.includes('it')) {
        paymenthMetodTranslated = paymentMeethodIt
    } else if (locale.includes('fr')) {
        paymenthMetodTranslated = paymentMethodFr
    } else {
        paymenthMetodTranslated = paymentMethodDe
    }

    return paymenthMetodTranslated
}