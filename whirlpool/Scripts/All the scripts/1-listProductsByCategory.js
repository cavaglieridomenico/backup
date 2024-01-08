const fs = require('fs')

const products = require('../catalogJsonFiles/CatalogGroupCatalogEntryRelationship.json');

var productXCategory={};

function listProductsByCategory(){
    products.root.record.filter(r => r.partnumber.includes("WER")).forEach(record => {
        if(productXCategory[record.catgroup_identifier]==undefined){
            productXCategory[record.catgroup_identifier]=[];
        }
        productXCategory[record.catgroup_identifier].push(record.partnumber);
    });
    fs.writeFileSync(__dirname+"/ProductXCategory.json", JSON.stringify(productXCategory, null, 2));
}

listProductsByCategory();
