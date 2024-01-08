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

{
BAUCKNECHT DE (QA)

const appKey = "vtexappkey-bauknechtdeqa-DBJYUG"
const appToken = "NQXUVIWCHKKBORNTYRIBOJXZTJGKTCVJBSZUCDDEHTULCRKRJKZXHDGWWYTEUNJTVVXFGQEUTKDKWFGUMJFDDPAMJKNRKMPNXSYANRXWSDFDGQRUXTBQNYEHYIASFZGG"
const account = "bauknechtdeqa"
}
*/

//Credentials
const appKey = "vtexappkey-bauknechtdeqa-DBJYUG"
const appToken = "NQXUVIWCHKKBORNTYRIBOJXZTJGKTCVJBSZUCDDEHTULCRKRJKZXHDGWWYTEUNJTVVXFGQEUTKDKWFGUMJFDDPAMJKNRKMPNXSYANRXWSDFDGQRUXTBQNYEHYIASFZGG"
const account = "bauknechtdeqa"

let options = {
    method: "POST",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    },
}


main();
async function main() {

    const id = null;
    const fatId = 54;
    const globalCategoryId = 3348;

    let category = [
        'Tueren',
        'Schubladen',
        'Trommel',
        'Elektronik',
        'Dichtungen',
        'Heizelemente',
        'Schlaeuche und Leitungen',
        'Drehregler',
        'Module und Platinen',
        'Motoren',
        'Sonstige',
        'Bedienfelder'
      ];
    for (let index = 0; index < category.length; index++) {

        let name = category[index];

        let body = {

            "Name": name,
            "FatherCategoryId": fatId,
            "Title": "",
            "Description": "",
            "Keywords": "",
            "IsActive": true,
            "LomadeeCampaignCode": null,
            "AdWordsRemarketingCode": null,
            "ShowInStoreFront": false,
            "ShowBrandFilter": false,
            "ActiveStoreFrontLink": false,
            "GlobalCategoryId": globalCategoryId,
            
            "Score": null
        }
        options.body = JSON.stringify(body);

        console.log(body);

        
        try {
            let responseGET = await fetch(`https://${account}.myvtex.com/api/catalog/pvt/category`, options);
            vtexResponse = await responseGET.json();

            console.log(vtexResponse);
        } catch (error) {
            console.log("Error -> ", error);
        }
        
    }



}
