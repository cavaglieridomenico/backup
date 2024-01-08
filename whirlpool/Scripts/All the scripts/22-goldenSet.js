const BODLSkuIdToVtexSkuIdFile = require("../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json");
const goldenSet = require("../catalogJsonFiles/goldenSet.json");

function compair(){
    var skuList = [];
    for(var k of Object.keys(BODLSkuIdToVtexSkuIdFile)){
        skuList.push(k);
    }
    goldenSet.forEach(r => {
        if(!skuList.includes(r)){
            console.log(r);
        }
    });
}

compair();