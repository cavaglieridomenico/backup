//@ts-ignore
//@ts-nocheck

import { resolve } from "dns";
import {refundMapping, returnMapping} from "../clients/refoundreturn.mapping";
import { CustomLogger } from "../utils/Logger";


let tockenCredential = {
    grant_type: '',
    client_id: '',
    client_secret: '',
}

/**
 * callSalesforceTokenApiRefund - called for return or refund operation - prepares the request to Salesforce to obtain token
 * @param ctx reference to the object that "owns" the currently executing code
 * @param key keyRefund or keyReturn - property on manifest and populate by admin console with Salesforce parameters
 * @param product reference to the object that represents the product to be refunded or replaced
 * @param type number that identify the requested operation  (1 refund, 2 return) 
 * @returns 
 */
export async function callSalesforceTokenApiRefund(ctx: any, key: string, product: any, type: number): Promise<Object> {
  return new Promise<Object>(async function(resolve,reject){
      tockenCredential.grant_type = JSON.parse(process.env.TEST+"").granttype;
      tockenCredential.client_id =  JSON.parse(process.env.TEST+"").clientid;
      tockenCredential.client_secret = JSON.parse(process.env.TEST+"").clientsecret;
      const options = {
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
          }
      };
      let tokenJason = "";
      ctx.vtex.logger = new CustomLogger(ctx);
      await ctx.clients.SfmcAPI.getToken(tockenCredential)
            .then(res => {ctx.vtex.logger.info(`[PASSED PARAM ${type == 1 ? 'REFUND' : 'RETURN'} ${product?.ContactAttributes?.SubscriberAttributes?.OrderNumber} - ${JSON.stringify(res).replace(/\\/g,"").replace(/"/g," ")}`); tokenJason=res})
            .catch(err => {
              switch(type){
                case 1:
                  reject({status: err?.response?.status, message: "Refund "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - get access token: "+(err?.response?.data?.message!=undefined?err?.response?.data?.message:err?.response?.data?.error_description)})
                  break;
                case 2:
                  reject({status: err?.response?.status, message: "Return "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - get access token: "+(err?.response?.data?.message!=undefined?err?.response?.data?.message:err?.response?.data?.error_description)})
              }
              tokenJason = undefined;
            });
      if(tokenJason!=undefined){
        switch (type) {
            case 1:
                await postSalesforceRefund(ctx, key, tokenJason.access_token, product)
                      .then(res => {
                        resolve(res);
                      })
                      .catch(err => {
                        reject(err);
                      });
                break;
            case 2:
                await postSalesforceReturn(ctx, key, tokenJason.access_token, product)
                      .then(res => {
                        resolve(res);
                      })
                      .catch(err => {
                        reject(err);
                      });
        }
      }
    });
}

/**
 * postSalesforceRefund
 * @param ctx reference to the object that "owns" the currently executing code
 * @param key keyRefund - property on manifest and populate by admin console
 * @param access_token token obtained by Salesforce
 * @param product reference to the object that represents the product for which the refund has been requested 
 * @returns 
 */
async function postSalesforceRefund(ctx: any, key: string, access_token: any, product: any): Promise<Object> {
  return new Promise<Object>(async function(resolve,reject){
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${access_token}`,
        }
    };
    let prod = refundMapping(product);
    await ctx.clients.SfmcAPI.refundOrder(prod, key, access_token)
          .then(response => {
            ctx.vtex.logger.info(`[REFUND ORDER] ${product?.ContactAttributes?.SubscriberAttributes?.OrderNumber} - ${JSON.stringify(response).replace(/\\/g,"").replace(/"/g," ")}`);
            if(response?.responses[0]?.hasErrors==false){
              resolve({status: 200, message: "Refund "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: request sent -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
            }else{
              reject({status: 400, message: "Refund "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: bad request -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
            }
          })
          .catch(error => {
            reject({status: error?.response?.status, message: "Refund "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: "+(error?.response?.data?.message!=undefined?error?.response?.data?.message:"bad request")+" -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
          });
  });
}

/**
 * postSalesforceReturn
 * @param ctx ctx reference to the object that "owns" the currently executing code
 * @param key keyReturn - property on manifest and populate by admin console
 * @param access_token token obtained by Salesforce 
 * @param product reference to the object that represents the product for which the refund has been requested  
 * @returns 
 */
async function postSalesforceReturn(ctx: any, key: string, access_token: any, product: any): Promise<Object> {
  return new Promise<Object>(async function(resolve,reject){
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${access_token}`,
        }
    };
    let prod = returnMapping(product);
    await ctx.clients.SfmcAPI.refundOrder(prod, key, access_token)
    .then(response => {
      ctx.vtex.logger.info(`[RETURN ORDER] ${product?.ContactAttributes?.SubscriberAttributes?.OrderNumber} - ${JSON.stringify(response).replace(/\\/g,"").replace(/"/g," ")}`);
      if(response?.responses[0]?.hasErrors==false){
        resolve({status: 200, message: "Return "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: request sent -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
      }else{
        reject({status: 400, message: "Return "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: bad request -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
      }
    })
    .catch(error => {
      reject({status: error?.response?.status, message: "Return "+product?.ContactAttributes?.SubscriberAttributes?.OrderNumber+" - form data: "+(error?.response?.data?.message!=undefined?error?.response?.data?.message:"bad request")+" -- Payload: "+JSON.stringify(prod).replace(/\\/g,"").replace(/"/g," ")});
    });
  });
}
