const apiClientBuilder = require("./common/SendToAPI");
const pageSize = 50;

let readAccountClient = apiClientBuilder.createApiClient(process.argv[2]);
let writeAccountClient = apiClientBuilder.createApiClient(process.argv[3]);

let imagesToWrite = [];

function readProducts(pageNumber = 1) {
    
    writeAccountClient.sendRequest(`/api/catalog_system/pvt/sku/stockkeepingunitids?page=${pageNumber}&pageSize=${pageSize}`, 'GET', null, (responsedata) => {
        let skuIds=JSON.parse(responsedata);

        skuIds.forEach(skuId => handleSKU(skuId));

        if (skuIds.length == pageSize ||skuIds.length == 0 ) {
            readProducts(pageNumber+1);
        }
    },  null);
}

function handleSKU(skuId) {

    console.log("handleSKU " + skuId);

    // get SKU from writeAccount
    writeAccountClient.sendRequest(`/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`, 'GET', null, (responsedata) => {
        let writeAccountSKU = JSON.parse(responsedata);

        // get Same sku from the readAccount
        // ASSUMPTIONS : the sku will have the same Id in both accounts
        readAccountClient.sendRequest(`/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`, 'GET', null, (responsedata) => {
            let readAccountSKU = JSON.parse(responsedata);

        /*
        search for image differences.
        - I want to find images in the read Account not present in the write one
        - diff will be done by name
        */

        writeAccountImagesNames = writeAccountSKU.Images.map(image => image.ImageName);
        let imageToUpload = 
            readAccountSKU.Images
                .filter(image => !writeAccountImagesNames.includes(image.ImageName) )
                .map(image => {
                    return {
                        ...image, 
                        skuId : skuId
                    }
                });

        imagesToWrite.push(...imageToUpload);
        
        readAccountClient.stop(uploadAllImages, 150000);

        },  null);

    },  null);
}


function uploadAllImages ( ) {
    console.log("I need to upload #images " + imagesToWrite.length)
    imagesToWrite.forEach(image => uploadImageForSku(image.skuId, image) );
    writeAccountClient.stop();
}

function uploadImageForSku(skuId, image) {    
    writeAccountClient.sendRequest(`/api/catalog/pvt/stockkeepingunit/${skuId}/file`, 'POST', {
      "Label": "",
      "Name": image.ImageName,
      "Text": null,
      "Url": image.ImageUrl,
      "Label": image.ImageName,
      "Text" : image.ImageName
    }, (responsedata) => {
        console.log(`Created image ${image.ImageName} for sku ${skuId}`)
    });
}

writeAccountClient.start();
readAccountClient.start();
readProducts();
