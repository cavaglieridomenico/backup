const fs = require('fs')

const appKey = "vtexappkey-bauknechtdeqa-DBJYUG"
const appToken = "NQXUVIWCHKKBORNTYRIBOJXZTJGKTCVJBSZUCDDEHTULCRKRJKZXHDGWWYTEUNJTVVXFGQEUTKDKWFGUMJFDDPAMJKNRKMPNXSYANRXWSDFDGQRUXTBQNYEHYIASFZGG"
const account = "bauknechtdeqa"

/*
const appKey = "vtexappkey-bauknechtde-RKASYV"
const appToken = "HNPJMLIDQMLBAATBCPCPLTQJNRAGTPACKWPORVXVBINVDHDZZIMGDGFVHFJEMALSOGCSXWAOJYVWNKTULLCOYKYWKOXMJOHCRKAXPTNHIBHRFOCXIFJZSHODRKIHFFHB"
const account = "bauknechtde"
*/
const fetch = require('node-fetch');

let options = {
    method: "POST",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    }
}

main()
async function main(){

    let body = {
        next: ""
    }

    let internalList = [];
    let count = 0;
    
    while(body.next != null){

        options.body = JSON.stringify(body)
        let checkResponse = await fetch(`https://${account}.myvtex.com/bom-relationship/listInternals`, options);
        checkResponse = await checkResponse.json()

        body.next = checkResponse.next;
        
        checkResponse.routes.forEach(element => {
            if(element.resolveAs == "/bom"){
                count++;
                internalList.push(element)
            }
        });

        //console.log(JSON.stringify(checkResponse, null ,2));
        console.log(body.next, count);
        
    }

    fs.writeFileSync("./JSON created/QA_internal(16-01)-BK-DE.json", JSON.stringify(internalList, null, 2))

}
