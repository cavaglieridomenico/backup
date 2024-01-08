const apiClientBuilder = require("./common/SendToAPI");
const pageSize = 15;

let readAccountClient = apiClientBuilder.createApiClient(process.argv[2]);

let entities = [];

function readProducts(acronym = "AT", pageNumber=0) {

    
    readAccountClient.sendRequest(`/api/dataentities`, 'GET', null, (responsedata) => {
        let masterDataResult = JSON.parse(responsedata);
        masterDataResult.forEach(dataEntity => {
            readAccountClient.sendRequest(`/api/dataentities/${dataEntity.acronym}`, 'GET', null, (entityInfoResponse) => {
                let entityResponse = JSON.parse(entityInfoResponse);

                if (entityResponse.fields.filter(field => field.type === "File").length > 0) {
                    entities.push(`${dataEntity.acronym},${dataEntity.name},YES`)
                } else {
                    entities.push(`${dataEntity.acronym},${dataEntity.name},NO`)
                }
            }, null, true, {});
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
readAccountClient.stop(() => {
    entities.forEach(e => console.log(e));
});
