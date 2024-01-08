'use strict'
const API = require("../SendToAPI");

function deleteDocument(){
    
    let entity = "AC";

    API.start(200);
    API.sendRequest('/api/dataentities/' + entity + '/search?_fields=_all', 'GET', null, (responsedata) => {
        let jsonData = JSON.parse(responsedata);
        jsonData.forEach(lucone => {
            API.sendRequest('/api/dataentities/' + entity + '/documents/' + lucone.id , 'DELETE', null, (jsonData) => {
            }, null);
            console.log("bella mo cancello tutto");
        });
    }, null);
    API.stop();
}
deleteDocument();