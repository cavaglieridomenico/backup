const fetch = require('node-fetch')
const fs = require('fs')

//Credentials

const appKey = "vtexappkey-plwhirlpool-EROZAI";
const appToken = "MMQXKOWAYMJKYZKTJCSAJJWSNGLLVFGERMBHQFESXOAYFPRJYPZQBDACQYJEDLESFETLXCDDYADVJYMYOBMGFPDOMZRRWZPLJHSBWFMVLWSBZESRMLQBZXMPAFZXLMGZ";
const account = "plwhirlpool";


let options = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json"
    },
}

main();

async function main() {
    try {
        let getCoupons = await fetch(`https://${account}.myvtex.com/api/rnb/pvt/coupon`, options);
        getCoupons = await getCoupons.json();
        let count = 0;

        let couponToExportArray = [];

        getCoupons.forEach(x => {
            if(x.utmSource == "vip_echo" && x.isArchived == false && x.lastModifiedUtc.includes("2023-01-11T")){
                count ++;
                let couponObj = {
                    lastModifiedUtc: x.lastModifiedUtc,
                    utmSource: x.utmSource,
                    utmCampaign: x.utmCampaign,
                    couponCode: x.couponCode
                };
                couponToExportArray.push(couponObj)
            }
            
        });
        console.log(count);
        //console.log(couponToExportArray);

        fs.writeFileSync("./couponPL.json", JSON.stringify(couponToExportArray, null, 2));
    } catch (err) {
        console.log(err);
    }
    
}



