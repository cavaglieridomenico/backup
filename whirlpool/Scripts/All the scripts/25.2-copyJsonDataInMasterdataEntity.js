'use strict'
const fs = require("fs");
const API = require("../SendToAPI");
const dataInEntity = require("./data_Inside_Entity_in_MD.json");

function createJsonDataFromEntityMD(){
    let entity = "AC";

    API.start(200);
    dataInEntity.forEach(salamino => {
        API.sendRequest('/api/dataentities/' + entity + '/documents' , 'POST', salamino, (response) => {
            console.log(JSON.parse(response));
        }, null);
    });
    API.stop();
}
createJsonDataFromEntityMD();