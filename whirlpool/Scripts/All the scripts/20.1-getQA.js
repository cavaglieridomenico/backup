const API = require("../SendToAPI");
const fs = require('fs');

var list = [];

function get(){

    API.start(200);
    API.sendRequest('/api/dataentities/QA/search?_fields=id', 'GET', null, response => {
        let json = JSON.parse(response);
        json.forEach(e => {
            list.push(e.id);
        });
    },null);
    API.stop(()=>{fs.writeFileSync(__dirname+"/QAList.json", JSON.stringify(list, null, 2))});
}

get();