const fetch = require('node-fetch')

//Credentials

//BAUKNECHT DE (PROD)
/*
const appKey = "vtexappkey-bauknechtde-SEGOPN"
const appToken = "BVKFZBSTXIKBBXTRMUOMEVLXIGRNKDPBHOSUBORESXKXEPQPPPOPQMSQIGGYYGMPBTGULDMSUUESYRVJFFUXMQKIWIVWMCLWZXVQLMBXTWUWMNUKTJYNUIQMOMMHDYXX"
const account = "bauknechtde"
*/

//BAUKNECHT DE (QA)

const appKey = "vtexappkey-bauknechtde-SEGOPN"
const appToken = "BVKFZBSTXIKBBXTRMUOMEVLXIGRNKDPBHOSUBORESXKXEPQPPPOPQMSQIGGYYGMPBTGULDMSUUESYRVJFFUXMQKIWIVWMCLWZXVQLMBXTWUWMNUKTJYNUIQMOMMHDYXX"
const account = "bauknechtde"


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
    for (let c=164; c<=177; c++) {
        try {
            let responseGET = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${c}`, options);
            responseGET = await responseGET.json();
            let categoryName = responseGET.Name;

            //change parameters in category
            if (categoryName === "Ersatzteile") { // first level category
                responseGET.AdWordsRemarketingCode = `SC_BK_SP_${categoryName}`;
            }else{
                categoryName = categoryName.replaceAll(' ', "_");  
                let fatherCategoryId = responseGET.FatherCategoryId;
                let responseFatherCategoryGET = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${fatherCategoryId}`, options);
                let fatherResponseGET = await responseFatherCategoryGET.json();
                let fatherCategoryName = fatherResponseGET.Name;

                if(fatherCategoryName === "Ersatzteile"){ //second level category
                    responseGET.AdWordsRemarketingCode = `SC_BK_SP_${categoryName}`;
                }else{
                    switch (fatherCategoryName) { //third level category
                        case "Gefrierschraenke":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_GE_${categoryName}`;
                            break;
                        case "Geschirrspueler":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_GM_${categoryName}`;
                            break;
                        case "Dunstabzugshauben":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_DH_${categoryName}`;
                            break;
                        case "Herde":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_HE_${categoryName}`;
                            break;
                        case "Kaffeemaschinen":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_KM_${categoryName}`;
                            break;
                        case "Kochfelder":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_KO_${categoryName}`;
                            break; 
                        case "Kuehl-Gefrierkombinationen":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_KG_${categoryName}`;
                            break;  
                        case "Kuehlschraenke":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_KU_${categoryName}`;
                            break;  
                        case "Mikrowellen":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_MI_${categoryName}`;
                            break;  
                        case "Gefriergeraete":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_GS_${categoryName}`;
                            break; 
                        case "Backoefen":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_BO_${categoryName}`;
                            break;  
                        case "Sonstige":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_SO_${categoryName}`;
                            break;  
                        case "Trockner":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_TR_${categoryName}`;
                            break;
                        case "Waschmaschinen":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_WM_${categoryName}`;
                            break;
                        case "Waschtrockner":
                            responseGET.AdWordsRemarketingCode = `SC_BK_SP_WA_${categoryName}`;
                            break;
                        default:
                            break;
                    }
                }
            }
            

            options2.body = JSON.stringify(responseGET);
            let responsePUT = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${c}`, options2);
            responsePUT = await responsePUT.text();
            console.log(responsePUT);

        } catch (err) {
            console.log(err);
        }
    }
}
