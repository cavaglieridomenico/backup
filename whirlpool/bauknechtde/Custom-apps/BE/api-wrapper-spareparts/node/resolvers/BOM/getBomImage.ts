import { BM, BR, MAIN } from "../../typings/types";

export const getBomImage_resolver = async ( _: any, {industrialCode}: any, ctx: Context) =>{

    industrialCode = industrialCode.toUpperCase();
    let whereCondition = `industrialCode = "${industrialCode}"`;
    let bomImageObj = [
        {
            id: "",
            bomImage: ""
        }
    ]
    // check if the industrialCode exists and take the bomId field
    try {
        let bomIds: any = await ctx.clients.masterdata.searchDocuments({
            dataEntity: BR,
            fields: ['bomId'],
            schema: MAIN,
            pagination: {
                page: 1,
                pageSize: 15
            },
            where: whereCondition,
        })
        


        if(bomIds.length === 0){
            ctx.body = "Not Found";
            ctx.status = 200;
            return [];
        }else{
            for (let i = 0; i < bomIds.length; i++) {
                whereCondition = `id="${bomIds[i].bomId}"`;
                let bomImageRes: any = await ctx.clients.masterdata.searchDocuments({
                    dataEntity: BM,
                    fields: ['id,bomImage'],
                    schema: MAIN,
                    pagination: {
                        page: 1,
                        pageSize: 10
                    },
                    where: whereCondition
                });
                
                if(bomImageRes.length > 0){
                    bomImageObj.push({
                        id :  bomImageRes[0].id ,
                        bomImage: bomImageRes[0].bomImage
                    });
                }
            }
            //remove the first element which is empty
            bomImageObj.shift();
            //take out the duplicates
            bomImageObj = bomImageObj.filter((v:any,i:any,a:any)=>a.findIndex((v2:any)=>(JSON.stringify(v) === JSON.stringify(v2)))===i);

            ctx.body = "OK";
            ctx.status = 200;
            return bomImageObj;
        }
    } catch (error) {
        return error;
    }
}
