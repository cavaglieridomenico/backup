const fs = require('fs');
const API = require("../SendToAPI");

const categoryMapping = require('../BODL2JsonMapping/BODLCategoryIdToVtexCategoryId.json');
const categoryList = require('../catalogJsonFiles/CatalogGroup.json');
const categoryTree = require('../catalogJsonFiles/CatalogGroupRelationship.json')

var categoryTreeObj = {}
var categoryIDMapping = {}
var counter = 0;

function createCategoryTree(){
    categoryTree.root.record.forEach(e => {
        if(categoryTreeObj[e.catgroup_parent_identifier]==undefined){
            categoryTreeObj[e.catgroup_parent_identifier]=[];
        }
        categoryTreeObj[e.catgroup_parent_identifier].push(e.catgroup_child_identifier);
        counter++;
    });
    //console.log(counter);
    //console.log(categoryTreeObj);
    API.start(200);
    createCategory(Object.keys(categoryTreeObj)[0]);
}

function createCategory(father_id){
    if(counter==0){
        API.stop(()=>{fs.writeFileSync(__dirname +"/../BODL2JsonMapping/BODLCategoryIdToVtexCategoryId.json",JSON.stringify(categoryIDMapping))});
        return;
    }
    let father = categoryIDMapping[father_id];
    categoryTreeObj[father_id]?.forEach(child => {
        let bodlCategory = categoryList.root.record.find( e => e.identifier==child);
        let category = {
            Name: bodlCategory.name.toLowerCase(),
            Keywords: bodlCategory.keyword,
            Title: bodlCategory.name,
            Description: bodlCategory.metadescription,
            AdWordsRemarketingCode: bodlCategory.identifier,
            LomadeeCampaignCode: null,
            FatherCategoryId: father==undefined?null:father,
            GlobalCategoryId: null,
            ShowInStoreFront: bodlCategory.published==1?true:false,
            IsActive: bodlCategory.markfordelete==0?true:false,
            ActiveStoreFrontLink: true,
            StockKeepingUnitSelectionMode: "SPECIFICATION",
            ShowBrandFilter: true,
            Score: null
        }  
        if(categoryMapping[child] != undefined)
            category.Id = categoryMapping[child];
        counter--;
        //console.log(category);
        API.sendRequest('/api/catalog/pvt/category', 'POST', category, (responsedata, BODLCategoryID) => {
            let jsonData=JSON.parse(responsedata);
            categoryIDMapping[BODLCategoryID]=jsonData.Id;
            createCategory(BODLCategoryID);
        },  child);
    });
}

createCategoryTree();