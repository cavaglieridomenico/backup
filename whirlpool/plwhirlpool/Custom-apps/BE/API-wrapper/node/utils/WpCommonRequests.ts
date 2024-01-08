//@ts-nocheck

import { configs } from "../typings/configs";
import { WPCancelRequest } from "../typings/WPCancel/WPCancelRequest";
import { WPCancelResponse } from "../typings/WPCancel/WPCancelResponse";
import { WPInquiryRequest } from "../typings/WPInquiry/WPInquiryRequest";
import { WPInquiryResponse } from "../typings/WPInquiry/WPInquiryResponse";
import { BuildXML, ParseXML } from "./XMLhandler";

export const CancelPaymentReq = (ctx: Context, appSettings: configs, orderid: string) => {
  return new Promise<WPCancelResponse>((resolve, reject) => {
    let wprequest: WPCancelRequest = {
      paymentService: {
        $: {
          version: appSettings.wpVersion,
          merchantCode: appSettings.merchantCode
        },
        modify: {
          orderModification: {
            $: {
              orderCode: orderid
            },
            cancelOrRefund: ""
          }
        }
      }
    }
    ctx.clients.worldpayAPI.PaymentService(BuildXML(wprequest)).then(res => {
      let jsonRes = ParseXML<WPCancelResponse>(res)
      if (jsonRes && jsonRes.paymentService?.reply && jsonRes.paymentService?.reply[0].ok) {
        resolve(jsonRes)
      } else {
        reject(res)
      }
    }, err => {
      reject(err)
    })
  })
}
export const Inquiry = (ctx: Context, appSettings: configs, orderid: string) => {
  return new Promise<{jsonRes: WPInquiryResponse; xmlRes: string}>((resolve, reject) => {
    let inquiryReq: WPInquiryRequest = {
      paymentService: {
        $: {
          version: appSettings.wpVersion,
          merchantCode: appSettings.merchantCode
        },
        inquiry: {
          orderInquiry: {
            $: {
              orderCode: orderid,
            }
          }
        }
      }
    }
    ctx.clients.worldpayAPI.PaymentService(BuildXML(inquiryReq)).then(xmlRes => {
      let jsonRes = ParseXML<WPInquiryResponse>(xmlRes)
      if (jsonRes && jsonRes.paymentService.reply[0].orderStatus[0].payment && jsonRes.paymentService.reply[0].orderStatus[0].payment.length > 0) {
        resolve({
          jsonRes,
          xmlRes
        })
      } else {
        reject(xmlRes)
      }
    }, err => {
      reject(err)
    })
  })
}
