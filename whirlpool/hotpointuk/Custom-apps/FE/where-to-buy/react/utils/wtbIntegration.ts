export async function getRetailers (productSku: string) : Promise<any> {
    const apiUrl = `https://services.internetbuyer.co.uk/REST.svc/GetByProductPartNumber?ProductPartNumber='${productSku}'&CID=109&$format=json` // PROD endpoint
    // const apiUrl = `https://api-cms.tps-cloud.com/apicms/apis/aa208b30-257d-11e9-b03f-b5666fec9770/13826e20-c925-11eb-8c59-dda4a9db202c`
    // const apiUrl = `https://api-cms.tps-cloud.com/apicms/apis/aa208b30-257d-11e9-b03f-b5666fec9770/56156850-5c2d-11ec-a354-65fed8fa6dd2` // Testing endpoint - seems not be working
    return fetch(apiUrl, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
