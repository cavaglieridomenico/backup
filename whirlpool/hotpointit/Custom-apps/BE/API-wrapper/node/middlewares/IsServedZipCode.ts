//@ts-nocheck

import { isValid } from "../utils/functions";

export async function isServedZipCode(ctx: Context, next: () => Promise<any>) {
  if(isValid(ctx.query.skuId) && isValid(ctx.query.zip)){
    try{
      ctx.set('Cache-Control', 'no-store');
      let response = {data: "OK"};
      let constructionType = (await ctx.clients.vtexAPI.GetSKU(ctx.query.skuId))?.ProductSpecifications?.find(f => f.FieldName=="constructionType")?.FieldValues[0];
      if((constructionType+"").toLowerCase()=="built in"){
        let zipCodes = await ctx.clients.masterdata.searchDocuments({dataEntity: "ZI", fields: ["department","zipCodeFrom","zipCodeTo"],pagination:{page: 1, pageSize: 1000}});
        let found = false;
        for(let i=0; i<zipCodes.length && !found; i++){
          let from = parseInt(zipCodes[i].zipCodeFrom);
          let to = parseInt(zipCodes[i].zipCodeTo);
          let zip = parseInt(ctx.query.zip);
          if(zip>=from && zip<=to){
            found = true;
          }
        }
        if(!found){
          response = {data: "KO"};
        }
      }
      ctx.status = 200;
      ctx.body = response;
    }catch(err){
      //console.log(err);
      ctx.status = 500;
      ctx.body = "Internal Server Error";
    }
  }else{
    ctx.status = 400;
    ctx.body = "Bad Request";
  }
  await next()
}
