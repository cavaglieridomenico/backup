'use strict'

const API = require("../SendToAPI");
const catalogEntry = require("../catalogJsonFiles/CatalogEntry.json");
const productIdMapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");

function associateTradePolicy(){
    API.start(200);
    catalogEntry.root.record.filter(r0 => r0.type=="ProductBean" && !r0.partnumber.includes("SERVICE"))?.forEach(p0 => {
        API.sendRequest('/api/catalog/pvt/product/'+productIdMapping[p0.partnumber]+'/salespolicy/1', 'POST', null, null, null);
    });
    API.stop();
}

associateTradePolicy();