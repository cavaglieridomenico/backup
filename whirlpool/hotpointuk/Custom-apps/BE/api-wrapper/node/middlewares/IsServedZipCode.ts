export async function isServedZipCode(ctx: Context, next: () => Promise<any>) {
  const {
    vtex: { route: { params: {postalCodeInput} } }
  } = ctx;
  if(postalCodeInput === undefined){
    ctx.status = 400;
  }else{
    try{
      console.log("postalCode input = " + postalCodeInput);
      ctx.set('Cache-Control', 'no-store');
      let response = 
      {
        installation: true,
        data: ""
      };
      let postalCode:String = postalCodeInput.toString();
      
      //Transform postalcode from context and remove everything after the space
      if(postalCode.indexOf('%20') >= 0){ //percentage in between
        postalCode = postalCode.split("%")[0].toUpperCase(); 
        //console.log("postalCode con percentuale = " + postalCode);
      }else if(postalCode.indexOf(' ') >= 0){
        postalCode = postalCode.split(" ")[0].toUpperCase();// with space in between
        //console.log("postalCode con spazio = " + postalCode); 
      }else{
        postalCode = await filterPostalCodeUK(postalCode); // no space in between
        postalCode = postalCode.split(" ")[0].toUpperCase();
        //console.log("postalCode senza spazio iniziale ma con spazio aggiunto = " + postalCode);
      }
      //get postalcode with no installation from masterdata 
      let postalCodeMD:any =  await ctx.clients.masterdata.searchDocuments({dataEntity: "PC", fields: ["postalCode"],pagination:{page: 1, pageSize: 1000}});
      
      //flag
      let found = false;
      //console.log("postalcode ricercato: " + postalCode);
      
      for(let i=0; i<postalCodeMD.length && !found; i++){
        if(postalCode === postalCodeMD[i].postalCode){
          response.installation = false;
          response.data = "NO INSTALLATION";
          found = true;
        }
      }
      if(found === false){
        response.installation = true;
        response.data = "YES INSTALLATION";
      }
      ctx.status = 200;
      ctx.body = response;
    }catch(err){
      ctx.status = err.response?.status!=undefined?err.response?.status:500;
      ctx.body = err.response?.data!=undefined?err.response?.data:"Internal Server Error";
    }
    await next()
  }
}

export async function filterPostalCodeUK(postalCode:String){
  switch (postalCode.length) {
    case 7:{
      postalCode = postalCode.substring(0, 4) + ' ' + postalCode.substring(4);
        break;
    }
    case 6: {
      postalCode = postalCode.substring(0, 3) + ' ' + postalCode.substring(3);
        break;
    }
    case 5:{
      postalCode = postalCode.substring(0, 2) + ' ' + postalCode.substring(2);
        break;
    }
    default: {
        break;
    }
  }
  return postalCode;
}