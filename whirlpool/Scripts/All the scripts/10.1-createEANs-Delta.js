'use strict'

const API = require("../SendToAPI");
const bodlSkuIdToVtexSkuIdFile = require("../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json");
const catalogEntry = require("../catalogJsonFiles/CatalogEntry.json");
const delta = require('./skuDelta.json');

function contain(o,i){
    let found = false;
    for(var s of Object.keys(o)){
        if(s==i){
            found=true;
            break;
        }
    }
    return found;
}

function createEANs(){
    API.start(200);
    catalogEntry.root.record.filter(r0 => r0.type=="ItemBean" && !r0.partnumber.includes("SERVICE"))?.forEach(p0 => {
        if(contain(delta,p0.partnumber)){
            let product = catalogEntry.root.record.find(p1 => p1.partnumber==p0.parentpartnumber);
            API.sendRequest('/api/catalog/pvt/stockkeepingunit/'+bodlSkuIdToVtexSkuIdFile[p0.partnumber]+'/ean/'+product.mfpartnumber, 'POST', null, null,null);
        }
    });
    API.stop();
}

createEANs();