/**
 * This 
 */

const apiClientBuilder = require("./common/SendToAPI");
const fs = require('fs');

const readAccountName = process.argv[2];
const writeAccountName = process.argv[3]

let readClient = apiClientBuilder.createApiClient(readAccountName);
let writeClient = apiClientBuilder.createApiClient(writeAccountName);



let groups = [];
let groupMapping = [];


function readCategories() {
    readClient.sendRequest('/api/catalog_system/pub/category/tree/10', 'GET', null, (responsedata) => {
        let categoryTree=JSON.parse(responsedata);
        let categories = getCategories(categoryTree);
        categories.forEach(cat => getCategorySpecGroups(cat.id));
    },  null);
}

function getCategorySpecGroups(categoryId) {
    readClient.sendRequest(`/api/catalog_system/pvt/specification/groupbycategory/${categoryId}`, 'GET', null, (responsedata) => {
        let categoryGroups=JSON.parse(responsedata);
        groups.push(...filterCategoryGroups(categoryGroups, categoryId));
    },  null);
}

function filterCategoryGroups(categoryGroups, caregoryId) {
    return categoryGroups.filter( group => group.CategoryId == caregoryId )
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

function createGroup(specGroup) {
    writeClient.sendRequest('/api/catalog_system/pvt/specification/group', 'POST', 
    {
        "Id" : specGroup.Id,
        "CategoryId": specGroup.CategoryId,
        "Name": specGroup.Name,
        "Position" : specGroup.Position
      }, 
    (responsedata) => {
        let responseGroup = JSON.parse(responsedata);
        groupMapping.push({
            fromAccountId : specGroup.Id,
            toAccountId : responseGroup.Id,
            name : specGroup.Name,
            categoryId : specGroup.CategoryId
        })
    },  null);
}


function uploadGroups() {
    writeClient.start();
    groups = groups.sort((group1, group2) => group1.Id - group2.Id)
    groups.forEach(group => createGroup(group));
    writeClient.stop(writeMapping);
}

function writeMapping() {

    let dirName = `./Migration/migration-files/${writeAccountName}/`;
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }

    fs.writeFile(dirName + '/SpecificationGroupsMapping.json', JSON.stringify(groupMapping), err => {
        if (err) {
          console.error(err);
        }
      });
      
}

readClient.start();
readCategories();
readClient.stop(uploadGroups);

