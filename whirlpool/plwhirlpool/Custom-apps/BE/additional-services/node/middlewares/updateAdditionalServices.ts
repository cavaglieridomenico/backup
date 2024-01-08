import { CustomLogger } from "../utils/Logger"
async function updateAdditionalServices(ctx: Context) {
    try{
        ctx.vtex.logger = new CustomLogger(ctx);
        ctx.vtex.logger.info("[UPDATE ADDITIONAL SERVICES] - Update triggered")

        let skuIds: any = (await ctx.clients.vtexAPI.getSkuIds()).data

        for(let skuId of skuIds){
            let productInformation: any = (await ctx.clients.vtexAPI.getProductId(skuId)).data

            let productService: string = ""
            if(productInformation?.Services.length > 0 ){
                for(let i = 0; i < productInformation.Services.length - 1; i++){
                    productService += productInformation.Services[i].Name + ","
                }
                productService += productInformation.Services[productInformation.Services.length - 1].Name
            }
            let additionalServicesSpecification: [{
                "Value": string[],
                "Name": string
            }] = [{
                Value: [productService],
                Name: "additionalServices"
            }]

            ctx.clients.vtexAPI.updateSpecification(additionalServicesSpecification , productInformation.ProductId)
            .catch(err=>{
                ctx.vtex.logger.error("[UPDATE ADDITIONAL SERVICES] product id : " + productInformation.ProductId + " - " + (err.message != undefined ? err.message : err.response.message))
            })
        }
    }catch(err){
        ctx.vtex.logger.error("[UPDATE ADDITIONAL SERVICES] " + (err.message != undefined ? err.message : err.response.message))
    }
}

export async function updateSpecification(ctx: Context, next: () => Promise<any>){
    ctx.status = 200
    updateAdditionalServices(ctx)
    await next()
}
