'use strict'

const fs = require('fs');
const API = require("../SendToAPI");
const catalogEntry = require("../catalogJsonFiles/CatalogEntry.json");
const descriptiveAttribute = require("../catalogJsonFiles/DescriptiveAttribute.json");
const productIdMapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");
const skuIdMapping = require('../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json');

var delta = {};

function createSKUs(){
    API.start(200);
    catalogEntry.root.record.filter(r0 => r0.type=="ItemBean" && !r0.partnumber.includes("SERVICE"))?.forEach(p0 => {
        if(skuIdMapping[p0.partnumber]==undefined){
            let skuVideos = descriptiveAttribute.root.record.filter(r1 => r1.partnumber == p0.parentpartnumber && r1.groupname == "Video");
            let videoUrls=[];
            skuVideos?.forEach(video => {
                videoUrls.push("https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/"+video.image1.substr(3, video.image1.Length)+"/jsind9/WEBHD/"+video.image1);
            });
            //console.log(videoUrls);
            let sku = {
                ProductId: productIdMapping[p0.parentpartnumber],
                IsActive: false,
                Name: p0.partnumber,
                RefId: p0.partnumber,
                PackagedHeight: null,
                PackagedLength: null,
                PackagedWidth: null,
                PackagedWeightKg: null,
                Height: null,
                Length: null,
                Width: null,
                WeightKg: null,
                CubicWeight: null,
                IsKit: false,
                CreationDate: null,
                RewardValue: null,
                EstimatedDateArrival: null,
                ManufacturerCode: null,
                CommercialConditionId: 1,
                MeasurementUnit: null,
                UnitMultiplier: null,
                ModalType: null,
                KitItensSellApart: false,
                Videos: videoUrls
            };
            //console.log(sku);
            API.sendRequest('/api/catalog/pvt/stockkeepingunit', 'POST', sku, (responsedata, BODLSkuID) => {
                let jsonData=JSON.parse(responsedata);
                if(skuIdMapping[BODLSkuID]==undefined){
                    skuIdMapping[BODLSkuID]=jsonData.Id;
                }
                delta[BODLSkuID]=jsonData.Id;
            }, p0.partnumber);
        }
    });
    API.stop(()=>{
        fs.writeFileSync("./BODL2JsonMapping/BODLSkuIdToVtexSkuId.json", JSON.stringify(skuIdMapping, null, 2));
        fs.writeFileSync("./new/skuDelta.json", JSON.stringify(delta, null, 2));
    });
}

createSKUs();