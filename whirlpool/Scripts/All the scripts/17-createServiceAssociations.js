'use strict'

const API = require("../SendToAPI");
const serviceList = require("./serviceList.json");
const serviceValueList = require("./serviceValueList.json");
const BODLSkuIdToVtexSkuId = require("../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json");
const SkuXServices_partial = require("../catalogJsonFiles/SkuXServices_partial.json");
const SAPServices = require("../catalogJsonFiles/SAPServices.json");
const serviceMap = require("../catalogJsonFiles/serviceMap.json");
const CatalogGroupCatalogEntryRelationship = require("../catalogJsonFiles/CatalogGroupCatalogEntryRelationship.json");
const accessoryCategories = require("./accessoryCategories.json");

function createServiceAssociations(){
    API.start(200);
    SAPServices.forEach(r => {
        if(BODLSkuIdToVtexSkuId[r.sku]!=undefined){
            let s = serviceMap[r.ServiceCode.toLowerCase()];
            if(s!=undefined){
                let skuXService = {
                    SkuServiceTypeId: serviceList[s],
                    SkuServiceValueId: serviceValueList[s]["INCLUSO"],
                    SkuId: BODLSkuIdToVtexSkuId[r.sku],
                    Name: s,
                    Text: s,
                    IsActive: true
                }
                API.sendRequest('/api/catalog/pvt/skuservice/','POST', skuXService, null,null);
            }
        }
    });
    SkuXServices_partial.forEach(r2 => {
        if(BODLSkuIdToVtexSkuId[r2.sku]!=undefined){
            let serviceName = r2.ServiceId==50?"L'esperto per te":"Consulenza Telefonica per te";
            let skuXService = {
                SkuServiceTypeId: serviceList[serviceName],
                SkuServiceValueId: serviceValueList[serviceName]["INCLUSO"],
                SkuId: BODLSkuIdToVtexSkuId[r2.sku],
                Name: serviceName,
                Text: serviceName,
                IsActive: true
            }
            API.sendRequest('/api/catalog/pvt/skuservice/', 'POST', skuXService, null,null);
        }
    });
    API.stop();
}

function deleteServiceAssociations(){
    API.start(200);
    SAPServices.forEach(r => {
        if(BODLSkuIdToVtexSkuId[r.sku]!=undefined){
            API.sendRequest('/api/catalog_system/pvt/sku/stockkeepingunitbyid/'+BODLSkuIdToVtexSkuId[r.sku],'GET', null, response => {
                JSON.parse(response).Services.forEach(sr => {
                    if(sr.Name=="Installazione" || sr.Name=="Ritiro dell'usato contestuale alla consegna"){
                        API.sendRequest('/api/catalog/pvt/skuservice/'+sr.Id,'PUT', {Name: sr.Name, Text: sr.Name, IsActive: false}, response2 => {
                            let jsonData2 = JSON.parse(response2);
                            API.sendRequest('/api/catalog/pvt/skuservice/'+jsonData2.Id,'DELETE',null,null,null);
                        }, null);
                    }
                });
            },null);
        }
    });
    SkuXServices_partial.forEach(r => {
        if(BODLSkuIdToVtexSkuId[r.sku]!=undefined){
            API.sendRequest('/api/catalog_system/pvt/sku/stockkeepingunitbyid/'+BODLSkuIdToVtexSkuId[r.sku],'GET', null, response => {
                JSON.parse(response).Services.forEach(sr => {
                    if(sr.Name=="L'esperto per te" || sr.Name=="Consulenza Telefonica per te"){
                        API.sendRequest('/api/catalog/pvt/skuservice/'+sr.Id,'PUT', {Name: sr.Name, Text: sr.Name, IsActive: false}, response2 => {
                            let jsonData2 = JSON.parse(response2);
                            API.sendRequest('/api/catalog/pvt/skuservice/'+jsonData2.Id,'DELETE',null,null,null);
                        }, null);
                    }
                });
            },null);
        }
    });
    API.stop();
}

//deleteServiceAssociations();
createServiceAssociations();

