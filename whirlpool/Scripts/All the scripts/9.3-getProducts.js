'use strict'

const fs = require('fs');
const API = require("../SendToAPI");
const productIDmapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");

function getProducts(){
    API.start(200);
    let products = [];
    for(let i=1;i<=Object.keys(productIDmapping).length;i++){
        API.sendRequest('/api/catalog/pvt/product/'+i, 'GET', null, (responsedata) => {
            let jsonData=JSON.parse(responsedata);
            products.push(jsonData);
        }, null);
    }
    API.stop(()=>{fs.writeFileSync(__dirname+"/productList.json", JSON.stringify(products, null, 2))});
}

function getProducts2(){
    let products = {};
    API.start(200);
    for(let i=1;i<=Object.keys(productIDmapping).length;i++){
        API.sendRequest('/api/catalog/pvt/product/'+i, 'GET', null, (responsedata) => {
            let jsonData=JSON.parse(responsedata);
            products[jsonData.RefId]=jsonData.Id;
        }, null);
    }
    API.stop(()=>{fs.writeFileSync("./BODL2JsonMapping/BODLProductIdToVtexProductId.json", JSON.stringify(products, null, 2))});
}

getProducts();
//getProducts2();