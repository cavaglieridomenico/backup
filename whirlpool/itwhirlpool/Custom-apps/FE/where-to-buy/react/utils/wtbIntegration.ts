export async function getRetailers (productSku: string) : Promise<any> {
    console.log(productSku)
    const apiUrl = `https://services.internetbuyer.co.uk/REST.svc/GetByProductPartNumber?ProductPartNumber='${productSku}'&CID=109&$format=json`
    // const apiUrl = `https://api-cms.tps-cloud.com/apicms/apis/aa208b30-257d-11e9-b03f-b5666fec9770/13826e20-c925-11eb-8c59-dda4a9db202c`
    return fetch(apiUrl, {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
    });
}