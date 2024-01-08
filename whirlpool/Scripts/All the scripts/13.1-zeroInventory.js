
const API = require("../SendToAPI");
const skuIdMapping = require('../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json');

function uploadInventory(){
    API.start(200);
    for(let i=1;i<=Object.keys(skuIdMapping).length;i++){
        let inventory = {
            unlimitedQuantity: false,
            dateUtcOnBalanceSystem: null,
            quantity: 0
        }
        API.sendRequest("/api/logistics/pvt/inventory/skus/"+i+"/warehouses/1", "PUT", inventory, null, null);
        API.sendRequest("/api/logistics/pvt/inventory/skus/"+i+"/warehouses/2", "PUT", inventory, null, null);
    }
    API.stop();
}

uploadInventory();