const productXCategory = require("./ProductXCategory.json");
const specificationList= require("./specificationList.json");
const descriptiveAttribute = require("../catalogJsonFiles/DescriptiveAttribute.json");
const catalogEntry = require('../catalogJsonFiles/CatalogEntry.json');
const productType = require('../catalogJsonFiles/productType.json');
const catalogEntryDescription = require("../catalogJsonFiles/CatalogEntryDescription.json");
const productIDmapping = require("../BODL2JsonMapping/BODLProductIdToVtexProductId.json");
const skuIdMapping = require("../BODL2JsonMapping/BODLSkuIdToVtexSkuId.json");
const inventory = require('../catalogJsonFiles/Inventory.json');
const CatalogGroupCatalogEntryRelationship = require("../catalogJsonFiles/CatalogGroupCatalogEntryRelationship.json");
const accessoryCategories = require("./accessoryCategories.json");
const energyLabel = require("../catalogJsonFiles/energyLabel.json");
const priceListFile = require("../catalogJsonFiles/Price.json");
const definingAttributeValue = require("../catalogJsonFiles/definingAttributeValue.json");
const API = require("../SendToAPI");
const fs = require('fs');

var valuesArrays = {};

function findId(c,g,f){
  let ret = null;
  for(let field of Object.keys(specificationList[c][g])){
    if(field.toLowerCase()==f.toLowerCase()){
      ret = specificationList[c][g][field];
      break;
    }
  }
  return ret;
}

function normalize(name){
  name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  name = name.replace(/\+/g,"plus");
  name = name.replace(/\[/g,"");
  name = name.replace(/\]/g,"");
  name = name.replace(/\//g,"");
  name = name.replace(/!/g,"");
  name = name.replace(/"/g,"");
  name = name.replace(/£/g,"");
  name = name.replace(/\$/g,"");
  name = name.replace(/%/g,"");
  name = name.replace(/&/g,"");
  name = name.replace(/\(/g,"");
  name = name.replace(/\)/g,"");
  name = name.replace(/=/g,"");
  name = name.replace(/'/g,"");
  name = name.replace(/\?/g,"");
  name = name.replace(/\^/g,"");
  name = name.replace(/\|/g,"");
  name = name.replace(/\{/g,"");
  name = name.replace(/\}/g,"");
  name = name.replace(/ç/gi,"");
  name = name.replace(/@/g,"");
  name = name.replace(/°/g,"");
  name = name.replace(/#/g,"");
  name = name.replace(/§/g,"");
  name = name.replace(/,/g,"");
  name = name.replace(/;/g,"");
  name = name.replace(/\./g,"");
  name = name.replace(/:/g,"");
  name = name.replace(/-/g,"");
  name = name.replace(/_/g,"");
  name = name.replace(/</g,"");
  name = name.replace(/>/g,"");
  name = name.replace(/  /g," ").replace(/ /g,"-");
  return name;
}

function findColorId(c,g,s,v){
  let ret = null;
  for(let value of Object.keys(specificationList[c][g][s])){
    if(value.toLowerCase()==v.toLowerCase()){
      ret = specificationList[c][g][s][value];
      break;
    }
  }
  return ret;
}

function uploadProductSpecifications() {
    API.start(200);
    for(var c of Object.keys(productXCategory)){
        if(valuesArrays[c]==undefined){
          valuesArrays[c]={};
        }
        productXCategory[c].forEach(p => {
          if(valuesArrays[c][p]==undefined){
            valuesArrays[c][p]={};
          }
          descriptiveAttribute.root.record.filter(r0 => r0.partnumber==p)?.forEach(r1 => {
              let productSpecification = {};
              let params=[];
              params.push(c);
              params.push(p);
              switch(r1.groupname){
                  case "CompareFeature":
                      if(r1.valueidentifier!="" && r1.value!=""){
                        productSpecification.FieldId=specificationList[c][r1.description][r1.valueidentifier]?specificationList[c][r1.description][r1.valueidentifier]:findId(c,r1.description,r1.valueidentifier);
                        productSpecification.Text=r1.value;
                        if(valuesArrays[c][p][r1.description]==undefined){
                          valuesArrays[c][p][r1.description]={};
                        }
                        params.push(r1.description);
                        params.push(r1.valueidentifier);
                        API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r1.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
                          let jsonData = JSON.parse(response);
                          valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
                        }, params);
                      }
                    break;
                  case "RatingGroupAttrLogo":
                      if(r1.valueidentifier!="" && r1.noteinfo!=""){
                        productSpecification.FieldId=specificationList[c][r1.groupname][r1.valueidentifier]?specificationList[c][r1.groupname][r1.valueidentifier]:findId(c,r1.groupname,r1.valueidentifier);
                        productSpecification.Text=r1.noteinfo;
                        if(valuesArrays[c][p][r1.groupname]==undefined){
                          valuesArrays[c][p][r1.groupname]={};
                        }
                        params.push(r1.groupname);
                        params.push(r1.valueidentifier);
                        API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r1.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
                          let jsonData = JSON.parse(response);
                          valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
                        }, params);
                      }
                    break;
                  case "EnergyLogo":
                      if(r1.noteinfo!=""){
                        productSpecification.FieldId=specificationList[c][r1.groupname][r1.groupname+"_description"]?specificationList[c][r1.groupname][r1.groupname+"_description"]:findId(c,r1.groupname,r1.groupname+"_description");
                        productSpecification.Text=r1.noteinfo;
                        if(valuesArrays[c][p][r1.groupname]==undefined){
                          valuesArrays[c][p][r1.groupname]={};
                        }
                        params.push(r1.groupname);
                        params.push(r1.groupname+"_description");
                        API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r1.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
                          let jsonData = JSON.parse(response);
                          valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
                        }, params);
                      }
                      if(r1.description2!=""){
                        productSpecification = {};
                        productSpecification.FieldId=specificationList[c][r1.groupname][r1.groupname+"_image"]?specificationList[c][r1.groupname][r1.groupname+"_image"]:findId(c,r1.groupname,r1.groupname+"_image");
                        productSpecification.Text=energyLabel[r1.description2];
                        if(valuesArrays[c][p][r1.groupname]==undefined){
                          valuesArrays[c][p][r1.groupname]={};
                        }
                        API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r1.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
                          let jsonData = JSON.parse(response);
                          valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
                        }, [c,p,r1.groupname,r1.groupname+"_image"]);
                      }
                    break;
                  case "Endeca":
                      if(r1.description!="" && r1.value!=""){
                        if(r1.description.toLowerCase()!="funzioni speciali"){
                          productSpecification.FieldId=specificationList[c][r1.groupname][r1.description]?specificationList[c][r1.groupname][r1.description]:findId(c.r1.groupname,r1.description);
                          productSpecification.Text=r1.value;
                          if(valuesArrays[c][p][r1.groupname]==undefined){
                            valuesArrays[c][p][r1.groupname]={};
                          }
                          params.push(r1.groupname);
                          params.push(r1.description);
                          API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r1.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
                            let jsonData = JSON.parse(response);
                            valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
                          }, params);
                        }
                      }
                    break;
                  case "CategoryDataCluster":
                      if(r1.valueidentifier!="" && r1.value!=""){
                        productSpecification.FieldId=specificationList[c][r1.groupname][r1.valueidentifier]?specificationList[c][r1.groupname][r1.valueidentifier]:findId(c,r1.groupname,r1.valueidentifier);
                        productSpecification.Text=r1.value;
                        if(valuesArrays[c][p][r1.groupname]==undefined){
                          valuesArrays[c][p][r1.groupname]={};
                        }
                        params.push(r1.groupname);
                        params.push(r1.valueidentifier);
                        API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r1.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
                          let jsonData = JSON.parse(response);
                          valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
                        }, params);
                      }
                    break;
                  case "Document":
                      if(r1.valueidentifier!="" && r1.value!=""){
                        productSpecification.FieldId=specificationList[c][r1.groupname][normalize(r1.name.toLowerCase())]?specificationList[c][r1.groupname][normalize(r1.name.toLowerCase())]:findId(c,r1.groupname,normalize(r1.name.toLowerCase()));
                        productSpecification.Text="https://whirlpool-cdn.thron.com/delivery/public/document/whirlpool/"+r1.value+"/jsind9/WEB/doc.pdf";
                        if(valuesArrays[c][p][r1.groupname]==undefined){
                          valuesArrays[c][p][r1.groupname]={};
                        }
                        params.push(r1.groupname);
                        params.push(r1.valueidentifier);
                        API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r1.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
                          let jsonData = JSON.parse(response);
                          valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
                        }, params);
                      }
                    break;
              }
          });
          let r3 = catalogEntry.root.record.find(r2 => r2.partnumber==p);

          let productSpecification = {};
          productSpecification.FieldId=specificationList[c]["CommercialCode"]["CommercialCode_field"];
          productSpecification.Text=r3.url;
          API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
            let jsonData = JSON.parse(response);
            if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
              valuesArrays[params2[0]][params2[1]][params2[2]]={};
            }
            valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
          }, [c,p,"CommercialCode","CommercialCode_field"]);

          productSpecification = {};
          productSpecification.FieldId=specificationList[c]["Other"]["constructionType"];
          productSpecification.Text=r3.constructiontype;
          API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
            let jsonData = JSON.parse(response);
            if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
              valuesArrays[params2[0]][params2[1]][params2[2]]={};
            }
            valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
          }, [c,p,"Other","constructionType"]);

          productSpecification = {};
          productSpecification.FieldId=specificationList[c]["Other"]["field5"];
          productSpecification.Text=r3.field5;
          API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
            let jsonData = JSON.parse(response);
            if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
              valuesArrays[params2[0]][params2[1]][params2[2]]={};
            }
            valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
          }, [c,p,"Other","field5"]);

          productSpecification = {};
          productSpecification.FieldId=specificationList[c]["Other"]["sellable"];
          productSpecification.Text=catalogEntry.root.record.find(r4 => r4.parentpartnumber==r3.partnumber && r4.type=="ItemBean").buyable==1?"true":"false";
          API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
            let jsonData = JSON.parse(response);
            if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
              valuesArrays[params2[0]][params2[1]][params2[2]]={};
            }
            valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
          }, [c,p,"Other","sellable"]);

          productSpecification = {};
          productSpecification.FieldId=specificationList[c]["Other"]["fewPiecesThreshold"];
          productSpecification.Text="1";//"13";
          API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
            let jsonData = JSON.parse(response);
            if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
              valuesArrays[params2[0]][params2[1]][params2[2]]={};
            }
            valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
          }, [c,p,"Other","fewPiecesThreshold"]);

          productSpecification = {};
          productSpecification.FieldId=specificationList[c]["Other"]["minimumQuantityThreshold"];
          productSpecification.Text="1";//"5";
          API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
            let jsonData = JSON.parse(response);
            if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
              valuesArrays[params2[0]][params2[1]][params2[2]]={};
            }
            valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
          }, [c,p,"Other","minimumQuantityThreshold"]);

          productSpecification = {};
          productSpecification.FieldId=specificationList[c]["Other"]["showPrice"];
          productSpecification.Text="true";
          API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
            let jsonData = JSON.parse(response);
            if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
              valuesArrays[params2[0]][params2[1]][params2[2]]={};
            }
            valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
          }, [c,p,"Other","showPrice"]);

          let r4 = catalogEntryDescription.root.record.find(r5 => r5.partnumber==p);
          productSpecification = {};
          productSpecification.FieldId=specificationList[c]["Other"]["isDiscontinued"];
          productSpecification.Text=(r3.markfordelete==0 && r4.published==0)?"true":"false";
          API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
            let jsonData = JSON.parse(response);
            if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
              valuesArrays[params2[0]][params2[1]][params2[2]]={};
            }
            valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
          }, [c,p,"Other","isDiscontinued"]);


          let type = productType.find(record => record.sku==r3.partnumber.split("-")[0])?.type;
          if(type!=undefined){
            productSpecification = {};
            productSpecification.FieldId=specificationList[c]["Other"]["productType"];
            productSpecification.Text=type;
            API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
              let jsonData = JSON.parse(response);
              if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
                valuesArrays[params2[0]][params2[1]][params2[2]]={};
              }
              valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
            }, [c,p,"Other","productType"]);
          }

          let cat = CatalogGroupCatalogEntryRelationship.root.record.find(x => x.partnumber==r3.partnumber)?.catgroup_identifier;
          productSpecification = {};
          productSpecification.FieldId=specificationList[c]["Other"]["extendedWarranty"];
          if(cat!=undefined){
            if(!accessoryCategories.includes(cat)){
              productSpecification.Text="true"
            }else{
              productSpecification.Text="false"
            }
            API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
              let jsonData = JSON.parse(response);
              if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
                valuesArrays[params2[0]][params2[1]][params2[2]]={};
              }
              valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
            }, [c,p,"Other","extendedWarranty"]);
          }

          productSpecification = {};
          productSpecification.FieldId=specificationList[c]["Other"]["available"];
          productSpecification.Text="false";
          API.sendRequest("/api/catalog/pvt/product/"+productIDmapping[r3.partnumber]+"/specification", "POST", productSpecification, (response,params2) => {
            let jsonData = JSON.parse(response);
            if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
              valuesArrays[params2[0]][params2[1]][params2[2]]={};
            }
            valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
          }, [c,p,"Other","available"]);

          let defAttrVals = definingAttributeValue.root.record.filter(r=> r.parentpartnumber==r3.partnumber);
          defAttrVals?.forEach(r => {
            let skuSpecification = {};
            skuSpecification.FieldId=specificationList[c]["Sku specs"][r.attributename]["key"];
            skuSpecification.FieldValueId=specificationList[c]["Sku specs"][r.attributename][r.value]?specificationList[c]["Sku specs"][r.attributename][r.value]:findColorId(c,"Sku specs",r.attributename,r.value);
            API.sendRequest("/api/catalog/pvt/stockkeepingunit/"+skuIdMapping[r.partnumber]+"/specification", "POST", skuSpecification, (response,params2) => {
              let jsonData = JSON.parse(response);
              if(valuesArrays[params2[0]][params2[1]][params2[2]]==undefined){
                valuesArrays[params2[0]][params2[1]][params2[2]]={};
              }
              valuesArrays[params2[0]][params2[1]][params2[2]][params2[3]]=jsonData.Id;
            }, [c,p,"Sku specs",r.attributename]);
          });
        });
    }
    API.stop(()=>{fs.writeFileSync(__dirname+"/productSkuSpecifications.json", JSON.stringify(valuesArrays, null, 2))});
}

uploadProductSpecifications();