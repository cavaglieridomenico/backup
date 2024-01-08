const fs = require('fs');
const API = require("../SendToAPI");

var brandMap = {};

function create(){
    API.start(200);
    let brands=[];
    let brand0 = {
        Id: 2000000,
        Name: "Whirlpool",
        Text: "Whirlpool",
        Keywords: null,
        SiteTitle: "Whirlpool",
        Active: true,
        MenuHome: false,
        AdWordsRemarketingCode: "WP",
        LomadeeCampaignCode: null,
        Score: null,
        LinkId: "whirlpool"
    };
    let brand1 = {
        Id: 2000001,
        Name: "Indesit",
        Text: "Indesit",
        Keywords: null,
        SiteTitle: "Indesit",
        Active: true,
        MenuHome: false,
        AdWordsRemarketingCode: "ID",
        LomadeeCampaignCode: null,
        Score: null,
        LinkId: "indesit"
    };
    let brand2 = {
        Id: 2000002,
        Name: "Hotpoint Ariston",
        Text: "Hotpoint Ariston",
        Keywords: null,
        SiteTitle: "Hotpoint Ariston",
        Active: true,
        MenuHome: false,
        AdWordsRemarketingCode: "HP",
        LomadeeCampaignCode: null,
        Score: null,
        LinkId: "hotpoint-ariston"
    };
    let brand3 = {
        Id: 2000003,
        Name: "KitchenAid",
        Text: "KitchenAid",
        Keywords: null,
        SiteTitle: "KitchenAid",
        Active: true,
        MenuHome: false,
        AdWordsRemarketingCode: "KA",
        LomadeeCampaignCode: null,
        Score: null,
        LinkId: "kitchenaid"
    };
    //brands.push(brand0);
    //brands.push(brand1);
    brands.push(brand2);
    //brands.push(brand3);
    brands.forEach(b => {
        API.sendRequest("/api/catalog/pvt/brand", "POST", b, (response, brand) => {
            let res = JSON.parse(response);
            brandMap[brand]=res.Id;
        }, b.AdWordsRemarketingCode);
    });
    API.stop(()=>{fs.writeFileSync(__dirname+"/brandList.json", JSON.stringify(brandMap, null, 2));})
}

create();