import { CV } from "../../typings/types";

export const getSupportVideos_resolver = async ( _: any, {sparePartId}: any, ctx: Context) =>{

    let videoUrlsObj: VideoUrls = {
        videoUrls: []
    }

    try {
        let productContext:any = await ctx.clients.vtexAPI.getProductContextByRefId(sparePartId);
        let productCategoryId = productContext.CategoryId;


        let categoryContext = await ctx.clients.vtexAPI.getCategoryContextById(productCategoryId);
        let fatherCategoryId = categoryContext.FatherCategoryId


        let whereCondition = `categoryId = "${fatherCategoryId}"`;

        let responseSearchCV: any = await ctx.clients.masterdata.searchDocuments({
            dataEntity: CV,
            fields: ['videoUrl'],
            pagination: {
                page: 1,
                pageSize: 10
            },
            where: whereCondition
        })

        if(responseSearchCV.length === 0){
            ctx.body = "Not Found"
            ctx.status = 200;

        }else{
            responseSearchCV.forEach((x:any) => {
                videoUrlsObj.videoUrls.push(x.videoUrl);
            });

            ctx.body = "OK";
            ctx.status = 200;
        }
        return videoUrlsObj;
    } catch (error) {
        return error;
    }
}

type VideoUrls = {
    videoUrls: string[]
}
