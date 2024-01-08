'use strict'
const fs = require("fs");
const API = require("../SendToAPI");
var masterdata = {};

function createJsonDataFromEntityMD(){
    
    let entity = "AC";

    API.start(200);
    API.sendRequest('/api/dataentities/' + entity + '/search?_fields=categoryName,constructionType,content,isCheckbox,serviceName,video', 'GET', null, (responsedata) => {
        let jsonData = JSON.parse(responsedata);
        masterdata = jsonData
    }, null);
    API.stop(()=>{fs.writeFileSync("./data_Inside_Entity_in_MD.json", JSON.stringify(masterdata, null, 2))});
}
createJsonDataFromEntityMD();