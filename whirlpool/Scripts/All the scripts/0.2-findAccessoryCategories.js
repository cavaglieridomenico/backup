const fs = require('fs');
const API = require("../SendToAPI");
const categoryList = require('../catalogJsonFiles/CatalogGroup.json');

var categories = [];

function find(){
    categoryList.root.record.forEach(r => {
        if(r.identifier=="SC_WP_Accessories" || r.identifier.includes("AC")){
            categories.push(r.identifier);
        }
    });
    fs.writeFileSync(__dirname+"/accessoryCategories.json", JSON.stringify(categories, null, 2));
}

find();