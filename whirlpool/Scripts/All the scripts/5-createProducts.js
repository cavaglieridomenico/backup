'use strict'

const fs = require('fs');
const API = require("../SendToAPI");

const catalogEntry = require('../catalogJsonFiles/CatalogEntry.json');
const catalogEntryDescription = require("../catalogJsonFiles/CatalogEntryDescription.json");
const CatalogGroupCatalogEntryRelationship = require("../catalogJsonFiles/CatalogGroupCatalogEntryRelationship.json");
const categoryMapping = require("../BODL2JsonMapping/BODLCategoryIdToVtexCategoryId.json");
const brandList = require("./brandList.json");

var productIdMapping = {};

function createProducts(){
    API.start(200);
    catalogEntry.root.record.filter(r0 => r0.type=="ProductBean" && !r0.partnumber.includes("SERVICE"))?.forEach(p0 => {
        let descRecord = catalogEntryDescription.root.record.find(p1 => p1.partnumber==p0.partnumber);
        let linkid = descRecord.name+" "+p0.partnumber.split("-")[0];
        linkid = generateUrl(linkid);
        let categories = CatalogGroupCatalogEntryRelationship.root.record.filter(r1 => r1.partnumber==p0.partnumber);
        let product = {
            Name: descRecord.name,
            DepartmentId: 1,
            CategoryId: categoryMapping[categories[0]?.catgroup_identifier],
            BrandId: brandList[p0.mfname],
            LinkId: linkid,
            RefId: p0.partnumber,
            IsVisible: true,
            Description: descRecord.longdescription,
            DescriptionShort: descRecord.shortdescription,
            ReleaseDate: null,
            KeyWords: null,
            Title: descRecord.name,
            IsActive: true,
            TaxCode: null,
            MetaTagDescription: descRecord.metalongdescription,
            SupplierId: 1,
            ShowWithoutStock: true,
            AdWordsRemarketingCode: null,
            LomadeeCampaignCode: null,
            Score: categories[0]?.sequence?parseInt(categories[0].sequence):null
        }
        //console.log(product);
        API.sendRequest('/api/catalog/pvt/product/', 'POST', product, (responsedata, info) => {
            let jsonData=JSON.parse(responsedata);
            productIdMapping[info[0]]=jsonData.Id;
            let cat = info[1];
            if(cat.length > 1){
                for(let i=1; i<cat.length;i++){
                    API.sendRequest('/api/catalog/pvt/product/'+jsonData.Id+'/similarcategory/'+categoryMapping[cat[i].catgroup_identifier], 'POST', null);
                }
            }
        }, [p0.partnumber, categories]);
    });
    API.stop(()=>{fs.writeFileSync(__dirname + "/../BODL2JsonMapping/BODLProductIdToVtexProductId.json", JSON.stringify(productIdMapping, null, 2))});
}

function generateUrl(linkid){
    linkid = linkid.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    linkid = linkid.replace(/\+/g,"plus");
    linkid = linkid.replace(/\[/g,"");
    linkid = linkid.replace(/\]/g,"");
    linkid = linkid.replace(/\//g,"");
    linkid = linkid.replace(/!/g,"");
    linkid = linkid.replace(/"/g,"");
    linkid = linkid.replace(/£/g,"");
    linkid = linkid.replace(/\$/g,"");
    linkid = linkid.replace(/%/g,"");
    linkid = linkid.replace(/&/g,"");
    linkid = linkid.replace(/\(/g,"");
    linkid = linkid.replace(/\)/g,"");
    linkid = linkid.replace(/=/g,"");
    linkid = linkid.replace(/'/g,"");
    linkid = linkid.replace(/\?/g,"");
    linkid = linkid.replace(/\^/g,"");
    linkid = linkid.replace(/\|/g,"");
    linkid = linkid.replace(/\{/g,"");
    linkid = linkid.replace(/\}/g,"");
    linkid = linkid.replace(/ç/gi,"");
    linkid = linkid.replace(/@/g,"");
    linkid = linkid.replace(/°/g,"");
    linkid = linkid.replace(/#/g,"");
    linkid = linkid.replace(/§/g,"");
    linkid = linkid.replace(/,/g,"");
    linkid = linkid.replace(/;/g,"");
    linkid = linkid.replace(/\./g,"");
    linkid = linkid.replace(/:/g,"");
    linkid = linkid.replace(/-/g,"");
    linkid = linkid.replace(/_/g,"");
    linkid = linkid.replace(/</g,"");
    linkid = linkid.replace(/>/g,"");
    linkid = linkid.replace(/  /g," ").replace(/ /g,"-");
    return linkid;
}

createProducts();