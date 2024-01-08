'use strict'

const fs = require('fs');
const API = require("../SendToAPI");

var serviceIdMapping = {};

function createServices(){
    API.start(200);
    let services = [];
    let service0 = {
        Id: 1,
        Name: "Installazione",
        IsActive: true,
        ShowOnProductFront: true,
        ShowOnCartFront: true,
        ShowOnAttachmentFront: false,
        ShowOnFileUpload: false,
        IsGiftCard: false,
        IsRequired: false
    }
    /*let service1 = {
        Name: "Consegna al piano",
        IsActive: true,
        ShowOnProductFront: true,
        ShowOnCartFront: true,
        ShowOnAttachmentFront: false,
        ShowOnFileUpload: false,
        IsGiftCard: false,
        IsRequired: false
    }*/
    let service2 = {
        Id: 2,
        Name: "Ritiro dell'usato contestuale alla consegna",
        IsActive: true,
        ShowOnProductFront: true,
        ShowOnCartFront: true,
        ShowOnAttachmentFront: false,
        ShowOnFileUpload: false,
        IsGiftCard: false,
        IsRequired: false
    }
    let service3 = {
        Id: 3,
        Name: "L'esperto per te", // collaudo
        IsActive: true,
        ShowOnProductFront: true,
        ShowOnCartFront: true,
        ShowOnAttachmentFront: false,
        ShowOnFileUpload: false,
        IsGiftCard: false,
        IsRequired: false
    }
    let service4 = {
        Id: 4,
        Name: "Consulenza Telefonica per te", //call back
        IsActive: true,
        ShowOnProductFront: true,
        ShowOnCartFront: true,
        ShowOnAttachmentFront: false,
        ShowOnFileUpload: false,
        IsGiftCard: false,
        IsRequired: false
    }

    /*let service5 = {
        Name: "Extended warranty",
        IsActive: true,
        ShowOnProductFront: true,
        ShowOnCartFront: true,
        ShowOnAttachmentFront: false,
        ShowOnFileUpload: false,
        IsGiftCard: false,
        IsRequired: false
    }*/
    services.push(service0);
    //services.push(service1);
    services.push(service2);
    services.push(service3);
    services.push(service4);
    //services.push(service5);
    services.forEach(s => {
        API.sendRequest('/api/catalog/pvt/skuservicetype', 'POST', s, (responsedata, name) => {
            let jsonData=JSON.parse(responsedata);
            serviceIdMapping[name]=jsonData.Id;
        },s.Name);
    })
    API.stop(()=>{fs.writeFileSync(__dirname+"/serviceList.json", JSON.stringify(serviceIdMapping, null, 2))});
}

createServices();