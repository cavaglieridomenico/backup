'use strict'
const API = require("../SendToAPI");

function updateSkus(){
    API.start(200);
    for(let i=0;i<=1103;i++){
        API.sendRequest('/api/catalog/pvt/stockkeepingunit/'+i, 'GET', null, (responsedata) => {
            let jsonData=JSON.parse(responsedata);
            console.log("GET: " + JSON.stringify(jsonData));
            if (jsonData.IsActive) {
                jsonData.IsActive = false;
                jsonData.ActivateIfPossible = false;
                API.sendRequest('/api/catalog/pvt/stockkeepingunit/' + jsonData.Id, 'PUT', jsonData, (response) => {
                    console.log("PUT: " + JSON.stringify(response));
                }, null);
            }
        }, null);
    }
    API.stop();
}

updateSkus();