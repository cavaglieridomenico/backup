const apiClientBuilder = require("./common/SendToAPI");
const specificationFileName = "SpecificationMapping.json";
const specificationValuesFileName = "SpecificationValuesMapping.json";

const fs = require('fs');



const readAccountName = process.argv[2];
const writeAccountName = process.argv[3]

let readClient = apiClientBuilder.createApiClient(readAccountName);
let writeClient = apiClientBuilder.createApiClient(writeAccountName);

let specificationMapping = readSpecifications();
let specificationValuesMapping = readSpecificationValues();


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


function getProductAndSkus(page=0, pageSize=50) {

    let from = page * pageSize;
    let to = ( (page+1) * pageSize) -1;

    writeClient.sendRequest(`/api/catalog_system/pvt/products/GetProductAndSkuIds?_from=${from}&_to=${to}`, 'GET', null,

    (responsedata) => {
        let responseSpec = JSON.parse(responsedata);
        let products = Object.keys(responseSpec.data);

        let skuids = products.reduce(
            (accumulator, prodId) => {
                accumulator.push(...responseSpec.data[prodId]);
                return accumulator;
            }, [])

       
        products.forEach(prodId => readProductSpecifications(prodId));
        skuids.forEach(skuId => readSkuSpecs(skuId));

        if(! products.length == 0) {
            getProductAndSkus(page+1, pageSize);
        }
        
    },  null);
}


function readProductSpecifications(productId) {
    readClient.sendRequest(`/api/catalog_system/pvt/products/${productId}/specification`, 'GET', null,
    (responsedata) => {
        let readAccountProductSpecs = JSON.parse(responsedata);

        let writeAccountProductSpecs = readAccountProductSpecs.map(spec => {
            let mapping = specificationMapping.find(specMapping => specMapping.fromAccountId == spec.Id);
            let writeAccountSpec = JSON.parse(JSON.stringify(spec));
            writeAccountSpec.Id = mapping?.toAccountId;
            
            return writeAccountSpec
        });

        createUpdateProductSpecification(productId, writeAccountProductSpecs);
    },  null);
}

function readSkuSpecs(skuId) {
    readClient.sendRequest(`/api/catalog/pvt/stockkeepingunit/${skuId}/specification`, 'GET', null,
    (responsedata) => {
        let readAccountProductSpecs = JSON.parse(responsedata);

        console.log(JSON.stringify(readAccountProductSpecs));

        let writeAccountSkuSpecs = readAccountProductSpecs.map(spec => {
            let specMapping = specificationMapping.find(sm => sm.fromAccountId == spec.FieldId);
            let specValueMapping = specificationValuesMapping.find(svm => spec.FieldValueId == svm.fromAccountId);

            let writeAccountSpecValue = JSON.parse(JSON.stringify(spec));
            writeAccountSpecValue.FieldId = specMapping?.toAccountId;
            writeAccountSpecValue.FieldValueId = specValueMapping?.toAccountId;
            return { 
                FieldId : specMapping?.toAccountId,
                FieldValueId : specValueMapping?.toAccountId
             }
        });
    
        writeAccountSkuSpecs.forEach(skuSpec => {
            createUpdateSkuSpecification(skuId, skuSpec);
        })

    },  null);
}


function createUpdateProductSpecification(productId, specs) {
    
    writeClient.sendRequest(`/api/catalog_system/pvt/products/${productId}/specification`, 'POST', specs,
    () => {},  null);
}

function createUpdateSkuSpecification(skuId, specs) {
    writeClient.sendRequest(`/api/catalog/pvt/stockkeepingunit/${skuId}/specification`, 'POST', specs,
    () => {},  null);
}



writeClient.start();
readClient.start();
getProductAndSkus()
readClient.stop();
writeClient.stop();
