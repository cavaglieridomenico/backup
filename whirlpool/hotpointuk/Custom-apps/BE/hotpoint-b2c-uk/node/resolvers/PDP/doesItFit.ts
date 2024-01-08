export const doesItFit_resolver = async ( _: any, {sparePartId,industrialCode}: any, ctx: Context) =>{

    let outcomeFit = {
        outcome : ""
    }

    let whereCondition = `(industrialCode = "${industrialCode}" AND sparePartId = "${sparePartId}")`;
    try {
        let search: any = await ctx.clients.masterdata.searchDocuments({
            dataEntity: "BR",
            fields: ['sparePartId','industrialCode'],
            pagination: {
                page:1,
                pageSize: 10
            },
            where: whereCondition
        })
        
        
        if(search.length === 0){
            outcomeFit.outcome = "not found"
            ctx.body = "Not Found"
            ctx.status = 200;
            
        }else{
            outcomeFit.outcome = "found"
            ctx.body = "OK";
            ctx.status = 200;

        }
        return outcomeFit;
    } catch (error) {
        return error;
    }
}
