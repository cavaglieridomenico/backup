const fetch = require('node-fetch')

//Credentials

//BAUKNECHT DE (PROD)

const appKey = "vtexappkey-bauknechtde-SEGOPN"
const appToken = "BVKFZBSTXIKBBXTRMUOMEVLXIGRNKDPBHOSUBORESXKXEPQPPPOPQMSQIGGYYGMPBTGULDMSUUESYRVJFFUXMQKIWIVWMCLWZXVQLMBXTWUWMNUKTJYNUIQMOMMHDYXX"
const account = "bauknechtde"


//BAUKNECHT DE (QA)
/*
const appKey = "vtexappkey-bauknechtdeqa-KLZIXK"
const appToken = "QJAREHAZSAEJOFDREPCUPZSSYINVKMJQYSMJIHJWGUIJGGYUFSJRWMJFTURZFXWEXNUPPNCCAWMWCTYAZYILMYYAPPODXBVEJYIAQRYOFJXTXEZOCMLBSXUTEALHFZXJ"
const account = "bauknechtdeqa"
*/

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
//c = categoryId
async function main() {
    for (let c=41; c<=240; c++) {
        try {
            let responseGET = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${c}`, options);
            responseGET = await responseGET.json();

            //change parameters in category
            responseGET.IsActive = true;

            options2.body = JSON.stringify(responseGET);
            let responsePUT = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${c}`, options2);
            responsePUT = await responsePUT.text();
            console.log(responsePUT);

            
        } catch (err) {
            console.log(err);
        }
    }
}



//let AdWords = "SC_D2C_UK_SP_FRE_" + vtexResponse.Name;
            //AdWords = AdWords.replaceAll(' ', '')

            //vtexResponse.AdWordsRemarketingCode = AdWords;
/*
            if(vtexResponse.FatherCategoryId == 1 || vtexResponse.FatherCategoryId == 5 || vtexResponse.FatherCategoryId == 6 ||
                vtexResponse.FatherCategoryId == 9 || vtexResponse.FatherCategoryId == 10 || vtexResponse.FatherCategoryId == 3 ||
                vtexResponse.FatherCategoryId == 4 ||vtexResponse.FatherCategoryId == 8 ||vtexResponse.FatherCategoryId == 7){

                    console.log("--------------------------------------------------------------");
                    console.log(" CT name -> ", vtexResponse);
                    console.log("--------------------------------------------------------------");
                    vtexResponse.GlobalCategoryId = 604;
*/