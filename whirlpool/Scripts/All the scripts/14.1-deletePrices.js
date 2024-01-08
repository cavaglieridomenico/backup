'use strict'

const API = require("../PricingAPI");
const skuIdMapping = require('../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json');

function deletePrices(){
    API.start(100);
    for(let i=1;i<=Object.keys(skuIdMapping).length;i++){
        API.sendRequest('/pricing/prices/'+i, 'DELETE', null, null, null);
    }
    API.stop();
}

deletePrices();