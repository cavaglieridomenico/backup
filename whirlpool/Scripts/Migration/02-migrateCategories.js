const apiClientBuilder = require("./common/SendToAPI");



let readClient = apiClientBuilder.createApiClient(process.argv[2]);
let writeClient = apiClientBuilder.createApiClient(process.argv[3]);

function readCategories() {
    
    readClient.sendRequest('/api/catalog_system/pub/category/tree/10', 'GET', null, (responsedata) => {
        let categoryTree=JSON.parse(responsedata);
        let categories = getCategories(categoryTree);
        categories = categories.sort((cat1, cat2) => cat1.id < cat2.id);
        categories.forEach(cat => createCategory(cat));
    },  null);
    
}

function getCategories(categories, parentCategoryId = null) {
    if (categories.length == 0) return [];
    
    let levelCategories = categories.map(cat => { 
        return {
            "id" : cat.id,
            "name": cat.name,
            "url": cat.url,
            "Title": cat.Title,
            "MetaTagDescription": cat.MetaTagDescription,
            "FatherCategoryId" : parentCategoryId
        }
    });

    
    let subcategories =  categories.reduce((subcatList, category) => {
        return [...subcatList, ...getCategories(category.children, category.id )];
    }, new Array() )

    
    return [ ...levelCategories, ...subcategories]
}

function createCategory(category) {

    writeClient.sendRequest('/api/catalog/pvt/category', 'POST', 
    {
        "Id": category.id,
        "Name": category.name,
        "FatherCategoryId": category.FatherCategoryId,
        "Title": category.Title,
        "Description": category.MetaTagDescription ,
        "Keywords": "",
        "IsActive": true,
        "LomadeeCampaignCode": null,
        "AdWordsRemarketingCode": null,
        "ShowInStoreFront": true,
        "ShowBrandFilter": true,
        "ActiveStoreFrontLink": true,
        "GlobalCategoryId": null,
        "StockKeepingUnitSelectionMode": "SPECIFICATION",
        "Score": null
      }, 
    (responsedata) => {
        let jsonResponse = JSON.parse(responsedata);
        console.log(`Category ${jsonResponse.Name} created`)
    },  null);
}


readClient.start();
writeClient.start();
readCategories();
readClient.stop();
writeClient.stop();
