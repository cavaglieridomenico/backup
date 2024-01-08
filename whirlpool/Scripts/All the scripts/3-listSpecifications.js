const fs = require("fs");

const productXCategory = require("./ProductXCategory.json");
const descriptiveAttribute = require("../catalogJsonFiles/DescriptiveAttribute.json");
const definingAttribute = require("../catalogJsonFiles/definingAttribute.json");
const definingAttributeValue = require("../catalogJsonFiles/definingAttributeValue.json");


var categoryXGroupXSpecification = {};

function customIncludes(array,element){
  let ret = false;
  for(let i=0;i<array.length && !ret;i++){
    if(array[i].toLowerCase()==element.toLowerCase()){
      ret=true;
    }
  }
  return ret;
}

function customIncludes2(array,element){
  let ret = false;
  for(let i=0;i<array.length && !ret;i++){
    if(array[i].valueidentifier.toLowerCase()==element.toLowerCase()){
      ret=true;
    }
  }
  return ret;
}

function listSpecifications() {
  for (var c of Object.keys(productXCategory)) {
    categoryXGroupXSpecification[c]={};
    productXCategory[c]?.forEach(productID => {
      descriptiveAttribute.root.record.filter(record => record.partnumber==productID)?.forEach(r => {
        switch(r.groupname){
          case "CompareFeature":
            if(categoryXGroupXSpecification[c][r.description]==undefined){
              categoryXGroupXSpecification[c][r.description]=[];
            }
            if(!customIncludes2(categoryXGroupXSpecification[c][r.description],r.valueidentifier) && r.valueidentifier!=""){
              categoryXGroupXSpecification[c][r.description].push({valueidentifier: r.valueidentifier, usage: r.usage});
            }
            break;
          case "RatingGroupAttrLogo":
            if(categoryXGroupXSpecification[c][r.groupname]==undefined){
              categoryXGroupXSpecification[c][r.groupname]=[];
            }
            if(!customIncludes2(categoryXGroupXSpecification[c][r.groupname],r.valueidentifier) && r.valueidentifier!=""){
              categoryXGroupXSpecification[c][r.groupname].push({valueidentifier: r.valueidentifier, description2: r.description2});
            }
            break;
          case "EnergyLogo":
            if(categoryXGroupXSpecification[c][r.groupname]==undefined){
              categoryXGroupXSpecification[c][r.groupname]=[];
            }
            if(!customIncludes(categoryXGroupXSpecification[c][r.groupname],r.groupname+"_description")){
              categoryXGroupXSpecification[c][r.groupname].push(r.groupname+"_description");
            }
            if(!customIncludes(categoryXGroupXSpecification[c][r.groupname],r.groupname+"_image")){
              categoryXGroupXSpecification[c][r.groupname].push(r.groupname+"_image");
            }
            break;
          case "Endeca":
            if(categoryXGroupXSpecification[c][r.groupname]==undefined){
              categoryXGroupXSpecification[c][r.groupname]=[];
            }
            if(r.description.toLowerCase()!="special features"){
              if(r.description!="" && !customIncludes(categoryXGroupXSpecification[c][r.groupname],r.description)){
                categoryXGroupXSpecification[c][r.groupname].push(r.description);
              }
            }
            break;
          case "CategoryDataCluster":
            if(categoryXGroupXSpecification[c][r.groupname]==undefined){
              categoryXGroupXSpecification[c][r.groupname]=[];
            }
            if(!customIncludes2(categoryXGroupXSpecification[c][r.groupname],r.valueidentifier) && r.valueidentifier!=""){
              categoryXGroupXSpecification[c][r.groupname].push({valueidentifier: r.valueidentifier, usage: r.usage});
            }
            break;
          case "Document":
            if(categoryXGroupXSpecification[c][r.groupname]==undefined){
              categoryXGroupXSpecification[c][r.groupname]=[];
            }
            if(!customIncludes(categoryXGroupXSpecification[c][r.groupname],normalize(r.name.toLowerCase())) && r.name.toLowerCase()!=""){
              categoryXGroupXSpecification[c][r.groupname].push(normalize(r.name.toLowerCase()));
            }
            break;
        }
      });
      if(categoryXGroupXSpecification[c]["Sku specs"]==undefined){
        categoryXGroupXSpecification[c]["Sku specs"]={};
      }
      definingAttribute.root.record.filter(record => record.partnumber==productID)?.forEach(rda => {
        if(categoryXGroupXSpecification[c]["Sku specs"][rda.name]==undefined){
          categoryXGroupXSpecification[c]["Sku specs"][rda.name]=[];
        }
        definingAttributeValue.root.record.filter(rdavx => rdavx.parentpartnumber==rda.partnumber && rdavx.attributename==rda.name)?.forEach(col => {
          if(!customIncludes(categoryXGroupXSpecification[c]["Sku specs"][rda.name],col.value)){
            categoryXGroupXSpecification[c]["Sku specs"][rda.name].push(col.value);
          }
        });;
      });
    });
    
    categoryXGroupXSpecification[c]["Other"]=[];
    categoryXGroupXSpecification[c]["Other"].push("constructionType");
    categoryXGroupXSpecification[c]["Other"].push("field5");
    categoryXGroupXSpecification[c]["Other"].push("sellable");
    categoryXGroupXSpecification[c]["Other"].push("fewPiecesThreshold");
    categoryXGroupXSpecification[c]["Other"].push("minimumQuantityThreshold");
    categoryXGroupXSpecification[c]["Other"].push("showPrice");
    categoryXGroupXSpecification[c]["Other"].push("isDiscontinued");
    categoryXGroupXSpecification[c]["Other"].push("productType");
    categoryXGroupXSpecification[c]["Other"].push("available");
    categoryXGroupXSpecification[c]["Other"].push("extendedWarranty");

    categoryXGroupXSpecification[c]["CommercialCode"]=[];
    categoryXGroupXSpecification[c]["CommercialCode"].push("CommercialCode_field");
  }
  fs.writeFileSync(__dirname+"/categoryXGroupXSpecification.json", JSON.stringify(categoryXGroupXSpecification, null, 2));
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

listSpecifications();
