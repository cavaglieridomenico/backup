const fs = require('fs')
const API = require("../SendToAPI");
const idList = require("./records.json")


let deleteAll = (entity) => {
    API.start(10);
    let counter = 0;
    idList.forEach(i => {
        API.sendRequest("/api/dataentities/"+entity+"/documents/"+i.id, 'DELETE', null, ()=>{counter++});
    });
    API.stop(()=>{console.log(counter)});
}

deleteAll("AD");