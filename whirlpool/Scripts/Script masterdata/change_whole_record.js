const fetch = require('node-fetch')

const appKey = "vtexappkey-ruwhirlpoolqa-AIHWUB"
const appToken = "TIRFJIUDXGCJUZPCGOIOUUZOKQGEAOXOIVGWLRFORGCDBDTVPDRGMXDYJDVSBQCJINAYTTQOIUWORVMHXKOWXRCKRHMIWMMBDTVOCUBVMCXSBPHOQNVQBGMQLPHMHISW"
const account = "ruwhirlpoolqa"

const entity1 = "BM";
const entity2 = "BR";

let optionsGET = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
        "REST-Range":"resources=0-1000"
    }
};

let optionsPUT = {
    method: "PUT",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
    }
};

let body = [];

main();
async function main() {
    
        let wholeEntityBM = await fetch(`https://${account}.vtexcommercestable.com.br/api/dataentities/${entity1}/search?_where=bomId="9"&_fields=id`, optionsGET);
        vtexResponseBM = await wholeEntityBM.json();
        let id = vtexResponseBM[0].id;

        let wholeEntityBR = await fetch(`https://${account}.vtexcommercestable.com.br/api/dataentities/${entity2}/search?_where=bomId="9"&_fields=id`, optionsGET);
        vtexResponseBR = await wholeEntityBR.json();
        console.log(vtexResponseBR);
        let count = 1;
        optionsPUT.body = JSON.stringify({"bomId": id});
        console.log(optionsPUT.body);
        
        vtexResponseBR.forEach(async x => {
            let putResponse = await fetch(`https://${account}.vtexcommercestable.com.br/api/dataentities/${entity2}/documents/${x.id}`, optionsPUT);
            putResponse2 = await putResponse.json();
            //console.log("changed " + putResponse2 + count++);
        });
}