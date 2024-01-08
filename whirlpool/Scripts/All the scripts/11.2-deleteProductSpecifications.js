'use strict'

const API = require("../SendToAPI");
const productIDmapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");

function deleteProductSpecifications(){
    API.start(100);
    for(let i=1;i<=Object.keys(productIDmapping).length;i++){
        API.sendRequest('/api/catalog/pvt/product/'+i+'/specification', 'DELETE', null, null, null);
    }
    API.stop();
}

deleteProductSpecifications();