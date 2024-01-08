const API = require("../SendToAPI");
const QA = require("../catalogJsonFiles/QA.json")
const faq = require("../catalogJsonFiles/faq.json")

function generateUrl(linkid){
    linkid = linkid.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    linkid = linkid.replace(/\+/g,"plus");
    linkid = linkid.replace(/\[/g,"");
    linkid = linkid.replace(/\]/g,"");
    linkid = linkid.replace(/\//g,"");
    linkid = linkid.replace(/!/g,"");
    linkid = linkid.replace(/"/g,"");
    linkid = linkid.replace(/£/g,"");
    linkid = linkid.replace(/\$/g,"");
    linkid = linkid.replace(/%/g,"");
    linkid = linkid.replace(/&/g,"");
    linkid = linkid.replace(/\(/g,"");
    linkid = linkid.replace(/\)/g,"");
    linkid = linkid.replace(/=/g,"");
    linkid = linkid.replace(/'/g,"");
    linkid = linkid.replace(/\?/g,"");
    linkid = linkid.replace(/\^/g,"");
    linkid = linkid.replace(/\|/g,"");
    linkid = linkid.replace(/\{/g,"");
    linkid = linkid.replace(/\}/g,"");
    linkid = linkid.replace(/ç/gi,"");
    linkid = linkid.replace(/@/g,"");
    linkid = linkid.replace(/°/g,"");
    linkid = linkid.replace(/#/g,"");
    linkid = linkid.replace(/§/g,"");
    linkid = linkid.replace(/,/g,"");
    linkid = linkid.replace(/;/g,"");
    linkid = linkid.replace(/\./g,"");
    linkid = linkid.replace(/:/g,"");
    linkid = linkid.replace(/-/g,"");
    linkid = linkid.replace(/_/g,"");
    linkid = linkid.replace(/</g,"");
    linkid = linkid.replace(/>/g,"");
    linkid = linkid.replace(/  /g," ").replace(/ /g,"-");
    return linkid.toLowerCase();
}

function upload(){
    let size = QA.length/3;
    //console.log(size);
    API.start(200);
    for(let i=1;i<=size;i++){
        let rs = QA.filter(r => r.Id==i);
        let url = generateUrl(rs.find(r => r.Type=="Q")?.Description);
        let json = {
            questionGroup: rs.find(r => r.Type=="G")?.Description,
            question: rs.find(r => r.Type=="Q")?.Description,
            answer: rs.find(r => r.Type=="A")?.Description,
            pageUrl: url.length<=750?url:url.substring(0,750)
        }
        //console.log(json);
        API.sendRequest('/api/dataentities/QA/documents', 'POST', json, null, null);
    }
    API.stop();
}

function uploadFaq(){
    API.start(200);
    faq.forEach(r=>{
        let url = generateUrl(r.question);
        r["pageUrl"]=url.length<=750?url:url.substring(0,750);
        //console.log(r);
        API.sendRequest('/api/dataentities/QA/documents', 'POST', r, null, null);
    });
    API.stop();
}

//upload();
uploadFaq();