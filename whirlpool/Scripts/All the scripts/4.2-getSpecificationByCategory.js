const fs = require("fs");
const API = require("../SendToAPI");
var specificationList = {};

function getAll(){
    API.start(200);
    for(let c=1;c<=63;c++){
        API.sendRequest("/api/catalog/pvt/category/"+c,"GET",null, (response) => {
            let jsonData = JSON.parse(response);
            if(specificationList[jsonData.AdWordsRemarketingCode]==undefined){
                specificationList[jsonData.AdWordsRemarketingCode]={};
            }
            API.sendRequest("/api/catalog_system/pub/specification/field/listByCategoryId/"+jsonData.Id,"GET",null, (response,ctg) => {
                let jsonData = JSON.parse(response);
                jsonData.forEach(s => {
                    API.sendRequest("/api/catalog_system/pub/specification/fieldGet/"+s.FieldId,"GET",null, (response,ctgy) => {
                        let jsonData = JSON.parse(response);
                        //console.log(jsonData);
                        API.sendRequest("/api/catalog_system/pub/specification/groupGet/"+jsonData.FieldGroupId,"GET",null, (response,data) => {
                            let jsonData = JSON.parse(response);
                            if(specificationList[data[0]][jsonData.Name]==undefined){
                                specificationList[data[0]][jsonData.Name]={};
                            }
                            if(specificationList[data[0]][jsonData.Name][data[1]]==undefined){
                                specificationList[data[0]][jsonData.Name][data[1]]=data[2];
                            }
                        },[ctgy,jsonData.Name,jsonData.FieldId]);
                    },ctg);
                });
            },jsonData.AdWordsRemarketingCode);
        },null);
    }
    API.stop(()=>{fs.writeFileSync("./specificationListQA.json", JSON.stringify(specificationList, null, 2))});
}

getAll();