'use strict'

const fs = require('fs');
const API = require("../SendToAPI");
const skuIdMapping = require('../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json');

var products = {};

function getSKUs(){
    API.start(200);
    for(let i=1;i<=Object.keys(skuIdMapping).length;i++){
        API.sendRequest('/api/catalog/pvt/stockkeepingunit/'+i, 'GET', null, (responsedata) => {
            let jsonData=JSON.parse(responsedata);
            products[jsonData.RefId]=jsonData.Id;
        }, null);
    }
    API.stop(()=>{fs.writeFileSync(__dirname+"/../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json", JSON.stringify(products, null, 2))});
}

getSKUs();