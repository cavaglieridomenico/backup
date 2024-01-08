const fetch = require('node-fetch')

//BAUKNECHT DE (PROD)

const appKey = "vtexappkey-bauknechtde-SEGOPN"
const appToken = "BVKFZBSTXIKBBXTRMUOMEVLXIGRNKDPBHOSUBORESXKXEPQPPPOPQMSQIGGYYGMPBTGULDMSUUESYRVJFFUXMQKIWIVWMCLWZXVQLMBXTWUWMNUKTJYNUIQMOMMHDYXX"
const account = "bauknechtde"


//BAUKNECHT DE (QA)

const appKeyQA = "vtexappkey-bauknechtdeqa-KLZIXK"
const appTokenQA = "QJAREHAZSAEJOFDREPCUPZSSYINVKMJQYSMJIHJWGUIJGGYUFSJRWMJFTURZFXWEXNUPPNCCAWMWCTYAZYILMYYAPPODXBVEJYIAQRYOFJXTXEZOCMLBSXUTEALHFZXJ"
const accountQA = "bauknechtdeqa"


let optionsGET = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKeyQA,
        "X-VTEX-API-AppToken": appTokenQA,
        "Content-Type": "application/json",
    },
}

let optionsPOST = {
    method: "POST",
    headers: {
        "X-VTEX-API-AppKey": appKeyPROD,
        "X-VTEX-API-AppToken": appTokenPROD,
        "Content-Type": "application/json",
        "Accept": "application/json"    
    },
}
let count = 0
let firstLevelcategoryPROD = 124;
let categoryLevels = 2;


let bodyPOST = {
    Name : "",
    Keywords: "",
    Title: "",
    Description: "",
    FatherCategoryId: firstLevelcategoryPROD,
    IsActive: false
}

main()

async function main() {
    let categoryTreeResponse = await fetch(`https://${accountQA}.myvtex.com/api/catalog_system/pub/category/tree/${categoryLevels}`, optionsGET);
    categoryContext = await categoryTreeResponse.json();
    categoryContext[1].children[11].children.forEach(async thirdLevel => {
        bodyPOST.Name = thirdLevel.name;
        bodyPOST.Keywords = thirdLevel.name;
        bodyPOST.Title = thirdLevel.Title;
        bodyPOST.Description = thirdLevel.MetaTagDescription;
        count++
        optionsPOST.body = JSON.stringify(bodyPOST);
        console.log("number = " + count);
        //console.log(bodyPOST);
        // let responsePOST = await fetch(`https://${accountPROD}.myvtex.com/api/catalog/pvt/category`, optionsPOST);  
        // responsePOST = await responsePOST.json();
        // console.log(responsePOST);
    });
    console.log(categoryContext[1].children[11].id);
    console.log("first level category PROD = " + firstLevelcategoryPROD);
}