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

//Credentials
const appKey = "vtexappkey-hotpointuk-JMBRTX"
const appToken = "KNOXQAFTWCODGEXOIWITIOYHXEBWNQMVKNFRUPTZCTSCWYIQFIYSBHVEADSKXAGGIXDDPOWSBWYOABUSUGHLQLPVDCJSISGQLGAXGRTEIYPGXLCJIPVQAGZITEYIBFNW"
const account = "hotpointuk"

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



let bodyPUT = {
    /*
    Id: 0,
    Name: '',
    FatherCategoryId: 0,
    Title: '',
    Description: '',
    Keywords: '',
    IsActive: true,
    LomadeeCampaignCode: '',
    AdWordsRemarketingCode: '',
    ShowInStoreFront: false,
    ShowBrandFilter: false,
    ActiveStoreFrontLink: false,
    GlobalCategoryId: 0,
    StockKeepingUnitSelectionMode: '',
    Score: null,
    LinkId: '',
    HasChildren: true
    */
}

main();


async function main() {

    var count =0

    const globalCategoryId = 632

    //set the first and last index of meta data to modify
    const start_index = 65
    const final_index = 272

    console.log("  start index: ", start_index);
    console.log("  final index: ", final_index);

    
    
    for (let c = start_index; c <= final_index; c++) {
        try {
            let responseGET = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${c}`, options);
            vtexResponse = await responseGET.json();

            let responseFatherGET = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${vtexResponse.FatherCategoryId}`, options);
            vtexFatherResponse = await responseFatherGET.json();

            let fatherCategoryName = vtexFatherResponse.Name;

            console.log(" Father category name -> ", fatherCategoryName);

            //change body for the PUT call
            bodyPUT.Id = vtexResponse.Id;
            bodyPUT.Name = vtexResponse.Name;
            bodyPUT.FatherCategoryId = vtexResponse.FatherCategoryId;
            bodyPUT.Title = `Shop ${fatherCategoryName} ${vtexResponse.Name} Parts & Accessories - Hotpoint`;
            bodyPUT.Description = `Buy Hotpoint genuine ${fatherCategoryName} ${vtexResponse.Name} parts & accessories. Restore your appliance with our huge selection of parts. Next day delivery available.`;
            bodyPUT.Keywords = vtexResponse.Keywords;
            bodyPUT.IsActive = vtexResponse.IsActive;
            bodyPUT.LomadeeCampaignCode = vtexResponse.LomadeeCampaignCode;
            bodyPUT.AdWordsRemarketingCode = vtexResponse.AdWordsRemarketingCode;
            bodyPUT.ShowInStoreFront = vtexResponse.ShowInStoreFront;
            bodyPUT.ShowBrandFilter = vtexResponse.ShowBrandFilter;
            bodyPUT.ActiveStoreFrontLink = vtexResponse.ActiveStoreFrontLink;
            bodyPUT.GlobalCategoryId = globalCategoryId;
            bodyPUT.StockKeepingUnitSelectionMode = vtexResponse.StockKeepingUnitSelectionMode;
            bodyPUT.Score = vtexResponse.Score;
            bodyPUT.LinkId = vtexResponse.LinkId;
            bodyPUT.HasChildren = vtexResponse.HasChildren;

            //console.log(bodyPUT);
            options2.body = JSON.stringify(bodyPUT);
            let responsePUT = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category/${c}`, options2);
            responsePUT = await responsePUT.text();
            console.log(responsePUT);
            console.log(count);
            count++
        } catch (err) {
            console.log(err);
        }
        
    }
    
}
