const fetch = require('node-fetch')

const appKey = "vtexappkey-hotpointukqa-VZOBMM"
const appToken = "RQDLMPKEFKDAFPOXVFFTEFGCKIVJWYTKSSWGDXLHJUONQTHUWFEMDVCMKBBDTAHHQTINSIUXTXJKQSLQBBNQUHGXQKWBWINJMHXWLTBNLGSGLRVRPKCSNRNJNKWHLSBL"
const account = "hotpointukqa"

let options = {
    method: "DELETE",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    }
}

let options2 = {
    method: "POST",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    }
}

let body = require('./modelNumber_industrialCode_QA.json'); 

main()

async function main() {
    for(let i = 0; i<body.length; i++){
        try {
            options.body = JSON.stringify(body[i]);
            let deleteInternal = await fetch(`https://${account}.myvtex.com/bom-relationship/delete`, options);
            deleteInternal = await deleteInternal.json();
            console.log(deleteInternal);

            options2.body = options.body;
            let createInternal = await fetch(`https://${account}.myvtex.com/bom-relationship/create`, options2);
            createInternal = await createInternal.json();
            console.log(createInternal);
            
        } catch (error) {
            console.log(error);
        }
    }
}