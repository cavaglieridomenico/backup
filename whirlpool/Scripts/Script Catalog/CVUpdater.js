const fetch = require('node-fetch')

main();

async function main(){

    

    let CVinstance = require("./CVIstance.json");
    let qaTree = require("./qaCompleteTree.json");
    let prodTree = require("./tree.json");

    CVinstance.forEach(cvItem => {

        let catName = "";
        let catFName = "";

        let videoUrl = cvItem.videoUrl;
        let categoryId = 0;

        for(let index = 0; index<qaTree.length; index++){

            
            if(cvItem.categoryId == qaTree[index].catId){
                catName = qaTree[index].catName;
                catFName = qaTree[index].catFName;
                break;
            }
        }

        for(let indexII = 0; indexII<prodTree.length; indexII++){

            if(prodTree[indexII].catName == catName && prodTree[indexII].catFName == catFName){
                categoryId = prodTree[indexII].catId
            }

        }

        console.log(" Video URL: ", videoUrl);
        console.log(" Category ID: ", categoryId);
        console.log("-----------------------------------------------");
    
        
        
        sendRequest(videoUrl, categoryId);
        
    })

    

}

async function sendRequest(videoUrl, categoryId){

    const appKey = "vtexappkey-hotpointuk-JMBRTX"
    const appToken = "KNOXQAFTWCODGEXOIWITIOYHXEBWNQMVKNFRUPTZCTSCWYIQFIYSBHVEADSKXAGGIXDDPOWSBWYOABUSUGHLQLPVDCJSISGQLGAXGRTEIYPGXLCJIPVQAGZITEYIBFNW"
    const account = "hotpointuk"
    
    let options2 = {
        method: "POST",
        headers: {
            "X-VTEX-API-AppKey": appKey,
            "X-VTEX-API-AppToken": appToken,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }

    

    let bodyPOST = {

        categoryId: categoryId,
        videoUrl: videoUrl
    }

    options2.body = JSON.stringify(bodyPOST);
    let responsePOST = await fetch(`https://${account}.myvtex.com/api/dataentities/CV/documents`, options2);
    responsePOST = await responsePOST.text();
    console.log(responsePOST);
    
}