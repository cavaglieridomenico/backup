'use strict'

const API = require("../SendToAPI");
const productIDmapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");

function deleteServiceAssociations(){
    API.start(100);
    for(let i=1;i<=Object.keys(productIDmapping).length;i++){
        API.sendRequest('/api/catalog/pvt/product/'+i+'/salespolicy/1', 'DELETE', null, null, null);
    }
    API.stop();
}

deleteServiceAssociations();