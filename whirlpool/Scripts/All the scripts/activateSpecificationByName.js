/**
 * Usage
 *      node .\activateSpecificationByName.js <specName>
 * 
 * BEHAVIOUR:
 *      This script activates the specification with name = <specName> for each category in the catalog.
 *      The script only considers the first 10 category levels. 
 * 
 * CUSTOMIZATION : 
 *      In order to use it in your account, you need to change the SendToAPI.js script with the following params: 
 *      -   options.hostname needs to become <accountName>.vtexcommercestable.com.br 
 *      -   X-VTEX-API-AppKey needs to become the one specific for your account
 *      -   X-VTEX-API-AppToken needs to become the one specific for your account
 */


const API = require("../SendToAPI");

API.start(200);
API.sendRequest('/api/catalog_system/pub/category/tree/'+10, 'GET', null, (responsedata) => {
    let jsonData=JSON.parse(responsedata);
    jsonData.forEach(category => {
        activateCategorySpecs(category);
    });
}, null);
API.stop();

function activateCategorySpecs( categoryTreeElement ) {

    categoryTreeElement.children.forEach(element => {
        activateCategorySpecs(element);
    });

    API.sendRequest('/api/catalog_system/pub/specification/field/listByCategoryId/'+categoryTreeElement.id, 'GET', null, (responsedata) => {
        let jsonData=JSON.parse(responsedata);
        jsonData
            .filter(el => el.Name === process.argv[2])
            .filter(el => !el.IsActive)
            .every(spec => {
                API.sendRequest('/api/catalog/pvt/specification/' + spec.FieldId, 'GET', null, (responsedata) => {
                    let jsonData=JSON.parse(responsedata);
                    jsonData.IsActive =true;  

                    API.sendRequest('/api/catalog/pvt/specification/' + jsonData.Id, 'PUT', jsonData, (response) => {
                        console.log("PUT: " + JSON.stringify(response));
                    }, null);
                    
                }, null);
                return true;
            }); 
    }, null);


}