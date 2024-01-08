//@ts-nocheck

import { resolve } from "dns";
import { reject } from "ramda";
import {enabledCredentials } from "../utils/constants";
import { isValid, json2Xml3YCheckup} from "../utils/mapper";
import { Checkup3Year} from "../typings/Checkup3Year";
import { CustomLogger } from "../utils/Logger";
import CoBody = require("co-body");
import { APP } from "@vtex/api";



/**
 * Called from product registration /assistenza/registrazione-prodotti (POST)
 * @param ctx form data
 * @param next
 */
export async function productRegistration3YCheckup(ctx: Context, next: () => Promise<any>){
  ctx.set('Cache-Control', 'no-store');
  ctx.vtex.logger = new CustomLogger(ctx);
  let credentials: [] = enabledCredentials[ctx.vtex.account];
    try{
      process.env.CRM = JSON.stringify(await ctx.clients.apps.getAppSettings(APP.ID));
      let payload: Checkup3Year = await CoBody(ctx.req);
      let response = await ctx.clients.CRM.save3YChekup(ctx, payload);
      ctx.res.setHeader("Content-Type","text/xml")
      ctx.body = response;
      ctx.status = 200;
      ctx.vtex.logger.info("Form checkup third year sent to CRM: OK -- data: "+JSON.stringify(response));
    }catch(err){
      //console.log(err)
      ctx.body = "Internal error";
      ctx.status = 500;
      ctx.vtex.logger.error("Form checkup third year sent to CRM: failed -- err: " + err);
    }
  await next();
}
