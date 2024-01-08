const fs = require("fs");

const groupnameList = require("./groupnameList.json");
const categoryXGroupXSpecification = require("./categoryXGroupXSpecification.json");
const categoryMapping = require('../BODL2JsonMapping/BODLCategoryIdToVtexCategoryId.json');
const API = require("../SendToAPI");
const specificationListFile = require("./specificationList.json");

var specificationsList = {};

function createSpecifications() {
    API.start(200);
    for (var c of Object.keys(categoryXGroupXSpecification)) {
        specificationsList[c]={};
        for(var g of Object.keys(categoryXGroupXSpecification[c])){
            specificationsList[c][g]={};
            if(g!="Sku specs"){
                categoryXGroupXSpecification[c][g]?.forEach(s => {
                    let desc= "";
                    let name="";
                    switch(g){
                        case "EnergyLogo":
                            desc=s;
                            name=s;
                            break;
                        case "Endeca":
                            desc=s;
                            name=s;
                            break;
                        case "RatingGroupAttrLogo":
                            desc="https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/"+s.description2+"/jsind9/std/1000x1000/"+s.description2+".jpg?fill=zoom&fillcolor=rgba:255,255,255&scalemode=product";
                            name=s.valueidentifier;
                            break;
                        case "Document":
                            desc=s;
                            name=s;
                            break;
                        case "Other":
                            desc=s;
                            name=s;
                            break;
                        case "CommercialCode":
                            desc=s;
                            name=s;
                            break;
                        default:
                            desc=s.usage;
                            name=s.valueidentifier
                            break;
                    }
                    let specification = {
                        FieldTypeId: 1,
                        CategoryId: categoryMapping[c],
                        FieldGroupId: groupnameList[c][g],
                        Name: name,
                        Description: desc,
                        IsFilter: g=="Endeca"?true:false,
                        IsRequired: false,
                        IsOnProductDetails: true,
                        IsStockKeepingUnit: false,
                        IsActive: true,
                        IsTopMenuLinkActive: false,
                        IsSideMenuLinkActive: false,
                        DefaultValue: null
                    }
                    //console.log(specification);
                    let params = [];
                    params.push(c);
                    params.push(g);
                    params.push(name);
                    API.sendRequest("/api/catalog/pvt/specification", "POST", specification, (responsedata, params2) => {
                        let jsonData=JSON.parse(responsedata);
                        specificationsList[params2[0]][params2[1]][params2[2]]=jsonData.Id;
                    }, params);
                });
            }else{
                for(var sp of Object.keys(categoryXGroupXSpecification[c][g])){
                    let specification = {
                        FieldTypeId: 5,
                        CategoryId: categoryMapping[c],
                        FieldGroupId: groupnameList[c][g],
                        Name: sp,
                        Description: sp,
                        IsFilter: false,
                        IsRequired: false,
                        IsOnProductDetails: true,
                        IsStockKeepingUnit: true,
                        IsActive: true,
                        IsTopMenuLinkActive: false,
                        IsSideMenuLinkActive: false,
                        DefaultValue: null
                    }
                    //console.log(specification);
                    let params = [];
                    params.push(c);
                    params.push(g);
                    params.push(sp);
                    API.sendRequest("/api/catalog/pvt/specification", "POST", specification, (responsedata, params2) => {
                        let jsonData=JSON.parse(responsedata);
                        if(specificationsList[params2[0]][params2[1]][params2[2]]==undefined){
                            specificationsList[params2[0]][params2[1]][params2[2]]={};
                        }
                        specificationsList[params2[0]][params2[1]][params2[2]]["key"]=jsonData.Id;
                        categoryXGroupXSpecification[params2[0]][params2[1]][params2[2]].forEach(v => {
                            let specificationvalue = {
                                FieldId:jsonData.Id,
                                Text:v,
                                Name:v,
                                IsActive:true,
                                position: 0
                            }
                            API.sendRequest("/api/catalog_system/pvt/specification/fieldValue", "POST", specificationvalue, (responsedata, parax) => {
                                let jsonData=JSON.parse(responsedata);
                                let ctg = parax[0][0];
                                let grp = parax[0][1];
                                let spcfctn = parax[0][2];
                                let value = parax[1];
                                specificationsList[ctg][grp][spcfctn][value]=jsonData.FieldValueId;
                            },[params2,v]);
                        });

                    }, params);
                }
            }
        }
    }
    API.stop(()=>{fs.writeFileSync(__dirname+"/specificationList.json", JSON.stringify(specificationsList, null, 2))});
}

createSpecifications();
