const apiClientBuilder = require("./common/SendToAPI");

let readClient = apiClientBuilder.createApiClient(process.argv[2]);
let writeClient = apiClientBuilder.createApiClient(process.argv[3]);

function readBrands() {
    
    readClient.sendRequest('/api/catalog_system/pvt/brand/list', 'GET', null, (responsedata) => {
        let jsonData=JSON.parse(responsedata);
        jsonData.forEach(brand => {
            createBrand(brand);
        })
    },  null);
    
}

function createBrand(brand) {

    writeClient.sendRequest('/api/catalog/pvt/brand', 'POST', 
    {
        "Id": brand.id,
        "Name": brand.name,
        "Text": brand.name,
        "Keywords": "",
        "SiteTitle": brand.name,
        "Active": brand.isActive,
        "MenuHome": false,
        "AdWordsRemarketingCode": "",
        "LomadeeCampaignCode": "",
        "Score": null,
        "LinkId": null
      }, 
    (responsedata) => {
        let jsonResponse = JSON.parse(responsedata);
        console.log(`Brand ${jsonResponse.Name} created`)
    },  null);
}


readClient.start();
writeClient.start();
readBrands();
readClient.stop();
writeClient.stop();
