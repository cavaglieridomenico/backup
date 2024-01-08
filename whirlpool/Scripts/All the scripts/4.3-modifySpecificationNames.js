const API = require("../SendToAPI");
const listSpecifications = require("./specificationListQA.json");

function modifySpecification() {
    let specificationIds = [];

    for (let marketingCode of Object.values(listSpecifications)) {
        
        /*
        if (marketingCode['Accessories'] !== undefined) {
            console.log("Accessories: " + JSON.stringify(marketingCode['Accessories']));
            for (let specId of Object.values(marketingCode['Accessories'])) {
                console.log("Accessories SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        
        if (marketingCode['CategoryDataCluster'] !== undefined) {
            console.log("CategoryDataCluster: " + JSON.stringify(marketingCode['CategoryDataCluster']));
            for (let specId of Object.values(marketingCode['CategoryDataCluster'])) {
                console.log("CategoryDataCluster SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        */
        /*
        if (marketingCode['Characteristics'] !== undefined) {
            console.log("Characteristics: " + JSON.stringify(marketingCode['Characteristics']));
            for (let specId of Object.values(marketingCode['Characteristics'])) {
                console.log("Characteristics SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        */
        /*
        if (marketingCode['Dimensions'] !== undefined) {
            console.log("Dimensions: " + JSON.stringify(marketingCode['Dimensions']));
            for (let specId of Object.values(marketingCode['Dimensions'])) {
                console.log("Dimensions SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        
        if (marketingCode['Document'] !== undefined) {
            console.log("Document: " + JSON.stringify(marketingCode['Document']));
            for (let specId of Object.values(marketingCode['Document'])) {
                console.log("Document SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        */
        if (marketingCode['Endeca'] !== undefined) {
            console.log("Endeca: " + JSON.stringify(marketingCode['Endeca']));
            for (let specId of Object.values(marketingCode['Endeca'])) {
                console.log("Endeca SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        /*
        if (marketingCode['EnergyLogo'] !== undefined) {
            console.log("EnergyLogo: " + JSON.stringify(marketingCode['EnergyLogo']));
            for (let specId of Object.values(marketingCode['EnergyLogo'])) {
                console.log("EnergyLogo SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        
        
        if (marketingCode['Performance'] !== undefined) {
            console.log("Performance: " + JSON.stringify(marketingCode['Performance']));
            for (let specId of Object.values(marketingCode['Performance'])) {
                console.log("Performance SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        
        
        if (marketingCode['Programs'] !== undefined) {
            console.log("Programs: " + JSON.stringify(marketingCode['Programs']));
            for (let specId of Object.values(marketingCode['Programs'])) {
                console.log("Programs SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        */
        /*
        if (marketingCode['RatingGroupAttrLogo'] !== undefined) {
            console.log("RatingGroupAttrLogo: " + JSON.stringify(marketingCode['RatingGroupAttrLogo']));
            for (let specId of Object.values(marketingCode['RatingGroupAttrLogo'])) {
                console.log("RatingGroupAttrLogo SpecId: " + specId);
                specificationIds.push(specId);
            }
        }
        */
        /*
        if (marketingCode['Structural features'] !== undefined) {
            console.log("Structural features: " + JSON.stringify(marketingCode['Structural features']));
            for (let specId of Object.values(marketingCode['Structural features'])) {
                console.log("Structural features SpecId: " + specId);
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
        /*
        if (marketingCode['Other'] !== undefined) {
            console.log("Other: " + JSON.stringify(marketingCode['Other']));
            if (marketingCode['Other']['stockavailability'] !== undefined) {
                console.log("StockAvailability: " + marketingCode['Other']['stockavailability']);
                specificationIds.push(marketingCode['Other']['stockavailability']);
            }
        }
        */
    }

    API.start(200);
    specificationIds.forEach(specificationId => {
        API.sendRequest("/api/catalog/pvt/specification/" + specificationId, "GET", null, (response) => {
            let jsonData = JSON.parse(response);
            console.log("Specification: " + JSON.stringify(response));
            //jsonData.Name = jsonData.Name.replace(":","").trim().concat(":");
            //jsonData.IsActive = false;
            //jsonData.IsFilter = true;
            //jsonData.DefaultValue = "false";
            API.sendRequest("/api/catalog/pvt/specification/" + specificationId, "PUT", jsonData, (response) => {
                console.log("Specification updated: " + JSON.stringify(response));
            });
        });
    })
    API.stop();
}

modifySpecification();