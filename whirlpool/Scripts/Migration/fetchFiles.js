const apiClientBuilder = require("./common/SendToAPI");
const pageSize = 15;

let readAccountClient = apiClientBuilder.createApiClient(process.argv[2]);


function readProducts(acronym = "AT", pageNumber=0) {

    
    readAccountClient.sendRequest(`/api/dataentities/${acronym}/search?_fields=_all`, 'GET', null, (responsedata) => {
        let masterDataResult = JSON.parse(responsedata);
        masterDataResult.forEach(el => {
            console.log(`${acronym},${el.file},https://${process.argv[2]}.myvtex.com/api/dataentities/${acronym}/documents/${el.id}/file/attachments/${encodeURIComponent(el.file)}`)
        });

        if (masterDataResult.length == pageSize) {
            readProducts(acronym, pageNumber+1);
        }

    },  null, true, {
        "REST-Range" : `resources=${pageSize*pageNumber}-${pageSize*(pageNumber+1)}`
    });
}

readAccountClient.start();
readProducts();
readAccountClient.stop();
