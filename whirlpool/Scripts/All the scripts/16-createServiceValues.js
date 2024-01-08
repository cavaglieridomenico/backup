'use strict'

const fs = require('fs');
const API = require("../SendToAPI");
const serviceList = require("./serviceList.json");

var serviceValueIdMapping = {};

function createServiceValue(){
    API.start(200);
    let id = 1;
    for(var s of Object.keys(serviceList)){
        serviceValueIdMapping[s] = {};
        let serviceValue = {
            Id: id,
            SkuServiceTypeId: serviceList[s],
            Name: "INCLUSO",
            Value: 0,
            Cost: 0
        };
        let info = [];
        info.push(s);
        info.push(serviceValue.Name);
        API.sendRequest('/api/catalog/pvt/skuservicevalue', 'POST', serviceValue, (responsedata, info) => {
            let jsonData=JSON.parse(responsedata);
            serviceValueIdMapping[info[0]][info[1]]=jsonData.Id;
        },info);
        id++;
    }  
    API.stop(()=>{fs.writeFileSync(__dirname+"/serviceValueList.json", JSON.stringify(serviceValueIdMapping, null, 2))});
}

createServiceValue();