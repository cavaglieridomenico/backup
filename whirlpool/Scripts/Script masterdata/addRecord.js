const fetch = require('node-fetch')

const appKey = "vtexappkey-hotpointukqa-VZOBMM"
const appToken = "RQDLMPKEFKDAFPOXVFFTEFGCKIVJWYTKSSWGDXLHJUONQTHUWFEMDVCMKBBDTAHHQTINSIUXTXJKQSLQBBNQUHGXQKWBWINJMHXWLTBNLGSGLRVRPKCSNRNJNKWHLSBL"
const account = "hotpointukqa"

const acronym = "CV"

let options = {
    method: "POST",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    }
}

let body = [
];

main()

async function main() {
    body.forEach(async item => {
        options.body = JSON.stringify(item, 0, 4);
        console.log(options.body);
        let vtexResponse = await fetch(`https://${account}.vtexcommercestable.com.br/api/dataentities/${acronym}/documents`, options)
        vtexResponse = await vtexResponse.json()
        console.log(vtexResponse)
        
    })
}