const fetch = require('node-fetch')
const appKey = "vtexappkey-ruwhirlpoolqa-AIHWUB"
const appToken = "TIRFJIUDXGCJUZPCGOIOUUZOKQGEAOXOIVGWLRFORGCDBDTVPDRGMXDYJDVSBQCJINAYTTQOIUWORVMHXKOWXRCKRHMIWMMBDTVOCUBVMCXSBPHOQNVQBGMQLPHMHISW"
const account = "ruwhirlpoolqa"

let options = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
        "REST-Range": "resources=0-1000"
    },
}
let skuIds = [];
main()

let inventory = 0;
let skuId = "";

async function main() {
    for(var i = 0; i<skuIds.length; i++){
        let vtexResponse = await fetch(`https://${account}.myvtex.com/api/logistics/pvt/inventory/skus/${skuIds[i]}`, options);
        vtexResponse = await vtexResponse.json();
        skuId = vtexResponse.skuId
        vtexResponse.balance.forEach(x => {
            inventory += x.totalQuantity;
        });
        console.log(vtexResponse);
        //console.log(skuId + ";" + inventory);
    }
}