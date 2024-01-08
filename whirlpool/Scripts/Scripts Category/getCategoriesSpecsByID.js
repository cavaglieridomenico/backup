const fs = require('fs')
const fetch = require('node-fetch')

/*

Credential legend

{
HOTPOINT UK (PROD)

const appKey = "vtexappkey-hotpointuk-JMBRTX"
const appToken = "KNOXQAFTWCODGEXOIWITIOYHXEBWNQMVKNFRUPTZCTSCWYIQFIYSBHVEADSKXAGGIXDDPOWSBWYOABUSUGHLQLPVDCJSISGQLGAXGRTEIYPGXLCJIPVQAGZITEYIBFNW"
const account = "hotpointuk"
}

{
HOTPOINT UK (QA)

const appKey = "vtexappkey-hotpointukqa-VZOBMM"
const appToken = "RQDLMPKEFKDAFPOXVFFTEFGCKIVJWYTKSSWGDXLHJUONQTHUWFEMDVCMKBBDTAHHQTINSIUXTXJKQSLQBBNQUHGXQKWBWINJMHXWLTBNLGSGLRVRPKCSNRNJNKWHLSBL"
const account = "hotpointukqa"
}
*/

const appKey = "vtexappkey-hotpointukqa-VZOBMM"
const appToken = "RQDLMPKEFKDAFPOXVFFTEFGCKIVJWYTKSSWGDXLHJUONQTHUWFEMDVCMKBBDTAHHQTINSIUXTXJKQSLQBBNQUHGXQKWBWINJMHXWLTBNLGSGLRVRPKCSNRNJNKWHLSBL"
const account = "hotpointukqa"

let options = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    },
}

async function getId(){

    const start = 1
    const end = 400
    let catTree = []

    for(let i=start; i<=end; i++){

    try{

        let responseGET = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${i}`, options);
        vtexResponse = await responseGET.json();

        let responseFatherGET = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${vtexResponse.FatherCategoryId}`, options);
        vtexFatherResponse = await responseFatherGET.json();
        
        let cat = {

            catId: vtexResponse.Id,
            catName: vtexResponse.Name,
            catFName: vtexFatherResponse.Name

        }

        console.log("cat " , cat)

        catTree.push(cat)

        }catch(err){
            console.log(err)
        }
    }

    fs.writeFileSync("./qaCompleteTree.json", JSON.stringify(catTree, null, 2))

    return catTree

}

function main(){

    let catTree = getId();
}

main();