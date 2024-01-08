'use strict'

const API = require("../PricingAPI");
const fs = require('fs');
const skuIdMapping = require('../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json');
var prices = {};

function getPrices(){
    API.start(100);
    for(let i=1;i<=Object.keys(skuIdMapping).length;i++){
        API.sendRequest('/pricing/prices/'+i+'/fixed/'+1, 'GET', null, (response,id) => {
            let json = JSON.parse(response);
            prices[id]=json[0]?.value;
        }, i);
    }
    API.stop(()=>{fs.writeFileSync(__dirname+"/priceList.json", JSON.stringify(prices, null, 2));});
}

getPrices();