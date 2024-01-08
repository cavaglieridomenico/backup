//@ts-ignore
//@ts-nocheck

import {refundMapping, returnMapping} from "./returnOrRefundMapper";
import { CustomLogger } from "../utils/Logger";

export async function triggerRefundOrReturnEmail(ctx: Context, key: string, product: any, type: number, tokenCredential: Object): Promise<Object> {
  return new Promise<Object>((resolve,reject) => {
      ctx.clients.SFMC.getAccessToken(tokenCredential)
        .then(res => {
          let prod = {};
          switch(type){
            case 1:
                prod = refundMapping(product);
                ctx.clients.SFMC.triggerEmail(prod, key, res.access_token)
                  .then(response => {
                    if(response?.responses[0]?.hasErrors==false){
                      resolve({status: 200, message: "Refund "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: request sent -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
                    }else{
                      reject({status: 400, message: "Refund "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: bad request -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
                    }
                  })
                  .catch(error => {
                    reject({status: error?.response?.status, message: "Refund "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: "+(error?.response?.data?.message!=undefined?error?.response?.data?.message:"bad request")+" -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
                  });
                break;
            case 2:
                prod = returnMapping(product);
                ctx.clients.SFMC.triggerEmail(prod, key, res.access_token)
                  .then(response => {
                    if(response?.responses[0]?.hasErrors==false){
                      resolve({status: 200, message: "Return "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: request sent -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
                    }else{
                      reject({status: 400, message: "Return "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: bad request -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
                    }
                  })
                  .catch(error => {
                    reject({status: error?.response?.status, message: "Return "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: "+(error?.response?.data?.message!=undefined?error?.response?.data?.message:"bad request")+" -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
                  });
          }
        })
        .catch(err => {
          switch(type){
            case 1:
              reject({status: err?.response?.status, message: "Refund "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - get access token: "+(err?.response?.data?.message!=undefined?err?.response?.data?.message:err?.response?.data?.error_description)})
              break;
            case 2:
              reject({status: err?.response?.status, message: "Return "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - get access token: "+(err?.response?.data?.message!=undefined?err?.response?.data?.message:err?.response?.data?.error_description)})
          }
        });
    });
}
