'use strict'

const fs = require('fs');
const API = require("../SendToAPI");

const depub = require("../catalogJsonFiles/SkuXServices_partial.json");
const pub = require("../catalogJsonFiles/pub.json");
const productIdMapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");

function updateProducts(){
    API.start(200);
    for(var s of Object.keys(productIdMapping)){
        if(depub.find(f => f.sku+"-WER"==s)!=undefined){
            API.sendRequest('/api/catalog/pvt/product/'+productIdMapping[s], 'GET', null, response => {
                let jsonData = JSON.parse(response);
                jsonData.IsVisible = true;
                API.sendRequest('/api/catalog/pvt/product/'+jsonData.Id, 'PUT', jsonData, null, null);
            }, null);
        }
    }
    API.stop();
}

function publish(){
    API.start(200);
    pub.forEach(s => {
        if(productIdMapping[s+"-WER"]!=undefined){
            API.sendRequest('/api/catalog/pvt/product/'+productIdMapping[s+"-WER"], 'GET', null, response => {
                let jsonData = JSON.parse(response);
                jsonData.IsVisible = true;
                API.sendRequest('/api/catalog/pvt/product/'+jsonData.Id, 'PUT', jsonData, null, null);
            }, null);
        }
    });
    API.stop();
}

//updateProducts();
publish();