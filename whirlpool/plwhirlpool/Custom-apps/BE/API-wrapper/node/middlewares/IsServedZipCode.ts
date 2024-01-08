//@ts-nocheck

export async function isServedZipCode(ctx: Context, next: () => Promise<any>) {
  ctx.query.zip = (ctx.query.zip+"").trim();
  if(isValid(ctx.query.skuId) && isValidZipCode(ctx.query.zip)){
    try{
      ctx.set('Cache-Control', 'no-store');
      let response = {hasInstallation: true, data: "OK"};
      let skuContext = await ctx.clients.vtexAPI.GetSKU(ctx.query.skuId);
      let constructionType = skuContext?.ProductSpecifications?.find(f => f.FieldName=="constructionType")?.FieldValues[0];
      let hasInstallation = skuContext?.Services.find(f => f.ServiceTypeId==1)!=undefined?true:false;
      response.hasInstallation=hasInstallation;
      if((constructionType+"").toLowerCase()=="built in"){
        let zipCodes = await ctx.clients.masterdata.searchDocuments({dataEntity: "ZI", fields: ["department","zipCodeFrom","zipCodeTo"],pagination:{page: 1, pageSize: 1000}});
        let found = false;
        for(let i=0; i<zipCodes.length && !found; i++){
          let from = zipCodes[i].zipCodeFrom;
          let to = zipCodes[i].zipCodeTo;
          let zip = ctx.query.zip;
          if(zip>=from && zip<=to){
            found = true;
          }
        }
        if(!found){
          response.data = "KO";
        }
      }
      ctx.status = 200;
      ctx.body = response;
    }catch(err){
      //console.log(err);
      ctx.status = err.response?.status!=undefined?err.response?.status:500;
      ctx.body = err.response?.data!=undefined?err.response?.data:"Internal Server Error";
    }
  }else{
    ctx.status = 400;
    ctx.body = "Bad Request";
  }
  await next()
}

function isValid(field: string): Boolean{
  return field!=undefined && field!=null && field!="null" && field!="" && field!="‎" && field!=!"-" && field!="_";
}

function isValidZipCode(field: string): Boolean{
  return isValid(field) && (field+"").length==5 && field>="01000" && field<="98999";
}
