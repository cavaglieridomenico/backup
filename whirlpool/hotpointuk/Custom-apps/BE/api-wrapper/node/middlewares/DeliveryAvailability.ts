import { json } from "co-body";
import { OrderForm } from "../typings/productAvalaibilityRequest";
import { TradeplaceReplyVtex, VtexGasTradeplace } from "../typings/TradeplaceReplyTimeSlots_vtex";
import { TradeplaceRequest } from "../typings/TradeplaceRequest";
import { today  } from "../utils/constants";
import { defaultTradeplaceReplyVtex, defaultTradeplaceRequest } from "../utils/Tradeplace constants/constants";
import { buildXML, parseXML } from "../utils/XMLhandler";
import { getUserData, getUserShippingData } from "./GetUserInfo";

export async function isSet(value :any) {
    let bool = false;
    if(Array.isArray(value)){
        bool= true;
    }else if(typeof value !== 'undefined' && value !== null){
        bool = true;
    }   
    return bool;
}

export async function productAvailabilityImpl(ctx: Context, next: () => Promise<any>) {
    const { 
        req,
        clients: { TP }
    } = ctx;
    ctx.set("Cache-Control", "no-store");
    
    const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
    process.env.VAR = JSON.stringify(appSettings);

    //Credentials
    let tpUsername = appSettings.tpUsername;
    let tpPassword = appSettings.tpPassword;
    
    //Orderform from frontend
    let body: OrderForm = await json(req);

    if(body.shippingData === undefined || body.items === undefined) {
        ctx.status = 404;
        ctx.body = "Json not found";
    }else {
        let productionMode = (await appSettings.productionMode !== undefined) ? appSettings.productionMode : false;

        //counter of valid material to send to tradeplace
        let validMaterials: number = 0;

        //Boolean to check if there is a gas with install
        let boolInst = false;

        //CHANGING THE REQUEST TO TRADEPLACE IF THERE ARE PRODUCTS ALLOWED FOR DELIVERY
        let requestJSON : TradeplaceRequest = JSON.parse(JSON.stringify(defaultTradeplaceRequest));

        // check of productionMode(appsetting)
        if (productionMode) {
            requestJSON.TradeplaceMessage.$.productionMode = 'production';    
        }
        
        //GAS product with installation bundled

        for(let i= 0 ; i < body.items.length; i++){
            for(let k= 0; k < body.items[i].bundleItems.length; k++){
                if(body.items[i].bundleItems[k].name && body.items[i].modalType){
                    if(JSON.stringify(body.items[i].bundleItems[k].name).toLowerCase() === "\"installation\"" && JSON.stringify(body.items[i].modalType).toLowerCase() === "\"furniture\""){
                        boolInst = true;
                    }
                }        
            }  
        }
        
        if(boolInst === true){
            let vtexGasProduct: VtexGasTradeplace = {
                isGasproduct: true,
                availableDeliveryWindows: []
            }
            ctx.res.setHeader('Content-Type', 'application/json; charset=UTF-8');
            ctx.body = vtexGasProduct; 
            ctx.status = 200;
        }else{
            //NO GAS PRODUCT WITH INSTALLATION IS ADDED SO we continue with a normal request for tradeplace
            for(let i= 0 ; i < body.items.length; i++){
                let itemDeliveryService = getTradePlaceDeliveryServiceFromItem(body.items[i]);
                for(let j = 0; j < body.shippingData.logisticsInfo[i].slas.length; j++){
                    
                    if(JSON.stringify(body.shippingData.logisticsInfo[i].slas[j].id).toLowerCase() === "\"scheduled\""){
                        validMaterials++;
                        requestJSON .TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestLineItems.ProductAvailabilityRequestLineItem.push({
                            Material: {
                                $ : {
                                    materialQualifier : "EAN"
                                },
                                _ : body.items[i].ean
                            },
                            Quantity : body.items[i].quantity,
                            DeliveryService : itemDeliveryService 
                        }) 
                    }
                }
            }
            if(validMaterials > 0){
                //SETTING THE JSON FOR TRADEPLACE REQUEST
                //CreationDate
                requestJSON.TradeplaceMessage.TransportEnvelope.CreationDate.Year = today.year
                requestJSON.TradeplaceMessage.TransportEnvelope.CreationDate.Month = today.month < 10 ? '0' + today.month : today.month.toString();
                requestJSON.TradeplaceMessage.TransportEnvelope.CreationDate.Day = today.day < 10 ? '0' + today.day : today.day.toString();
                requestJSON.TradeplaceMessage.TransportEnvelope.CreationDate.Hour = today.hour;
                requestJSON.TradeplaceMessage.TransportEnvelope.CreationDate.Minute = today.minute;
                requestJSON.TradeplaceMessage.TransportEnvelope.CreationDate.Second = today.seconds;

                //RequestedDeliveryDate
                requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.RequestedDeliveryDate.Year = today.year;
                requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.RequestedDeliveryDate.Month = today.month < 10 ? '0' + today.month : today.month.toString();
                requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.RequestedDeliveryDate.Day = today.day < 10 ? '0' + today.day : today.day.toString();
                
                //Masterdata Call to retrieve customerData when the fields are hidden by vtex
                let shippingDataInfo = await getUserShippingData(ctx, body.shippingData.address.addressId);
                let userInfo = await getUserData(ctx, body.clientProfileData.email);

                //console.log("shippingDataInfo---> " + JSON.stringify(shippingDataInfo));
                //console.log("userInfo---> " + JSON.stringify(userInfo));
                
                //SHIPTOPARTY

                //Phone number customer
                if(body.clientProfileData.phone.includes('*')){
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.PhoneNumber = userInfo[0].homePhone;
                }else{
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.PhoneNumber = body.clientProfileData.phone;
                }
                //firstname and lastname
                if(body.clientProfileData.firstName.includes('*')){
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.Name[0] = userInfo[0].firstName + ' ' + userInfo[0].lastName;
                }else{
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.Name[0] = body.clientProfileData.firstName + ' ' + body.clientProfileData.lastName;
                }    
                //street + complement(number)
                if(body.shippingData.address.number !== null){
                    if (body.shippingData.address.number != null && body.shippingData.address.number.includes('*')) {
                        requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.Street[0] = shippingDataInfo[0].number + ',' + shippingDataInfo[0].street;
                    } else {
                        requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.Street[0] = body.shippingData.address.number + ', ' + body.shippingData.address.street;
                    }
                }else{
                    if (body.shippingData.address.complement != null && body.shippingData.address.complement.includes('*')) {
                        requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.Street[0] = shippingDataInfo[0].complement + ',' + shippingDataInfo[0].street;
                    } else {
                        requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.Street[0] = body.shippingData.address.complement + ', ' + body.shippingData.address.street;
                    }
                }
                //district
                if(body.shippingData.address.complement != null && body.shippingData.address.neighborhood === null){
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.District = "";
                }else if(body.shippingData.address.neighborhood && body.shippingData.address.neighborhood.includes('*')){
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.District = shippingDataInfo[0].state;
                }else{
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.District = body.shippingData.address.neighborhood;
                }
                //Postal code 
                if(body.shippingData.address.postalCode.includes('*')){
                    let postalCodeMD = shippingDataInfo[0].postalCode;
                        //-----POSTALCODE FILTER----
                    if (postalCodeMD.indexOf(' ') >= 0){
                        requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.PostalCode = postalCodeMD;
                    }else{
                        switch (postalCodeMD.length) {
                        case 7:{
                                postalCodeMD = postalCodeMD.substr(0, 4) + ' ' + postalCodeMD.substr(4);
                            break;
                        }
                        case 6: {
                                postalCodeMD = postalCodeMD.substr(0, 3) + ' ' + postalCodeMD.substr(3);
                            break;
                        }
                        case 5:{
                                postalCodeMD = postalCodeMD.substr(0, 2) + ' ' + postalCodeMD.substr(2);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                        requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.PostalCode = postalCodeMD;
                    }
                }else{
                    //FILTER POSTALCODE
                    if (body.shippingData.address.postalCode.indexOf(' ') >= 0) {
                        requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.PostalCode = body.shippingData.address.postalCode;
                    } else {
                        switch (body.shippingData.address.postalCode.length) {
                            case 7: {
                                body.shippingData.address.postalCode = body.shippingData.address.postalCode.substr(0, 4) + ' ' + body.shippingData.address.postalCode.substr(4);
                                break;
                            }
                            case 6: {
                                body.shippingData.address.postalCode = body.shippingData.address.postalCode.substr(0, 3) + ' ' + body.shippingData.address.postalCode.substr(3);
                                break;
                            }
                            case 5: {
                                body.shippingData.address.postalCode = body.shippingData.address.postalCode.substr(0, 2) + ' ' + body.shippingData.address.postalCode.substr(2);
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                        requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.PostalCode = body.shippingData.address.postalCode;
                    }
                }
                //City
                if(body.shippingData.address.city !== null && body.shippingData.address.city.includes('*')){
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.City = shippingDataInfo[0].city;
                }else{
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.City = body.shippingData.address.city;
                }
                

                //CountryCode Replacement from GBR to UK
                if(body.shippingData.address.country === "GBR"){
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.CountryCode = "UK";
                }else{
                    requestJSON.TradeplaceMessage.BusinessMessage.ProductAvailabilityRequest.ProductAvailabilityRequestHeader.ShipToParty.Party.CountryCode = body.shippingData.address.country;
                }
                
                //create new request for tradeplace with all the dynamic fields related to the new customer
                let changedRequestXML = buildXML(requestJSON, 'TP');
                
                //console.log("ChangedRequest in xml ------->" + changedRequestXML);

                let replyXML = await TP.productAvailability(changedRequestXML, tpUsername, tpPassword);

                //console.log("REPLY : " + replyXML);
                
                let replyJSON: any = parseXML(replyXML);
                let waitingBool = false;

                //Error Handler "E" in ReplyHeader
                for(let i = 0; i < replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyHeader.length; i++){
                    if(replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyHeader[i].MessageType[0] === "E"){

                        let error = {
                            status: replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyHeader[i].MessageCode[0],
                            type: replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyHeader[i].MessageType[0],
                            text: replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyHeader[i].MessageText[0],
                            description: "no availability date for the product",
                            availableDeliveryWindows: [ 
                                /* {
                                startDateUTC: (todayPlus3.year + '-' + todayPlus3.month + '-' + todayPlus3.day + 'T' + '07' + ':' + '00' + '+00:00').toString(),
                                endDateUTC: (todayPlus3.year + '-' + todayPlus3.month + '-' + todayPlus3.day + 'T' + '20' + ':' + '00' + '+00:00').toString() 
                            }*/]
                        }
                        ctx.res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                        ctx.status = 400;
                        ctx.res.end(JSON.stringify(error));
                        await next();
                    }
                }

                //Error Handler "E" in Product availability reply line item
                if(replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems !== undefined){
                    for(let i = 0; i < replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem.length; i++){
                        if(replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem[i].LineStatus != undefined && replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem[i].LineStatus[0]?.ErrorType[0] === "E"){
                            let error = {
                                status: replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem[i].LineStatus[0].ErrorCode[0],
                                type: replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem[i].LineStatus[0].ErrorType[0],
                                text: replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem[i].LineStatus[0].ErrorText[0],
                                description: "no availability date for the product",
                                availableDeliveryWindows: [ /*{
                                    startDateUTC: (todayPlus3.year + '-' + todayPlus3.month + '-' + todayPlus3.day + 'T' + '07' + ':' + '00' + '+00:00').toString(),
                                    endDateUTC: (todayPlus3.year + '-' + todayPlus3.month + '-' + todayPlus3.day + 'T' + '20' + ':' + '00' + '+00:00').toString()
                                }*/]
                            }
                            ctx.res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                            ctx.status = 400;
                            ctx.res.end(JSON.stringify(error));
                        }
                    }
                }    
                //Error Handler in ReplylineItem with a W Type
                for(let i = 0; i < replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem.length; i++){
                    if(replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem[i].LineStatus != undefined && replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem[i].LineStatus[0]?.ErrorType[0] === "W"){
                        let error = {
                            status: replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem[i].LineStatus[0].ErrorCode[0],
                            type: replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem[i].LineStatus[0].ErrorType[0],
                            text: replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem[i].LineStatus[0].ErrorText[0],
                            description: "no availability date for the product",
                            availableDeliveryWindows: [/*{
                                startDateUTC: (todayPlus3.year + '-' + todayPlus3.month + '-' + todayPlus3.day + 'T' + '07' + ':' + '00' + '+00:00').toString(),
                                endDateUTC: (todayPlus3.year + '-' + todayPlus3.month + '-' + todayPlus3.day + 'T' + '20' + ':' + '00' + '+00:00').toString()
                            }*/]
                        }
                        waitingBool = true;
                        ctx.res.setHeader('Content-Type', 'application/json; charset=UTF-8');
                        ctx.status = 200;
                        ctx.res.end(JSON.stringify(error));
                        
                    }
                }
                //estimated delivery date and time slots in UTC ex: "2021-06-21T07:00:00+00:00"
                let tradeplaceReplyVtex: TradeplaceReplyVtex = JSON.parse(JSON.stringify(defaultTradeplaceReplyVtex));
                let replyVtexJSON: TradeplaceReplyVtex = JSON.parse(JSON.stringify(defaultTradeplaceReplyVtex));
                
                //ADD NEXTDAYUNAVAILABLE field if the products are both for scheduling and for the next day delivery

                let tomorrow: number = new Date().getDate() + 1;

                if(replyJSON != undefined && waitingBool !== true){
                    
                    replyJSON.TradeplaceMessage.BusinessMessage[0].ProductAvailabilityReply[0].ProductAvailabilityReplyLineItems[0].ProductAvailabilityReplyLineItem.forEach((productAvailabilityLineItem: any) => {
                        productAvailabilityLineItem.HDConfirmationSchedule.forEach((hdConfirmationSchedule: any) => {
                            hdConfirmationSchedule.HDConfirmationScheduleItem.forEach((hdConfirmationScheduleItem: any) => {
                                //console.log(hdConfirmationScheduleItem.EstimatedDate);
                                
                                const year = hdConfirmationScheduleItem.EstimatedDate[0].Year[0];
                                const month = hdConfirmationScheduleItem.EstimatedDate[0].Month[0];
                                const day = hdConfirmationScheduleItem.EstimatedDate[0].Day[0];
                                
                                if (tomorrow == day) {
                                    let defaultFrom = '06:00+00:00';
                                    let defaultTo = '21:00+00:00';
                                    tradeplaceReplyVtex.availableDeliveryWindows.push(
                                    {
                                            startDateUTC: (year + '-' + month +'-'+ day + 'T' + defaultFrom).toString(),
                                            endDateUTC: (year + '-' + month + '-' + day + 'T' + defaultTo).toString()
                                    });
                                } else if(hdConfirmationScheduleItem.DeliverySlots !== undefined){
                                    hdConfirmationScheduleItem.DeliverySlots[0].DeliverySlot.forEach((deliverySlot: any) => {
                                        
                                        const hourFrom = deliverySlot.FromTime[0].Hour[0];
                                        const minuteFrom = deliverySlot.FromTime[0].Minute[0].toString();
                                        const hourTo = deliverySlot.ToTime[0].Hour[0];
                                        const minuteTo = deliverySlot.ToTime[0].Minute[0];

                                        tradeplaceReplyVtex.availableDeliveryWindows.push(
                                        {
                                            startDateUTC: (year + '-' + month +'-'+ day +'T' + hourFrom + ':' + minuteFrom + '+00:00').toString(),
                                            endDateUTC: (year + '-' + month + '-' + day + 'T' + hourTo + ':' + minuteTo + '+00:00').toString()
                                        }
                                        );
                                    });
                                } else {
                                    let defaultFrom = '07:00+00:00';
                                    let defaultTo = '20:00+00:00';
                                    tradeplaceReplyVtex.availableDeliveryWindows.push(
                                    {
                                            startDateUTC: (year + '-' + month +'-'+ day + 'T' + defaultFrom).toString(),
                                            endDateUTC: (year + '-' + month + '-' + day + 'T' + defaultTo).toString()
                                    });
                                }
                                
                                
                                
                            });
                        });
                    });

                    //Delivery Together and response with the same days for every product
                    tradeplaceReplyVtex.availableDeliveryWindows.forEach(replyVtex => {
                        if (tradeplaceReplyVtex.availableDeliveryWindows.filter(dates => (replyVtex.startDateUTC === dates.startDateUTC && replyVtex.endDateUTC === dates.endDateUTC)).length === validMaterials) {
                            if (!replyVtexJSON.availableDeliveryWindows.find(dates => replyVtex.startDateUTC === dates.startDateUTC && replyVtex.endDateUTC === dates.endDateUTC)) {
                                replyVtexJSON.availableDeliveryWindows.push(replyVtex);
                            }
                        }
                    });
                    ctx.status = 200;
                    ctx.body = replyVtexJSON;
                }

            }else{
                //when there are no products viable for scheduling
                ctx.status = 200;
                ctx.body = {
                    description: "no availability date for the product",
                    availableDeliveryWindows: [
                        /*{
                        startDateUTC: (todayPlus3.year + '-' + todayPlus3.month + '-' + todayPlus3.day + 'T' + '23' + ':' + '58' + '+00:00').toString(),
                        endDateUTC: (todayPlus3.year + '-' + todayPlus3.month + '-' + todayPlus3.day + 'T' + '23' + ':' + '59' + '+00:00').toString()
                        }*/
                    ]
                };
            } 
        }            
        
    }
    
    await next();      
}

function getTradePlaceDeliveryServiceFromItem(item:any):string {
    let deliveryService:string = '';
    let bundleItems:Array<any> = item.bundleItems;
    let hasInstallation = bundleItems.filter(bundleItem  => bundleItem.name === 'Installation').length > 0;
    let hasRemoval = bundleItems.filter(bundleItem  => bundleItem.name === 'Removal').length > 0;
    
    if (hasInstallation) {
        deliveryService = 'UnPackAndInstall';
    } else if(hasRemoval) {
        deliveryService = 'RemoveScrap';
    }

    return deliveryService;
}
