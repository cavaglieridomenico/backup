const fetch = require('node-fetch')

//Credentials

//BAUKNECHT DE (PROD)
/*
const appKey = "vtexappkey-bauknechtde-SEGOPN"
const appToken = "BVKFZBSTXIKBBXTRMUOMEVLXIGRNKDPBHOSUBORESXKXEPQPPPOPQMSQIGGYYGMPBTGULDMSUUESYRVJFFUXMQKIWIVWMCLWZXVQLMBXTWUWMNUKTJYNUIQMOMMHDYXX"
const account = "bauknechtde"

*/
//BAUKNECHT DE (QA)

//const appKey = "vtexappkey-bauknechtdeqa-KLZIXK"
//const appToken = "QJAREHAZSAEJOFDREPCUPZSSYINVKMJQYSMJIHJWGUIJGGYUFSJRWMJFTURZFXWEXNUPPNCCAWMWCTYAZYILMYYAPPODXBVEJYIAQRYOFJXTXEZOCMLBSXUTEALHFZXJ"
//const account = "bauknechtdeqa"

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
    for (let c=42; c<=240; c++) {
        try {
            let responseGET = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${c}`, options);
            responseGET = await responseGET.json();

            let categoryName = responseGET.Name;
            let fatherCategoryId = responseGET.FatherCategoryId;
            let responseFatherCategoryGET = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${fatherCategoryId}`, options);
            let fatherResponseGET = await responseFatherCategoryGET.json();
            let fatherCategoryName = fatherResponseGET.Name;

            let title = "";
            let description = "";

            title = responseGET.Title.replace("Hauben", "Dunstabzugshauben");
            description = responseGET.Description.replace("Hauben", "Dunstabzugshauben");

            console.log("----------------------------------------------");
            console.log(" pre -> ", responseGET.Title);

            let Title =  responseGET.Title.toString()
            Title = Title.replace(" - Bauknecht", "")
            console.log("after -> ", Title)

            

        
            //change parameters in category
            if(categoryName === "Ersatzteile"){
                responseGET.Title = `Ersatzteile & Zubehör - Bauknecht`;
                responseGET.Description = `Kaufen Sie Original Bauknecht Ersatzteile & Zubehör für die Reparatur Ihres Haushaltsgerätes. Sie finden bei uns das volle Sortiment.`;
            }else{
                responseGET.Title = `${fatherCategoryName} ${categoryName} Teile & Zubehör - Bauknecht`;
                responseGET.Description = `${fatherCategoryName} ${categoryName} "Kaufen Sie Original Bauknecht Ersatzteile & Zubehör für die Reparatur Ihres Haushaltsgerätes. Sie finden bei uns das volle Sortiment.`;
            }
            
            options2.body = JSON.stringify(responseGET);
            let responsePUT = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${c}`, options2);
            responsePUT = await responsePUT.text();

            
            
        } catch (err) {
            console.log(err);
        }
    }
}
