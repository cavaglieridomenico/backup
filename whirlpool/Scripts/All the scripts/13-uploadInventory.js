const skuIdMapping = require('../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json');
const productIDmapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");
const API = require("../SendToAPI");
const inventory = require('../catalogJsonFiles/Inventory.json');
const CatalogGroupCatalogEntryRelationship = require("../catalogJsonFiles/CatalogGroupCatalogEntryRelationship.json");
const specificationList = require("./specificationList.json");

function uploadInventory() {
    API.start(200);
    inventory.root.record.forEach(obj => {
        if (skuIdMapping[obj.partnumber] != undefined) {
            // API.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "GET", null, (response,obj) => {
            //   let jsonData = JSON.parse(response);
            // let minqtythrsd = jsonData.find(r1 => r1.Name=="minimumQuantityThreshold")?.Value[0];
            //   if(minqtythrsd!=undefined){
            let difference = parseInt(obj.qtyavailable);
            let inventory = {
                unlimitedQuantity: false,
                dateUtcOnBalanceSystem: null,
                quantity: difference > 0 ? difference : 0
            }
            let warehouseId = 1234567;
            console.log(inventory);
            console.log(skuIdMapping[obj.partnumber]);
            API.sendRequest("/api/logistics/pvt/inventory/skus/" + skuIdMapping[obj.partnumber] + "/warehouses/" + warehouseId, "PUT", inventory, null, null);
          /*  let cat = CatalogGroupCatalogEntryRelationship.root.record.find(r2 => r2.partnumber == obj.partnumber)?.catgroup_identifier;
            if (cat != undefined) {
                let availableId = specificationList[cat]["Other"]["available"];
               // let value = difference >= minqtythrsd ? "true" : "false";
                let specification = [
                    {
                        Value: [
                            value
                        ],
                        Id: availableId
                    }
                ]
                API.sendRequest("/api/catalog_system/pvt/products/" + productIDmapping[obj.partnumber + "-WER"] + "/specification", "POST", specification, null, null);
            }*/

      
}
    });
API.stop();
}

uploadInventory();