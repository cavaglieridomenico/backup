import ApiConfig from '../clients/api.config'

import VtexApiConfig from "../clients/vtex.Api.Config";
import {getBackMeProductMapper, mapperMail, orderMapperLoad} from "./mapper.json";
import { UserInputError} from "@vtex/api";
import {catalogSalesforce} from "../clients/maping.saleforce.catalog";


let api: ApiConfig
let vtexApi: VtexApiConfig
let token: {
    access_token: string,
    old_time: number
}
let tockenCredential = {
    grant_type: 'client_credentials',
    client_id: 'bcxvx8o7nlkeaq8dg52qrqz7',
    client_secret: 'ABlmhD3gm9uNe6ZNs5UufygE',
}

export function callSalesforceTokenApi(ctx: any, options: {}, key: string, keyMail: string, id: string) {
    api = new ApiConfig(ctx.host, ctx.vtex, options)
    api.getToken(tockenCredential).then(responseBody => {
        let tokenJason = JSON.parse(JSON.stringify(responseBody))
        token = {access_token: tokenJason.access_token, old_time: (Number(new Date()) + 1080000)}
        postOrderPram(ctx, key, keyMail, tokenJason.access_token, id)
    }, error => {
        console.log('*************Error Auth************** ' + error)
    })
}

export function sendMail(mailMessage: any, key: string) {
    console.log(mailMessage)
    console.log(mailMessage.To)
    api.sendEmail(mailMessage, key).then(responseBody => {

        console.log('**************** Success *********************')
        console.log(responseBody)
    }, error => console.log('*************Error Mail************** ' + error))

}
export function checkTokenEvent(ctx:  StatusChangeContext, key: string, keyMail: string){
    let id = ctx.body.orderId
    if (id == undefined) {
        throw new UserInputError('Order is not present id = ' + id)
    }
    if (isValidToken()) {
        const options = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        }
        callSalesforceTokenApi(ctx, options, key, keyMail,id)
    } else {
        postOrderPram(ctx, key, keyMail, token.access_token,id)
    }
}

export function checkToken(ctx: Context, key: string, keyMail: string) {
    let id = ctx.query.id
    if (id == undefined) {
        throw new UserInputError('Order is not present id = ' + id)
    }
    if (isValidToken()) {
        const options = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        }
        callSalesforceTokenApi(ctx, options, key, keyMail, id)
    } else {
        postOrderPram(ctx, key, keyMail, token.access_token, id)
    }
}

export async function postOrderPram(ctx: any, key: string, keyMail: string, tokenPass: string, id: string) {
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${tokenPass}`,
        },
    }
    api = new ApiConfig(ctx.host, ctx.vtex, options)
    vtexApi = new VtexApiConfig(ctx.vtex, options)
    vtexApi.getOrder(id).then(response => {
        let body = JSON.parse(JSON.stringify(response.data))
        let order = orderMapperLoad(body, ctx.vtex.host,vtexApi)
        api.passedParam(order, key).then(value => {
            console.log(value)
            vtexApi.getEmail(body.clientProfileData.userProfileId).then((email: any) => {
                let emailJson = JSON.parse(JSON.stringify(email.data))[0]
                console.log(emailJson)
                sendMail(mapperMail(body, emailJson), keyMail)
            }, error => {
                console.log('*************Error Params************** ' + error)
            })
        })
    }, error => {
        console.error('*************Error Order************** ' + error)
    })
}

function isValidToken(): boolean {
    return token == undefined || token.access_token == undefined || token.old_time == undefined || token.old_time < Number(new Date());
}

export function checkAccessTokenProduct(ctx: Context, key: string, avalibility: boolean) {
    if (isValidToken()) {
        const options = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        }
        callSalesforceTokenApiProduct(ctx, options, key, avalibility)

    } else {
        sentProductBackRequest(ctx, token.access_token, key, avalibility)
    }
}

export function callSalesforceTokenApiProduct(ctx: Context, options: {}, key: string, avalibility: boolean) {
    api = new ApiConfig(ctx.host, ctx.vtex, options)
    api.getToken(tockenCredential).then(responseBody => {
        let tokenJason = JSON.parse(JSON.stringify(responseBody))
        token = {access_token: tokenJason.access_token, old_time: (Number(new Date()) + 1080000)}
        sentProductBackRequest(ctx, token.access_token, key, avalibility)
    }, error => {
        console.log('*************Error Auth************** ' + error)
    })
}

function sentProductBackRequest(ctx: Context, tokenPass: string, key: string, avalibility: boolean) {
    let id = ctx.query.id
    let destination = ctx.query.email
    if (id == undefined || destination == undefined) {
        throw new UserInputError('Order is not present id = ' + id + 'Or Destination email = ' + destination)
    }
    const options = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${tokenPass}`,
        },
    }
    api = new ApiConfig(ctx.host, ctx.vtex, options)

    vtexApi = new VtexApiConfig(ctx.vtex, options)
    vtexApi.getProductSkuAlternative(id).then(response => {
        let product = JSON.parse(JSON.stringify(response.data))
        let salesforceObj = getBackMeProductMapper(product, destination, ctx, avalibility)
        console.log(salesforceObj)
        api.passedProductBack(salesforceObj, key).then(response => {
            console.log(response)
        })
    })

}

export function uploadCatalog(ctx: Context,): Promise<{}> {
    let id = ctx.query.id
    return new Promise<{}>((resolve, reject) => {
        if (id == undefined) {
            reject('Passed parameter is not present id = ' + id)
            throw new UserInputError('Passed parameter is not present id = ' + id)
        }
        if (isNaN(+id)) {
            reject('Passed parameter is not number id = ' + id)
            throw new UserInputError('Passed parameter is not number id = ' + id)
        }
        const options = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "X-VTEX-API-AppKey": "vtexappkey-ruwhirlpoolqa-AIHWUB",
                "X-VTEX-API-AppToken": "IZQLNOEVVJGXTAQPMNBMQWOGJYLYVWHEEHMCHEBQAJYMMTBSCPLWNBILLJBPCFAYCBSLOOIHMKMGYBUPWTWGLKQDZARXCMNUJZJKAPENGDKCOBMJPLSJITNRKPMNXLFZ"
            },
        }
        vtexApi = new VtexApiConfig(ctx.vtex, options)
        vtexApi.getProductSkuAlternative(id).then(responseSku => {
            let sku = JSON.parse(JSON.stringify(responseSku.data))
            const isoCodeArray: string[]=[]
            sku.SalesChannels.forEach((salesChannel: any)=>{
                isoCodeArray.push(getIsoCodeInventory(salesChannel))
            })
            vtexApi.getProductSingle(sku.ProductId).then(responseProduct => {
                let product = JSON.parse(JSON.stringify(responseProduct.data))
                vtexApi.getPrice(sku.Id, ctx).then(responsePrice => {
                    let price = JSON.parse(JSON.stringify(responsePrice.data))

                        vtexApi.getInventory(sku.Id,isoCodeArray ).then(responseInventory => {
                            let inventory = responseInventory
                            vtexApi.getCategory(product.CategoryId).then(responseCategory => {
                                let category = JSON.parse(JSON.stringify(responseCategory.data))
                                vtexApi.getImagesMain(sku.Id).then(imageMain => {
                                    const images=JSON.parse(JSON.stringify(imageMain.data))
                                    const imageSingle=  images.find((image:any) => image.IsMain)
                                    catalogSalesforce(sku, price, inventory, category, ctx,imageSingle).then(response => {
                                        resolve(response)
                                    })
                                })
                            }, error => {
                                console.log('**************Category Error ****************' + error)
                                reject(error)
                            })

                        }, error => {
                            console.log('**************Inventory Error ****************' + error)
                            reject(error)
                        })

                }, error => {
                    console.log('******************* Price Error **************** ' + error)
                    reject(error)
                })
            }, err => {
                console.log('*************** Product Error ************ ' + err)
                reject(err)
            })
        }, error => {
            console.log('*********** Sku Error ************** ' + error)
            reject(error)
        })
    })
}
function getIsoCodeInventory(data:number){
    switch (data) {
        case 1: return'1_1'
        case 2: return'1_2'
        case 3: return'1_3'
        default:return ' '
    }
}
