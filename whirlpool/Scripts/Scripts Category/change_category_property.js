const fetch = require('node-fetch')

//Credentials
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
let options2 = {
    method: "PUT",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
}

main();

async function main() {
    for (let c=56; c<=58; c++) {
        try {
            //get specifications by categoryID
            let listSpecsCategory = await fetch(`https://${account}.myvtex.com/api/catalog_system/pub/specification/field/listByCategoryId/${c}`, options);
            listSpecsCategory = await listSpecsCategory.json();
            //console.log(JSON.stringify(listSpecsCategory, null, 4));
            //specification to change
            let specificationName = "stockavailability";

            listSpecsCategory.forEach(async x =>{
                if(x.Name == specificationName){
                    let specificationId = x.FieldId;
                    let getSpecificationData = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/specification/${specificationId}`, options);
                    getSpecificationData = await getSpecificationData.json();
                    //console.log(JSON.stringify(getSpecificationData, null, 4));
                    
                    //change a field in the specification
                    getSpecificationData["IsFilter"] = true;
                    
                    //set body for PUT
                    options2.body = JSON.stringify(getSpecificationData);
                    //console.log(options2.body);

                    let responsePUT = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/specification/${specificationId}`, options2);
                    responsePUT = await responsePUT.text();
                    console.log(responsePUT);
                }
                
            });
        } catch (err) {
            console.log(err);
        }
    }
}