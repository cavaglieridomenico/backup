'use strict'

const API = require("../SendToAPI");
const catalogEntry = require("../catalogJsonFiles/CatalogEntry.json");
const descriptiveAttribute = require("../catalogJsonFiles/DescriptiveAttribute.json");
const BODLSkuIdToVtexSkuIdFile = require("../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json");
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

function createSKUFiles(){
    API.start(200);
    catalogEntry.root.record.filter(r0 => r0.type=="ItemBean" && !r0.partnumber.includes("SERVICE"))?.forEach(p0 => {
        if(contain(delta,p0.partnumber)){
            descriptiveAttribute.root.record.filter(r1 => r1.partnumber==p0.parentpartnumber && r1.groupname=="Gallery")?.forEach(r2 => {
                let isMain = false;
                if(r2.sequence==1){
                    isMain = true;
                }
                var imgId = r2.image1.split('|')[0];
                let skuFile = {
                    IsMain: isMain,
                    Label: r2.description,
                    Name: imgId,
                    Text: r2.alttag,
                    Url: "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/"+imgId+"/jsind9/std/1000x1000/"+imgId+".jpg?fill=zoom&fillcolor=rgba:255,255,255&scalemode=product"
                };
                API.sendRequest('/api/catalog/pvt/stockkeepingunit/'+BODLSkuIdToVtexSkuIdFile[p0.partnumber]+'/file', 'POST', skuFile, null, null);
            });
        }
    });
    API.stop();
}

createSKUFiles();