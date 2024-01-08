'use strict'

const API = require("../SendToAPI");
const skuIdMapping = require('../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json');

function deleteProductSpecifications(){
    API.start(100);
    for(let i=1;i<=Object.keys(skuIdMapping).length;i++){
        API.sendRequest('/api/catalog/pvt/stockkeepingunit/'+i+'/specification', 'DELETE', null, null, null);
    }
    API.stop();
}

deleteProductSpecifications();