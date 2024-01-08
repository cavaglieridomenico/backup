const fetch = require('node-fetch');
const fs = require('fs');

async function wait(time){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}

const account = "frwhirlpoolqa";
const accKey = "vtexappkey-frwhirlpoolqa-GESKRY";
const accToken = "QTGIQJQBQVBBZIABCRYNRSPSWJDCFLWSTUXVJXTSDSHTZTKBXXKACKRYDOLGGOWEYJHFLEREXFJZKVSDZBEIAWPJCYRVLNMOWCVQLEQSFFCXASNIVIHEKOECTYCMNWSK";

async function getAll(entity, results, token){
    return new Promise((resolve,reject) => {
        fetch("https://"+account+".myvtex.com/api/dataentities/"+entity+"/scroll"+(token==undefined?"?_size=1000&_fields=id":"?_token="+token),
        {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
                "X-VTEX-API-AppKey": accKey,
                "X-VTEX-API-AppToken": accToken,
                "Cache-Control": "no-cache"
            }
        })
        .then(async(res) => {
            console.log(res.status+": "+res.statusText); // 400 = Maximum simultaneous scrolls rate exceeded (10)
            if(res.status==200){
                let payload = await res.json();
                results = results.concat(payload);
                if(payload.length<1000){
                    resolve(results);
                }else{
                    //await wait(200);
                    if(token!=undefined){
                        return getAll(entity, results, token).then(res1 => resolve(res1)).catch(err1 => reject(err1));
                    }else{
                        let tkn = res.headers.get('x-vtex-md-token');
                        return getAll(entity, results, tkn).then(res1 => resolve(res1)).catch(err1 => reject(err1));
                    }
                }
            }else{
                resolve(results);
            }
        })
        .catch(async(err) => {
            reject(err)
        })
    })
}

async function getRecords(entity){
    try{
        let records = await getAll(entity, [], undefined);
        fs.writeFileSync("./md/records.json",JSON.stringify(records,null,2));
    }catch(err){
        console.log(err);
    }
}

getRecords("AD")