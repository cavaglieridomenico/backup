const fetch = require('node-fetch')
const fs = require('fs')



const appKey = "vtexappkey-hotpointuk-PFCSOM"
const appToken = "ZFCPHJKYEKXKHTJZCHENPUNIJMXIYFFGYWYAADJDUSTJIJFSGROWIBGERUFUMBZYERMLUIYYYBSXBEZZHEBHRIXWQTJGYOQTSUERXUYYSPYHIIDNVFNIASGWUQVAYSAJ"
const account = "hotpointuk"



let options = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
}

main();
async function main(){


    let file = require('./jCode.json');

    let len = file.length;

    let sellableProducts = [];
    let count = 0;
    console.log(len);

    for(let index = 0;index<len;index++){

        let prodId = file[index]._SkuId;

        console.log("REFID -> " , prodId);
        


        //let ProdIDResponse = await fetch(`https://${account}.myvtex.com/api/catalog_system/pvt/products/productgetbyrefid/${refId}`, options);
        //ProdIDResponse = await ProdIDResponse.json();

        

        let productId = prodId;

        let ProdSpecsResponse = await fetch(`https://${account}.myvtex.com/api/catalog_system/pvt/sku/stockkeepingunitbyid/${productId}`, options);
        ProdSpecsResponse = await ProdSpecsResponse.json();

        

        ProdSpecsResponse.ProductSpecifications.forEach(field => {
            

            if(field.FieldName == "sellable"){
                if(field.FieldValues[0] == "true"){
                    console.log(" Yes, I'm working...")
                    let x = {
                        ProductId: productId
                    }
                    sellableProducts.push(x);
                    count++
                    
                }
            }
        });

        

        

    }
    console.log(count)
    fs.writeFileSync("./jCodeSELLABLE(FG).json", JSON.stringify(sellableProducts, null, 2))
    
}


