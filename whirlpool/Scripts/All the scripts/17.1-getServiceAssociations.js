'use strict'

const API = require("../SendToAPI");
const skuIdMapping = require('../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json');
const fs = require('fs');

var skuXServices = {};

function getServices(){
    API.start(200);
    for(let i=1;i<=Object.keys(skuIdMapping).length;i++){
        API.sendRequest('/api/catalog_system/pvt/sku/stockkeepingunitbyid/'+i,'GET', null, response => {
            let json = JSON.parse(response);
            skuXServices[json.Id]=[];
            json.Services.forEach(r => {
                skuXServices[json.Id].push(r.Id);
            });
        },null);
    }
    API.stop(()=>{fs.writeFileSync(__dirname+"/skuXServicesList.json", JSON.stringify(skuXServices, null, 2))});
}

getServices();