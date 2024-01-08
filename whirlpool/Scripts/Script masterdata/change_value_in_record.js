const fetch = require('node-fetch')

const appKey = "vtexappkey-ruwhirlpoolqa-AIHWUB"
const appToken = "TIRFJIUDXGCJUZPCGOIOUUZOKQGEAOXOIVGWLRFORGCDBDTVPDRGMXDYJDVSBQCJINAYTTQOIUWORVMHXKOWXRCKRHMIWMMBDTVOCUBVMCXSBPHOQNVQBGMQLPHMHISW"
const account = "ruwhirlpoolqa"

const entity = "BR";

let optionsGET = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
        "REST-Range":"resources=0-1000"
    }
};

let optionsPATCH = {
    method: "PATCH",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
    }
};

main();

async function main() {
    try {
        let getResponse = await fetch(`https://${account}.vtexcommercestable.com.br/api/dataentities/${entity}/search?_where=modelNumber="B20A1FVC/HA"&_fields=_all`, optionsGET);
        getResponse = await getResponse.json();
        console.log(getResponse);
        let count = 1;
        optionsPATCH.body = JSON.stringify({"originalModelNumber": "B 20 A1 FV C/HA"});
        console.log(optionsPATCH.body);

        getResponse.forEach(async x => {
            let patchResponse = await fetch(`https://${account}.vtexcommercestable.com.br/api/dataentities/${entity}/documents/${x.id}`, optionsPATCH);
            //patchResponse = await patchResponse.json();
            console.log(count++);
        })    
    } catch (error) {
        console.log(error);
    }
}