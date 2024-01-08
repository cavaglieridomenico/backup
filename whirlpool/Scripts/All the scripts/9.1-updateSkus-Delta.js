'use strict'

const API = require("../SendToAPI");
const catalogEntry = require("../catalogJsonFiles/CatalogEntry.json");
const descriptiveAttribute = require("../catalogJsonFiles/DescriptiveAttribute.json");
const productIdMapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");
const BODLSkuIdToVtexSkuIdFile = require("../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json");
const skuIsActive = require("./skuIsActive.json");
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

function updateSKUs(){
    API.start(200);
    catalogEntry.root.record.filter(r0 => r0.type=="ItemBean" && !r0.partnumber.includes("SERVICE"))?.forEach(p0 => {
        if(contain(delta,p0.partnumber)){
            let skuVideos = descriptiveAttribute.root.record.filter(r1 => r1.partnumber == p0.parentpartnumber && r1.groupname == "Video");
            let videoUrls=[];
            skuVideos?.forEach(video => {
                videoUrls.push("https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/"+video.image1.substr(3, video.image1.Length)+"/jsind9/WEBHD/"+video.image1);
            });
            //console.log(videoUrls);
            let sku = {
                ProductId: productIdMapping[p0.parentpartnumber],
                IsActive: (skuIsActive[p0.partnumber] && p0.markfordelete==0)?true:false,
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
            API.sendRequest('/api/catalog/pvt/stockkeepingunit/'+BODLSkuIdToVtexSkuIdFile[p0.partnumber], 'PUT', sku, null,null);
        }
    });
    API.stop();
}

updateSKUs();