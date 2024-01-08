const API = require("../SendToAPI");
const listSpecifications = require("./specificationList.json");
const fs = require("fs");
let objectSpecifications = [];

function modifySpecification() {
    let specificationIds = [];

    for (let marketingCode of Object.values(listSpecifications)) {
        /*
        if (marketingCode['Endeca'] !== undefined) {
            //console.log("Endeca: " + JSON.stringify(marketingCode['Endeca']));
            for (let specId of Object.values(marketingCode['Endeca'])) {
                //console.log("Endeca SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        */
        /*
        if (marketingCode['RatingGroupAttrLogo'] !== undefined) {
            //console.log("RatingGroupAttrLogo: " + JSON.stringify(marketingCode['RatingGroupAttrLogo']));
            for (let specId of Object.values(marketingCode['RatingGroupAttrLogo'])) {
                console.log("RatingGroupAttrLogo SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        */
        /*
        if (marketingCode['Other'] !== undefined) {
            console.log("Other: " + JSON.stringify(marketingCode['Other']));
            if (marketingCode['Other']['extendedWarranty'] !== undefined) {
                console.log("ExtendedWarranty: " + marketingCode['Other']['extendedWarranty']);
                specificationIds.push(marketingCode['Other']['extendedWarranty']);
            }
        }
        */
        
        if (marketingCode['Other'] !== undefined) {
            //console.log("Other: " + JSON.stringify(marketingCode['Other']));
            if (marketingCode['Other']['sellable'] !== undefined) {
                console.log("sellable: " + marketingCode['Other']['sellable']);
                specificationIds.push(marketingCode['Other']['sellable']);
            }
        }
        
    }
    /*
    API.start(200);
    specificationIds.forEach(specificationId => {
        API.sendRequest("/api/catalog/pvt/specification/" + specificationId, "GET", null, (response) => {
            jsonData = JSON.parse(response);
            objectSpecifications.push(jsonData);
        });
    })
    API.stop(()=>{
        fs.writeFileSync("./specificationListCustom.json", JSON.stringify(objectSpecifications, null, 2))});*/
}
modifySpecification();