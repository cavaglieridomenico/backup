const fs = require('fs')
const fetch = require('node-fetch')


const appKey = "vtexappkey-hotpointuk-PFCSOM"
const appToken = "ZFCPHJKYEKXKHTJZCHENPUNIJMXIYFFGYWYAADJDUSTJIJFSGROWIBGERUFUMBZYERMLUIYYYBSXBEZZHEBHRIXWQTJGYOQTSUERXUYYSPYHIIDNVFNIASGWUQVAYSAJ"
const account = "hotpointuk"



let options = {
    method: "POST",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    }
}   
    
let options2 = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    }
}



main()

async function main(){

    

    let nEInternal = [];
    let nEBR = [];
    let EInternal = [];
    let EBR = [];

    let file = require('./www-hotpoint-co-uk_01-11-2022_Pages_with_Duplicate_Titles_basic.json'); 

    const start = 7000;
    const end = 7953;

    console.log(" Starting check from " + start + " to " + end );
    console.log("len -> ", file.length)
    

    let count = 0
       
    for(let i = start; i<end; i++){

        console.log(" number -> ", i)

        let splitted = file[i].url.split("/");

        if(splitted[5]==undefined){
            console.log("problem");
        }else{

            let nowS = splitted[5].split("-")

        let body = {
            modelNumber: nowS[0],
            industrialCode: nowS[1]
        }

        
        console.log("body", body)
        
        count++
            
        
        try {

            options.body = JSON.stringify(body);
            let checkResponse = await fetch(`https://${account}.myvtex.com/bom-relationship/checkInternal`, options);
                
            checkResponse = await checkResponse.json();

            if(checkResponse.isExistent == false){

               console.log("Internal not existant!!");
               nEInternal.push(file[i]);


            }else{
                console.log("Internal existant!!");
                EInternal.push(file[i]);
            }

            
                
        } catch (error) {
            console.log(error);
        }

        try{
            let exResponse = await fetch(`https://${account}.myvtex.com/api/dataentities/BR/search?_fields=_all&_where=industrialCode = ${body.industrialCode} `, options2);
            exResponse = await exResponse.json()

            
            if(exResponse.length == 0){

                console.log(" Not present in BR !!");
                console.log(" ------------------------");
                nEBR.push(file[i]);
            }else{
                console.log(" Exsitant in BR !!");
                console.log(" ------------------------");
                EBR.push(file[i]);
            }


        }catch(error){
            console.log(error)
        }

        }
        

        
    }
   fs.writeFileSync("./npBR8.json", JSON.stringify(nEBR, null, 2));
   fs.writeFileSync("./pBR8.json", JSON.stringify(EBR, null, 2));
   fs.writeFileSync("./npINT8.json", JSON.stringify(nEInternal, null, 2));
   fs.writeFileSync("./pINT8.json", JSON.stringify(EInternal, null, 2));

}