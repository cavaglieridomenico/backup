//@ts-nocheck

import CoBody = require("co-body");

export async function signUpForBlackFriday(ctx: Context, next: () => Promise<any>) {
  try{
    let req = await CoBody(ctx.req);
    let customer = (await ctx.clients.masterdata.searchDocuments({dataEntity: "CL", fields: ["email"], where:"email="+req.email, pagination:{page: 1, pageSize: 100}}))[0];
    if(customer!=undefined){
      ctx.body="Email already registered";
      ctx.status=409;
    }else{
      if(isValid(req.name) && isValid(req.surname) && isValid(req.email) && req.optin==true){
        await ctx.clients.masterdata.createDocument({dataEntity: "CL", fields: {email: req.email, firstName: req.name, lastName: req.surname, isNewsletterOptIn: true, campaign: "FORM_HP_BLACKFRIDAY"}});
        ctx.body="OK";
        ctx.status=200;
      }else{
        ctx.body="Bad Request";
        ctx.status=400;
      }
    }
  }catch(err){
    ctx.body="Internal Server Error";
    ctx.status=500;
  }
  await next();
}

export function isValid(field: string): Boolean{
  return field!=undefined && field!=null && field!="null" && field!="undefined" && field!=" " && field!="‎" && field!=!"-" && field!="_";
}
