/**
 * This 
 */

const apiClientBuilder = require("./common/SendToAPI");


const specificationGroupFileName = "SpecificationGroupsMapping.json";
const specificationFileName = "SpecificationMapping.json";
const fs = require('fs');


const readAccountName = process.argv[2];
const writeAccountName = process.argv[3]

let readClient = apiClientBuilder.createApiClient(readAccountName);
let writeClient = apiClientBuilder.createApiClient(writeAccountName);


let groupsMapping = readSpecificationsGroups();
let specMapping = readUploadedSpecs();
let specifications = [];

function readFile(filePath, defaultIfNotFound = "") {
    return !fs.existsSync(filePath) ?  defaultIfNotFound : fs.readFileSync(filePath)
}

function readSpecificationsGroups() {
    let filePath = `./Migration/migration-files/${writeAccountName}/${specificationGroupFileName}`;
    return JSON.parse( readFile(filePath, "[]"));
}

function readUploadedSpecs () {
    let filePath = `./Migration/migration-files/${writeAccountName}/${specificationFileName}`;
    return JSON.parse( readFile(filePath, "[]"));
}

function readCategories() {
    readClient.sendRequest('/api/catalog_system/pub/category/tree/10', 'GET', null, (responsedata) => {
        let categoryTree=JSON.parse(responsedata);
        let categories = getCategories(categoryTree);
        categories.forEach(cat => getCategorySpec(cat.id));
    },  null);
}

function getCategorySpec(categoryId) {
    readClient.sendRequest(`/api/catalog_system/pub/specification/field/listTreeByCategoryId/${categoryId}`, 'GET', null, (responsedata) => {
        let categorySpecifications=JSON.parse(responsedata);

        let alreadyUploadedSpecIds = specMapping.map(sm => sm.fromAccountId);

        categorySpecifications
            .filter(categorySpec => !alreadyUploadedSpecIds.includes(categorySpec.FieldId))
            .forEach(categorySpec => retrieveSpecsDetails(categorySpec.FieldId));
    },  null);
}

function retrieveSpecsDetails(specId) {
    readClient.sendRequest(`/api/catalog/pvt/specification/${specId}`, 'GET', null, (responsedata) => {
        let specDetails =JSON.parse(responsedata);
        specifications.push(specDetails);
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

function createSpecification(specification) {

    let writeAccountSpecGroupId = groupsMapping
        .filter(group => specification.FieldGroupId == group.fromAccountId)
        .map(group => group.toAccountId)[0];

    writeClient.sendRequest('/api/catalog/pvt/specification', 'POST', 
    {
        "FieldTypeId": specification.FieldTypeId,
        "CategoryId": specification.CategoryId,
        "FieldGroupId": writeAccountSpecGroupId,
        "Name": specification.Name,
        "Description" : specification.Description,
        "Position": specification.Position,
        "IsFilter": specification.IsFilter,
        "IsRequired": specification.IsRequired,
        "IsOnProductDetails": specification.IsOnProductDetails,
        "IsStockKeepingUnit": specification.IsStockKeepingUnit,
        "IsActive": specification.IsActive,
        "IsTopMenuLinkActive": specification.IsTopMenuLinkActive,
        "IsSideMenuLinkActive": specification.IsSideMenuLinkActive,
        "DefaultValue": specification.DefaultValue
      }, 
    (responsedata) => {
        let responseSpec = JSON.parse(responsedata);
        specMapping.push({
            fromAccountId : specification.Id,
            toAccountId : responseSpec.Id,
            name : specification.Name,
            categoryId : specification.CategoryId,
            FieldTypeId: specification.FieldTypeId
        });
        writeMapping();
    },  null);
}


function uploadSpecifications() {
    writeClient.start();
    specifications = specifications.sort((spec1, spec2) => spec1.Id > spec2.Id)
    specifications.forEach(spec => createSpecification(spec));
    writeClient.stop(writeMapping);
}

function writeMapping() {

    let dirName = `./Migration/migration-files/${writeAccountName}/`;
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }

    fs.writeFile(dirName + '/SpecificationMapping.json', JSON.stringify(specMapping), err => {
        if (err) {
          console.error(err);
        }
      });
      
}

readClient.start();
// readCategories();
getCategorySpec(19);
readClient.stop(uploadSpecifications);

