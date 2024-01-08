const fetch = require('node-fetch');

const account1 = "smartukb2c";
const appKey1 = "vtexappkey-smartukb2c-PKFYOF";
const appToken1 = "ETOPZEPPSZYYMIXLFIQWGDJNAVKLRACQDEZMJSAOGPCWPGHQSNDLJVFBJAPEUDYRWHUIJLBNHBQRANYTOTSDWRGIYXDIDWUCRLAHLYHHMQDHEOAVCVPBLVVEBMJLISJK";

const entity = "CV";

let options = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey1,
        "X-VTEX-API-AppToken": appToken1,
        "Content-Type": "application/json",
        "REST-Range":"resources=0-1000"
    }
};
let count = 1;
main();
async function main() {
    let mDFirstEntity = await fetch(`https://${account1}.vtexcommercestable.com.br/api/dataentities/${entity}/search?_fields=_all`, options);
    vtexResponse = await mDFirstEntity.json();
    vtexResponse.forEach(x => {
        count++
        console.log(x.id + " --- count = " + count);
    });
}