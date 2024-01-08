'use strict'

const API = require("../SendToAPI");
const skuXServicesList = require("./skuXServicesList.json");
const fs = require('fs');

function deleteServices(){
    API.start(100);
    for(var id of Object.keys(skuXServicesList)){
        skuXServicesList[id].forEach(r => {
            API.sendRequest('/api/catalog/pvt/skuservice/'+r,'DELETE', null, null, null);
        });
    }
    API.stop();
}
deleteServices();