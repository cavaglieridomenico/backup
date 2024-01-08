import ApiConfig from "../clients/api.config";
import {refundMapping, returnMapping} from "../clients/refoundreturn.mapping";


let api: ApiConfig
let tockenCredential = {
    grant_type: 'client_credentials',
    client_id: 'bcxvx8o7nlkeaq8dg52qrqz7',
    client_secret: 'ABlmhD3gm9uNe6ZNs5UufygE',
}

export function callSalesforceTokenApiRefund(ctx: any, key: string, product: {}, type: number) {
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
    }
    api = new ApiConfig(ctx.host, ctx.vtex, options)
    api.getToken(tockenCredential).then(responseBody => {
        let tokenJason = JSON.parse(JSON.stringify(responseBody))
        switch (type) {
            case 1: {
                postSalesforceRefund(ctx, key, tokenJason.access_token, product)
                break;
            }
            case 2: {
                postSalesforceReturn(ctx, key, tokenJason.access_token, product)
                break;
            }
        }

    }, error => {
        console.log('*************Error Auth************** ' + error)
    })
}

function postSalesforceRefund(ctx: any, key: string, access_token: any, product: {}) {
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${access_token}`,
        },
    }
    console.log('*************PostSalesforceRef***************')
    api = new ApiConfig(ctx.host, ctx.vtex, options)
    refundMapping(product).then(response => {
        console.log(response.To)
        api.refundOrder(product, key).then(response => {
            console.log('************* Success *************')
            console.log(response)
        }, error => console.log('***************** Salesforce Refund ****************' + error))
    })

}

function postSalesforceReturn(ctx: any, key: string, access_token: any, product: {}) {
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${access_token}`,
        },
    }
    console.log('*************PostSalesforceRef***************')
    api = new ApiConfig(ctx.host, ctx.vtex, options)
    returnMapping(product).then(response => {
        console.log(response.To)
        api.refundOrder(product, key).then(response => {
            console.log('************* Success *************')
            console.log(response)
        }, error => console.log('***************** Salesforce Return ****************' + error))
    })

}
