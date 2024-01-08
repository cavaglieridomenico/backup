
const apiClientBuilder = require("./common/SendToAPI");
const specificationFileName = "SpecificationMapping.json";
const specificationValuesFileName = "SpecificationValuesMapping.json";

const fs = require('fs');

const fidlTypesWithValues = [5, 6, 7];

const readAccountName = process.argv[2];
const writeAccountName = process.argv[3]

let readClient = apiClientBuilder.createApiClient(readAccountName);
let writeClient = apiClientBuilder.createApiClient(writeAccountName);

let specifications = readSpecifications();
let uploadedSpecificationValues = readSpecificationValues();
let specValuesToUpload = [];


function readFile(filePath, defaultIfNotFound = "") {
    return !fs.existsSync(filePath) ?  defaultIfNotFound : fs.readFileSync(filePath)
}

function readSpecifications () {
    let filePath = `./Migration/migration-files/${writeAccountName}/${specificationFileName}`;
    return JSON.parse( readFile(filePath, "[]"));
}
function readSpecificationValues () {
    let filePath = `./Migration/migration-files/${writeAccountName}/${specificationValuesFileName}`;
    return JSON.parse( readFile(filePath, "[]"));
}

function processSpecifications() {
    specifications
        .filter(spec =>  fidlTypesWithValues.includes(spec.FieldTypeId) )
        .forEach(spec => getValuesForSpec( spec ));
}


function getValuesForSpec( specificationMapping ) {
    readClient.sendRequest(`/api/catalog_system/pub/specification/fieldvalue/${specificationMapping.fromAccountId}`, 'GET', null, (responsedata) => {
        let specValues = JSON.parse(responsedata);
        let uploadedSpecValuesIds = uploadedSpecificationValues.map(specValue => specValue.fromAccountId);

        specValues
            .filter(specValue => ! uploadedSpecValuesIds.includes(specValue))
            .forEach(specValue => {
                specValuesToUpload.push({
                    ...specValue,
                    specificationId : specificationMapping.fromAccountId
                })
            });
    },  null);

}


function createSpecificationValue(specificationValue) {

    let writeAccountSpecId = specifications
        .filter(specMapping => specificationValue.specificationId == specMapping.fromAccountId)
        .map(specMapping => specMapping.toAccountId)[0];



    writeClient.sendRequest('/api/catalog/pvt/specificationvalue', 'POST', 
    {
        "FieldId": writeAccountSpecId,
        "Name": specificationValue.Value,
        "IsActive": specificationValue.IsActive,
        "Position": specificationValue.Position
      }, 
    (responsedata) => {
        let responseSpec = JSON.parse(responsedata);
            uploadedSpecificationValues.push({
            fromAccountId : specificationValue.FieldValueId,
            toAccountId : responseSpec.FieldValueId,
            name : specificationValue.Value
        })
    },  null);
}


function uploadSpecificationValues() {
    writeClient.start();
    specValuesToUpload.forEach(specValue => createSpecificationValue(specValue));
    writeClient.stop(writeMapping);
}

function writeMapping() {

    let dirName = `./Migration/migration-files/${writeAccountName}/`;
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }

    fs.writeFile(dirName + '/' + specificationValuesFileName, JSON.stringify(uploadedSpecificationValues), err => {
        if (err) {
          console.error(err);
        }
      });
      
}

readClient.start();
processSpecifications();
readClient.stop(uploadSpecificationValues);

