const fetch = require('node-fetch');

//BAUKNECHT DE (PROD)

const appKey = "vtexappkey-bauknechtde-SEGOPN"
const appToken = "BVKFZBSTXIKBBXTRMUOMEVLXIGRNKDPBHOSUBORESXKXEPQPPPOPQMSQIGGYYGMPBTGULDMSUUESYRVJFFUXMQKIWIVWMCLWZXVQLMBXTWUWMNUKTJYNUIQMOMMHDYXX"
const account = "bauknechtde"


//BAUKNECHT DE (QA)

const appKeyQA = "vtexappkey-bauknechtdeqa-KLZIXK"
const appTokenQA = "QJAREHAZSAEJOFDREPCUPZSSYINVKMJQYSMJIHJWGUIJGGYUFSJRWMJFTURZFXWEXNUPPNCCAWMWCTYAZYILMYYAPPODXBVEJYIAQRYOFJXTXEZOCMLBSXUTEALHFZXJ"
const accountQA = "bauknechtdeqa"


const entity = "CV";

let options1 = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKeyQA,
        "X-VTEX-API-AppToken": appTokenQA,
        "Content-Type": "application/json",
        "REST-Range":"resources=0-1000"
    }
};

let options2 = {
    method: "POST",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    }
};
main();

async function main() {
    let mdFirstEntity = await fetch(`https://${accountQA}.vtexcommercestable.com.br/api/dataentities/${entity}/search?_fields=categoryId,videoUrl`, options1);
    mdFirstEntity = await mdFirstEntity.json();
    console.log(mdFirstEntity);
    
    mdFirstEntity.forEach(async item => {
        
        options2.body = JSON.stringify(item);
        console.log(options2.body);

        let mdSecondEntity = await fetch(`https://${account}.vtexcommercestable.com.br/api/dataentities/${entity}/documents/`, options2);
        mdSecondEntity = await mdSecondEntity.text();
        //console.log(vtexResponse2);
    })
}