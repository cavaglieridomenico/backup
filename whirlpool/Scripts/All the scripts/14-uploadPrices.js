'use strict'

const API = require("../PricingAPI");
const API2 = require("../SendToAPI");

const priceListFile = require("../catalogJsonFiles/Price.json");
const skuIdMapping = require("../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json");
const productIDmapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");
const CatalogGroupCatalogEntryRelationship = require("../catalogJsonFiles/CatalogGroupCatalogEntryRelationship.json");
const specificationList= require("./specificationList.json");
const catalogEntry = require("../catalogJsonFiles/CatalogEntry.json");

function uploadPrices(){
    API.start(200);
    priceListFile.root.record.forEach(r =>{
        if(skuIdMapping[r.partnumber]!=undefined){
            let price = {
                markup: 0,
                basePrice: parseFloat(r.saleprice),
                fixedPrices: [
                    {
                        tradePolicyId: "1",
                        value: parseFloat(r.saleprice),
                        minQuantity: parseInt(r.minimumquantity),
                    }                
                ]
            }
            API.sendRequest('/pricing/prices/'+skuIdMapping[r.partnumber], 'PUT', price, null, null);
            
        }
    });
    API.stop();
}

function uploadSpecs(){
    API2.start(200);
    priceListFile.root.record.forEach(r =>{
        if(skuIdMapping[r.partnumber]!=undefined){
            let sellableMEP = catalogEntry.root.record.find(r1 => r1.partnumber==r.partnumber)?.buyable;
            if(sellableMEP!=undefined){
                sellableMEP = sellableMEP==1?"true":"false";
                let showPriceMEP = "true"; // fixed value bacause MEP doesn't send this data in the BDOL files.
                let sapPrice = r.saleprice;
                let published = r.published;
                let cat = CatalogGroupCatalogEntryRelationship.root.record.find(r2 => r2.partnumber==r.partnumber)?.catgroup_identifier;
                if(cat!=undefined){
                    if(sellableMEP=="true" && showPriceMEP=="true" && published==1){
                        let sellableSpec = [
                            {
                                Value: [
                                    "true"
                                ],
                                Id: specificationList[cat]["Other"]["sellable"]
                            }
                        ];
                        let showPriceSpec = [
                            {
                                Value: [
                                    "true"
                                ],
                                Id: specificationList[cat]["Other"]["showPrice"]
                            }
                        ];
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", sellableSpec, null, null);
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", showPriceSpec, null, null);
                    }
                    if(sellableMEP=="true" && showPriceMEP=="true" && published==0 && sapPrice!="9999" && sapPrice!="3000"){
                        let sellableSpec = [
                            {
                                Value: [
                                    "false"
                                ],
                                Id: specificationList[cat]["Other"]["sellable"]
                            }
                        ];
                        let showPriceSpec = [
                            {
                                Value: [
                                    "true"
                                ],
                                Id: specificationList[cat]["Other"]["showPrice"]
                            }
                        ];
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", sellableSpec, null, null);
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", showPriceSpec, null, null);
                    }
                    if(sellableMEP=="true" && showPriceMEP=="true" && published==0 && (sapPrice=="9999" || sapPrice=="3000")){
                        let sellableSpec = [
                            {
                                Value: [
                                    "false"
                                ],
                                Id: specificationList[cat]["Other"]["sellable"]
                            }
                        ];
                        let showPriceSpec = [
                            {
                                Value: [
                                    "false"
                                ],
                                Id: specificationList[cat]["Other"]["showPrice"]
                            }
                        ];
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", sellableSpec, null, null);
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", showPriceSpec, null, null);
                    }
                    if(sellableMEP=="false" && showPriceMEP=="true" && published==1){
                        let sellableSpec = [
                            {
                                Value: [
                                    "false"
                                ],
                                Id: specificationList[cat]["Other"]["sellable"]
                            }
                        ];
                        let showPriceSpec = [
                            {
                                Value: [
                                    "true"
                                ],
                                Id: specificationList[cat]["Other"]["showPrice"]
                            }
                        ];
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", sellableSpec, null, null);
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", showPriceSpec, null, null);
                    }
                    if(sellableMEP=="false" && showPriceMEP=="true" && published==0 && sapPrice!="9999" && sapPrice!="3000"){
                        let sellableSpec = [
                            {
                                Value: [
                                    "false"
                                ],
                                Id: specificationList[cat]["Other"]["sellable"]
                            }
                        ];
                        let showPriceSpec = [
                            {
                                Value: [
                                    "true"
                                ],
                                Id: specificationList[cat]["Other"]["showPrice"]
                            }
                        ];
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", sellableSpec, null, null);
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", showPriceSpec, null, null);
                    }
                    if(sellableMEP=="false" && showPriceMEP=="true" && published==0 && (sapPrice=="9999" || sapPrice=="3000")){
                        let sellableSpec = [
                            {
                                Value: [
                                    "false"
                                ],
                                Id: specificationList[cat]["Other"]["sellable"]
                            }
                        ];
                        let showPriceSpec = [
                            {
                                Value: [
                                    "false"
                                ],
                                Id: specificationList[cat]["Other"]["showPrice"]
                            }
                        ];
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", sellableSpec, null, null);
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", showPriceSpec, null, null);
                    }
                    if(sellableMEP=="false" && showPriceMEP=="false"){
                        let sellableSpec = [
                            {
                                Value: [
                                    "false"
                                ],
                                Id: specificationList[cat]["Other"]["sellable"]
                            }
                        ];
                        let showPriceSpec = [
                            {
                                Value: [
                                    "false"
                                ],
                                Id: specificationList[cat]["Other"]["showPrice"]
                            }
                        ];
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", sellableSpec, null, null);
                        API2.sendRequest("/api/catalog_system/pvt/products/"+productIDmapping[r.partnumber+"-WER"]+"/specification", "POST", showPriceSpec, null, null);
                    }
                }
            }
        }
    });
    API2.stop();
}

uploadPrices();
uploadSpecs();