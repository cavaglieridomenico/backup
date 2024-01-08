import { CategoryAdvice } from "../typings/types";
import { isValid , isValidCategoryAdvice } from "../utils/functions";
import json = require("co-body");

export async function sendCategoryAdviceEmail(ctx: Context, next: () => Promise<any>){
  ctx.state.reqPayload = await json(ctx.req)

  try{
    //email field is already checked on previews middleware getUserInfo
    if(isValid(ctx.state.reqPayload.category) && isValid(ctx.state.reqPayload.firstName) && isValid(ctx.state.reqPayload.lastName) && isValidCategoryAdvice(ctx.state.reqPayload.category)){

      let payload: CategoryAdvice = {
        ContactKey: ctx.state.reqPayload.email,
        EventDefinitionKey: ctx.state.sfmcData?.categoryAdviceKey?.find( e => e.key?.toLowerCase() == ctx.state.appSettings.vtex.defaultLocale5C.toLowerCase())?.value || "",
        Data: {
          Email: ctx.state.reqPayload.email,
          Name: ctx.state.reqPayload.firstName,
          Surname: ctx.state.reqPayload.lastName,
          Category: ctx.state.reqPayload.category,
          DateAdded: new Date().toISOString()
        }
      }


      let res = await ctx.clients.SFMCRest.triggerEvent(payload, ctx.state.accessToken!);
      let msg = res.message!=undefined?res.message:"Advice sent";
      ctx.state.logger.info("[Category Advice] email sent --details: "+JSON.stringify(payload) + "response: " + msg)
      ctx.status = 200;
      ctx.body = "OK";

    } else {
      ctx.status = 400;
      ctx.body= "[Category Advice] Bad Request - some request parameters are not valid";
    }

    await next();

  } catch( err ) {
    let msg = err.message!=undefined?err.message:JSON.stringify(err);
    ctx.state.logger.error("[Category Advice] email sending failed --details: "+ msg )
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }

}

