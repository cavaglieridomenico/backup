
const { createDecipheriv } = require('crypto');
const fs = require('fs')
const fetch = require('node-fetch');
const { getSystemErrorMap } = require('util');

/*

PROD

const appKey = "vtexappkey-hotpointuk-PFCSOM"
const appToken = "ZFCPHJKYEKXKHTJZCHENPUNIJMXIYFFGYWYAADJDUSTJIJFSGROWIBGERUFUMBZYERMLUIYYYBSXBEZZHEBHRIXWQTJGYOQTSUERXUYYSPYHIIDNVFNIASGWUQVAYSAJ"
const account = "hotpointuk"

QA

const appKey = "vtexappkey-hotpointukqa-VZOBMM"
const appToken = "RQDLMPKEFKDAFPOXVFFTEFGCKIVJWYTKSSWGDXLHJUONQTHUWFEMDVCMKBBDTAHHQTINSIUXTXJKQSLQBBNQUHGXQKWBWINJMHXWLTBNLGSGLRVRPKCSNRNJNKWHLSBL"
const account = "hotpointukqa"

*/

main();

async function main(){

    let file = require("../hotpoint_uk_utils/script/exist.json")

    const acronym = "BR";

    const appKey = "vtexappkey-hotpointuk-PFCSOM"
    const appToken = "ZFCPHJKYEKXKHTJZCHENPUNIJMXIYFFGYWYAADJDUSTJIJFSGROWIBGERUFUMBZYERMLUIYYYBSXBEZZHEBHRIXWQTJGYOQTSUERXUYYSPYHIIDNVFNIASGWUQVAYSAJ"
    const account = "hotpointuk"

    let options = {
        method: "GET",
        headers: {
            "X-VTEX-API-AppKey": appKey,
            "X-VTEX-API-AppToken": appToken,
            "Content-Type": "application/json"
        }
    }

    let options2 = {
        method: "POST",
        headers: {
            "X-VTEX-API-AppKey": appKey,
            "X-VTEX-API-AppToken": appToken,
            "Content-Type": "application/json"
        }
    }
    let index =0;
    let len = file.length;
    let errorA = [];
    let created = [];

    while(index < len){

        let url = file[index].Address;

        let splitted = url.split("/");
        let mNiC = splitted[splitted.length - 1];

        
        let x = mNiC.split("-")

        let indCode = x[x.length - 1];
        
        
        console.log("industrialCode -> ", indCode)

        
        let checkResponse = await fetch(`https://${account}.myvtex.com/api/dataentities/${acronym}/search?_fields=_all&_where=industrialCode="${indCode}"`, options);
        checkResponse = await checkResponse.json()

        
        if(checkResponse.length == 0){

            
            console.log("not")
            count++;

            
    
        }else{

            let originalModelNumber = checkResponse[0].originalModelNumber;

            let body = {
                modelNumber: `${originalModelNumber}`,
                industrialCode: indCode
            }

            console.log("body ", body)
            
            options2.body = JSON.stringify(body);
            let createResponse = await fetch(`https://${account}.myvtex.com/bom-relationship/createInternal`, options2);
                
            createResponse = await createResponse.json();

            if(createResponse.name=="TypeError"){
                errorA.push(body);
            }else{
                created.push(file[index]);
                console.log("created");
            }


            
            
            console.log("exist -> ", createResponse);
        }
  
        index ++;
    }
    fs.writeFileSync("./error.json", JSON.stringify(errorA, null, 2));
    fs.writeFileSync("./created.json", JSON.stringify(created, null, 2));
}