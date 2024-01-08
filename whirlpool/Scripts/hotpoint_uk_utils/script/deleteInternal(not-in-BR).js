



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

    let file = require("./NE_3bom.json")

    const acronym = "BR";

    const appKey = "vtexappkey-hotpointuk-PFCSOM"
    const appToken = "ZFCPHJKYEKXKHTJZCHENPUNIJMXIYFFGYWYAADJDUSTJIJFSGROWIBGERUFUMBZYERMLUIYYYBSXBEZZHEBHRIXWQTJGYOQTSUERXUYYSPYHIIDNVFNIASGWUQVAYSAJ"
    const account = "hotpointuk"

    const fetch = require('node-fetch')

    let options = {
        method: "GET",
        headers: {
            "X-VTEX-API-AppKey": appKey,
            "X-VTEX-API-AppToken": appToken,
            "Content-Type": "application/json"
        }
    }

    let options2 = {
        method: "DELETE",
        headers: {
            "X-VTEX-API-AppKey": appKey,
            "X-VTEX-API-AppToken": appToken,
            "Content-Type": "application/json"
        }
    }

    console.log(file.length)

    let len = file.length;
    let index = 0;
    let count =0;

    while(index < len){

        let indCode = file[index].query.modelNumber
        let from = file[index].from;
        
        

        
        let checkResponse = await fetch(`https://${account}.myvtex.com/api/dataentities/${acronym}/search?_fields=_all&_where=modelNumber = ${indCode} `, options);
        checkResponse = await checkResponse.json()

        
        if(checkResponse.length == 0){

            console.log("not")
            count++;

            /*
            
            let body = {              
                from: `${from}`
            }

            console.log("from ", body.from)
    
            options2.body = JSON.stringify(body);
            let delResponse = await fetch(`https://${account}.myvtex.com/bom-relationship/deleteInternal`, options2);
                    
            delResponse = await delResponse.json();
    
            console.log("delresponse -> ", delResponse);
            */
            

        }
  
        index ++;
    }

    console.log("count -> ", count )

}