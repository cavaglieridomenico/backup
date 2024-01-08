'use strict'

const fs = require('fs');
const API = require("../SendToAPI");
const BODLSkuIdToVtexSkuIdFile = require("../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json");

var skuIsActive = {};

function checkSkus(){
    API.start(200);
    for(var s of Object.keys(BODLSkuIdToVtexSkuIdFile)){
        API.sendRequest('/api/catalog/pvt/stockkeepingunit/'+BODLSkuIdToVtexSkuIdFile[s]+'/file', 'GET', null, (responsedata, info) => {
            let jsonData=JSON.parse(responsedata);
            if(jsonData.length>0)
                    skuIsActive[info]=true;
            else
                skuIsActive[info]=false;
        }, s);
    }
    API.stop(()=>{fs.writeFileSync(__dirname+"/skuIsActive.json", JSON.stringify(skuIsActive, null, 2))});
}

checkSkus();