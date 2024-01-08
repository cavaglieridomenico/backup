const API = require("../SendToAPI");
const qa = require("./QAList.json");

function deleteQA(){

    API.start(200);
    qa.forEach(id => {
        API.sendRequest('/api/dataentities/QA/documents/'+id, 'DELETE', null, null);
    });
    API.stop();
}

deleteQA();