const API = require("../SendToAPI");

function modifyFieldCategory(){
    API.start(200);
    for(let c=56;c<=300;c++){
        API.sendRequest("/api/catalog/pvt/category/"+c,"GET",null, (response) => {
            let jsonDataGET = JSON.parse(response);
            console.log(jsonDataGET);
            //jsonDataGET.GlobalCategoryId = 604;
            /*
            if(jsonDataGET != null){
                API.sendRequest("/api/catalog/pvt/category/"+c,"PUT",jsonDataGET, (response2) => {
                    let jsondataPUT = JSON.parse(response2);
                    console.log(jsondataPUT);
                },null);
            }
            */
        },null);
    }
    API.stop();
}
modifyFieldCategory();