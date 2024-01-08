const API = require("../SendToAPI");
const BODLSkuIdToVtexSkuId = require('../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json');
const MerchandisingAssociation = require('../catalogJsonFiles/MerchandisingAssociation.json')
const catalogEntry = require('../catalogJsonFiles/CatalogEntry.json');
const delta = require('./productDelta.json');

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

function crossUpSelling(){
    API.start(200);
    MerchandisingAssociation.root.record.forEach(r => {
        if(contain(delta,r.partnumberfrom)){
            if(r.type == 'X-SELL' || r.type == 'UPSELL'){
                let partnumberfrom = catalogEntry.root.record.find(r1 => r1.parentpartnumber==r.partnumberfrom).partnumber;
                let partnumberto = catalogEntry.root.record.find(r1 => r1.parentpartnumber==r.partnumberto).partnumber;
                if(partnumberfrom != undefined && partnumberto != undefined){
                    let association =  {
                        ParentSkuId: BODLSkuIdToVtexSkuId[partnumberfrom],
                        SkuId: BODLSkuIdToVtexSkuId[partnumberto],
                        ComplementTypeId: r.type=="X-SELL"?5:2
                    };
                    API.sendRequest('/api/catalog/pvt/skucomplement', 'POST', association, null, null);
                }
            }else{
                if(r.type == 'ACCESSORY'){
                    let partnumberfrom = catalogEntry.root.record.find(r1 => r1.parentpartnumber==r.partnumberfrom).partnumber;
                    let partnumberto = catalogEntry.root.record.find(r1 => r1.partnumber==r.partnumberto).partnumber;
                    if(partnumberfrom != undefined && partnumberto != undefined){
                        let association =  {
                            ParentSkuId: BODLSkuIdToVtexSkuId[partnumberfrom],
                            SkuId: BODLSkuIdToVtexSkuId[partnumberto],
                            ComplementTypeId: 1
                        };
                        API.sendRequest('/api/catalog/pvt/skucomplement', 'POST', association, null, null);
                    }
                }
            }
        }
    });
    API.stop();
}

crossUpSelling();
