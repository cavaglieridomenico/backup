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


const fetch = require('node-fetch')
main()
async function main() {

    const appKey2 = "vtexappkey-bauknechtdeqa-DBJYUG"
    const appToken2 = "NQXUVIWCHKKBORNTYRIBOJXZTJGKTCVJBSZUCDDEHTULCRKRJKZXHDGWWYTEUNJTVVXFGQEUTKDKWFGUMJFDDPAMJKNRKMPNXSYANRXWSDFDGQRUXTBQNYEHYIASFZGG"
    const account2 = "bauknechtdeqa"


    const appKey = "vtexappkey-hotpointukqa-VZOBMM"
    const appToken = "RQDLMPKEFKDAFPOXVFFTEFGCKIVJWYTKSSWGDXLHJUONQTHUWFEMDVCMKBBDTAHHQTINSIUXTXJKQSLQBBNQUHGXQKWBWINJMHXWLTBNLGSGLRVRPKCSNRNJNKWHLSBL"
    const account = "hotpointukqa"

    const options = {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json",
            'X-VTEX-API-AppKey': appKey,
            'X-VTEX-API-AppToken': appToken,
            "REST-Range": "resources=0-1000"
        }
    }

    let res = await fetch(`https://${account}.myvtex.com/api/dataentities/BR/search?_fields=_all`, options)
    res = await res.json()


    const options2 = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "content-type": "application/json",
            'X-VTEX-API-AppKey': appKey2,
            'X-VTEX-API-AppToken': appToken2

        }
    }

    for (let index = 26; index < 30; index++) {
        //console.log("res ", res[index])

        let body = {

            bomId: res[index].bomId,
            categoryId: res[index].categoryId,
            categoryName: res[index].categoryName,
            familyGroup: res[index].familyGroup,
            fCode: res[index].fCode,
            industrialCode: res[index].industrialCode,
            modelNumber: res[index].modelNumber,
            originalModelNumber: res[index].originalModelNumber,
            referenceNumber: res[index].referenceNumber,
            sparePartId: res[index].sparePartId,
            spareSkuId: res[index].spareSkuId,
            twelveNc: res[index].twelveNc

        }

        

        options2.body = JSON.stringify(body);

        let res2 = await fetch(`https://${account2}.myvtex.com/api/dataentities/Bom_Relationship/documents?_schema=main`, options2)
        res2 = await res2.json()

        console.log("res2 ", JSON.stringify(res2, null, 2))
    }


}