'use strict'

const fs = require('fs');
const API = require("../SendToAPI");

const catalogEntry = require('../catalogJsonFiles/CatalogEntry.json');
const catalogEntryDescription = require("../catalogJsonFiles/CatalogEntryDescription.json");;
const productList = require("./productList.json");
const delta = require('./productDelta.json');

function contain(o,i){
    let found = false;
    for(var s of Object.keys(o)){
        if(s==i){
            found=true;
            break;
        }
    }
    return found;
}

function updateProducts(){
    API.start(200);
    productList.forEach(p => {
        if(contain(delta,p.RefId)){
            let isToDelete = catalogEntry.root.record.find(r => r.partnumber==p.RefId).markfordelete;
            let isPublished = catalogEntryDescription.root.record.find(r => r.partnumber==p.RefId).published;
            if(isToDelete==0 && isPublished==1){
                p.IsVisible=true;
            }else{
                if(isToDelete==0 && isPublished==0){
                    p.IsVisible=true;
                }else{
                    p.IsVisible=false;
                }
            }        
            API.sendRequest('/api/catalog/pvt/product/'+p.Id, 'PUT', p, null, null);
        }
    });
    API.stop();
}

updateProducts();