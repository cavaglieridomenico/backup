'use strict'

const API = require("../SendToAPI");
const fs = require('fs');
const bundleList = require("./bundleList.json");

function listBundle(){
    API.start(200);
    let items = [];
    API.sendRequest('/api/rnb/pvt/benefits/calculatorconfiguration', 'GET', null, responsedata => {
        let jsonData=JSON.parse(responsedata);
        items = jsonData.items;
    }, null);
    API.stop(()=>{fs.writeFileSync("./new/bundleList.json", JSON.stringify(items, null, 2))});    
}

function updateBundle(){
    API.start(200);
    bundleList.forEach(b => {
        if(b.name.includes("Gift")){
            API.sendRequest("/api/rnb/pvt/calculatorconfiguration/"+b.idCalculatorConfiguration, 'GET', null, responsedata => {
                let json=JSON.parse(responsedata);
                json.isActive = false;
                json.isArchived = true;
                API.sendRequest('/api/rnb/pvt/calculatorconfiguration/', 'POST', json, null, null);
            }, null);
        }
    });
    API.stop();
}

//listBundle();
updateBundle();