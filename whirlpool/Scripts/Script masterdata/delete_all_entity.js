const fetch = require('node-fetch')


//Credential legend
/*
const appKey = "vtexappkey-bauknechtdeqa-KLZIXK";
const appToken = "QJAREHAZSAEJOFDREPCUPZSSYINVKMJQYSMJIHJWGUIJGGYUFSJRWMJFTURZFXWEXNUPPNCCAWMWCTYAZYILMYYAPPODXBVEJYIAQRYOFJXTXEZOCMLBSXUTEALHFZXJ";
const account = "bauknechtdeqa";
*/

const appKey = "vtexappkey-bauknechtde-RKASYV"
const appToken = "HNPJMLIDQMLBAATBCPCPLTQJNRAGTPACKWPORVXVBINVDHDZZIMGDGFVHFJEMALSOGCSXWAOJYVWNKTULLCOYKYWKOXMJOHCRKAXPTNHIBHRFOCXIFJZSHODRKIHFFHB"
const account = "bauknechtde"


const entity = "CV"

let options = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
        "REST-Range":"resources=0-1000"
    }
};

let options2 = {
    method: "DELETE",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
    }
};
let count = 1; 
main();



async function main() {
    try {
        let wholeEntity = await fetch(`https://${account}.vtexcommercestable.com.br/api/dataentities/${entity}/search?_fields=id`, options);
        vtexResponse = await wholeEntity.json();
        vtexResponse.forEach(async x => { 
            let deleteObject = await fetch(`https://${account}.vtexcommercestable.com.br/api/dataentities/${entity}/documents/${x.id}`, options2);
            response = await deleteObject.text();
            //console.log("deleted " + count++ + ": " + x.id);
        });
    } catch (error) {
        console.log(error);
    }
}
