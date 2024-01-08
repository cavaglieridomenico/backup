const fetch = require('node-fetch');
const appKey = "vtexappkey-ruwhirlpoolqa-AIHWUB";
const appToken = "TIRFJIUDXGCJUZPCGOIOUUZOKQGEAOXOIVGWLRFORGCDBDTVPDRGMXDYJDVSBQCJINAYTTQOIUWORVMHXKOWXRCKRHMIWMMBDTVOCUBVMCXSBPHOQNVQBGMQLPHMHISW";
const account = "ruwhirlpoolqa";

let options = {
    method: "GET",
    headers: {
        "X-VTEX-API-AppKey": appKey,
        "X-VTEX-API-AppToken": appToken,
        "Content-Type": "application/json",
        "REST-Range": "resources=0-1000"
    },
}

getCategoryProducts("1")

async function getCategoryProducts(categoryId) {
    let getCategoryProducts = []
    let from = 0, to = 50, totalProduct = 3000;
    try {
        do {
        const { dataResponse, range } = await performAPIcall(categoryId, from, to)
        from += 50
        to += 50
        totalProduct = range.total
        console.log(range)
        getCategoryProducts = getCategoryProducts.concat(dataResponse)
        } while (totalProduct >= from)
    } catch (err) {
        console.error(err)
    }
    return getCategoryProducts
}
function performAPIcall(categoryId, from, to){
    return new Promise(async (resolve, reject) => {
        fetch(`https://${account}.vtexcommercestable.com.br/api/catalog_system/pvt/products/GetProductAndSkuIds?categoryId=${categoryId}&_from=${from}&_to=${to}`, options)
        .then((mdResponse) => {
            if (mdResponse.ok) {
                mdResponse.json().then((response) => {
                //console.log(response)
                resolve({
                dataResponse: Object.keys(response?.data).map((field) => field),
                range: response.range
                })
            })
            } else {
            reject(mdResponse)
            }
        })
        .catch(err => {
            reject(err)
        })
    })
}