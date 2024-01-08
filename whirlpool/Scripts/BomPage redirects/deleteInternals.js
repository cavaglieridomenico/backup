const fetch = require('node-fetch')

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

    const appKey = "vtexappkey-hotpointuk-PFCSOM"
    const appToken = "ZFCPHJKYEKXKHTJZCHENPUNIJMXIYFFGYWYAADJDUSTJIJFSGROWIBGERUFUMBZYERMLUIYYYBSXBEZZHEBHRIXWQTJGYOQTSUERXUYYSPYHIIDNVFNIASGWUQVAYSAJ"
    const account = "hotpointuk"

    let options = {
        method: "DELETE",
        headers: {
            "X-VTEX-API-AppKey": appKey,
            "X-VTEX-API-AppToken": appToken,
            "Content-Type": "application/json"
        }
    }

    let file = require('../hotpoint_uk_utils/script/data.json'); 

    let len = file.length;

    for(let i=0; i<len; i++){

        let split = file[i].Address.split("/");
    
        let fromString = "/" + split[3] + "/" + split[4] + "/" + split[5];
        
        console.log("From to delete -> ", fromString);
        

        let body = {
            
            from: fromString
        }

        

        options.body = JSON.stringify(body);
        let checkResponse = await fetch(`https://${account}.myvtex.com/bom-relationship/deleteInternal`, options);
                
        checkResponse = await checkResponse.json();

        console.log("response -> ", checkResponse);

        

    }   
    

}