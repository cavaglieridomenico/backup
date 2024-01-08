'use strict'

const fs = require('fs');
const API = require("../SendToAPI");
const categoryMapping = require('../BODL2JsonMapping/BODLCategoryIdToVtexCategoryId.json');
const productXCategory = require("./ProductXCategory.json");
const groupsToExclude = require('./groupsToExclude.json');
const WP = require("../catalogJsonFiles/DescriptiveAttribute.json");

var categoryXGroups = {}

function createGroups(){
    let wp = []
    WP.root.record.forEach(e =>{
        if(e.groupname=="CompareFeature"){
            if(!wp.includes(e.description)){
                wp.push(e.description);
            }
        }else{
            if(!wp.includes(e.groupname) && !groupsToExclude.includes(e.groupname)){
                wp.push(e.groupname);
            }
        }
    });
    wp.push("Other");
    wp.push("CommercialCode");
    wp.push("Sku specs");
    //console.log(wp);
    API.start(200);
    for(var c of Object.keys(productXCategory)){
        if(categoryXGroups[c]==undefined){
            categoryXGroups[c]={};
        }
        wp.forEach(g => {
            let group={
                CategoryId: categoryMapping[c],
                Name: g
            }
            let params = [];
            params.push(c);
            params.push(g);
            API.sendRequest("/api/catalog_system/pvt/specification/group", "POST", group, (responsedata, params2) => {
                let jsonData=JSON.parse(responsedata);
                if(categoryXGroups[params2[0]][params2[1]]==undefined){
                    categoryXGroups[params2[0]][params2[1]]=jsonData.Id;
                }
            }, params);
        });
    }
    API.stop(()=>{fs.writeFileSync(__dirname+"/groupnameList.json", JSON.stringify(categoryXGroups, null, 2))});
}

createGroups();