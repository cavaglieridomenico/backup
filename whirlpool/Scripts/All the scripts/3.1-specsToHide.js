const specifications = require("../new/categoryXGroupXSpecification.json");
const fs = require("fs");

var specList = []; //require("./list.json");
const defaultSpecsToHide = ["category-1", "category-2", "category-3", "brand", "new-release", "sellername", "promotion", "loading-type-", "depth-", "ventilator-inside-"]

function list(){
    for(let c of Object.keys(specifications)){
        for(let g of Object.keys(specifications[c])){
            if(g!="Endeca"){
                if(g=="Document" || g=="EnergyLogo" || g=="Other" || g=="CommercialCode"){
                    specifications[c][g].forEach(e => {
                        if(!specList.includes(generateUrl(e))){//.find(f => f.name==e)==undefined){
                            //if(e!="available"){
                            specList.push(/*{name:*/ generateUrl(e)/*}*/);
                            //}
                        }
                    });
                }else{
                    if(g=="Sku specs"){
                        for(let k of Object.keys(specifications[c][g])){
                            if(!specList.includes(generateUrl(k))){//find(f => f.name==k)==undefined){
                                specList.push(/*{name:*/ generateUrl(k)/*}*/);
                            }
                        }
                    }else{
                        specifications[c][g].forEach(s => {
                            if(!specList.includes(generateUrl(s.valueidentifier))){//find(f => f.name==s.valueidentifier)==undefined){
                                specList.push(/*{name: */generateUrl(s.valueidentifier)/*}*/);
                            }
                        });
                    }
                }
            }
        }
    }
    specList.push(...defaultSpecsToHide)
    specList.push();
    fs.writeFileSync("../temp/specsToHide.json", JSON.stringify(specList, null, 2));
}

function generateUrl(linkid){
    linkid = linkid.toLowerCase();
    linkid = linkid.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    linkid = linkid.replace(/\+/g,"plus");
    linkid = linkid.replace(/\[/g,"-");
    linkid = linkid.replace(/\]/g,"-");
    linkid = linkid.replace(/\//g,"-");
    linkid = linkid.replace(/\!/g,"-");
    linkid = linkid.replace(/\"/g,"-");
    linkid = linkid.replace(/\£/g,"-");
    linkid = linkid.replace(/\$/g,"-");
    linkid = linkid.replace(/\%/g,"-");
    linkid = linkid.replace(/\&/g,"-");
    linkid = linkid.replace(/\(/g,"-");
    linkid = linkid.replace(/\)/g,"-");
    linkid = linkid.replace(/\=/g,"-");
    linkid = linkid.replace(/\'/g,"-");
    linkid = linkid.replace(/\?/g,"-");
    linkid = linkid.replace(/\^/g,"-");
    linkid = linkid.replace(/\|/g,"-");
    linkid = linkid.replace(/\{/g,"-");
    linkid = linkid.replace(/\}/g,"-");
    linkid = linkid.replace(/\ç/gi,"-");
    linkid = linkid.replace(/\@/g,"-");
    linkid = linkid.replace(/\°/g,"-");
    linkid = linkid.replace(/\#/g,"-");
    linkid = linkid.replace(/\§/g,"-");
    linkid = linkid.replace(/\,/g,"-");
    linkid = linkid.replace(/\;/g,"-");
    linkid = linkid.replace(/\./g,"-");
    linkid = linkid.replace(/\:/g,"-");
    //linkid = linkid.replace(/\-/g,"");
    linkid = linkid.replace(/\_/g,"-");
    linkid = linkid.replace(/\</g,"-");
    linkid = linkid.replace(/\>/g,"-");
    linkid = linkid./*replace(/  /g," ").*/replace(/ /g,"-");
    return linkid;
}

list();