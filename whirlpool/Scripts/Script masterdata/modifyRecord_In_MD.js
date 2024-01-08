const fetch = require('node-fetch')
const appKey = "vtexappkey-ruwhirlpoolqa-AIHWUB"
const appToken = "TIRFJIUDXGCJUZPCGOIOUUZOKQGEAOXOIVGWLRFORGCDBDTVPDRGMXDYJDVSBQCJINAYTTQOIUWORVMHXKOWXRCKRHMIWMMBDTVOCUBVMCXSBPHOQNVQBGMQLPHMHISW"
const account = "ruwhirlpoolqa"

const entity = "BR";
const jCode = "J00622948";
const whereCondition = 'sparePartId='+jCode;

let options = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
        "REST-Range": "resources=0-100"
    },
}
let options2 = {
    method: "POST",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    }
}

main()

async function main() {
    let vtexResponse = await fetch(`https://${account}.vtexcommercestable.com.br/api/dataentities/${entity}/search?`, options);
    vtexResponse = await vtexResponse.json();
    console.log(vtexResponse);
    //console.log(vtexResponse, count++);
    /*
    vtexResponse.forEach(async item => {
        options2.body = JSON.stringify(item);
        let mDsecondEntity = await fetch(`https://${account2}.vtexcommercestable.com.br/api/dataentities/${entity}/documents/`, options2);
        vtexResponse2 = await mDsecondEntity.json();
        console.log(vtexResponse2);
    })
    */
}