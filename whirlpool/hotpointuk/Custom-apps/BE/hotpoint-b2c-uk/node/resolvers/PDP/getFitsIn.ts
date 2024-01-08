export const getFitsIn_resolver = async ( _: any, {sparePartId}: any, ctx: Context) =>{
    
    let whereCondition = `sparePartId= "${sparePartId}"`;

    try {
        let fieldsForJcode: any = await ctx.clients.masterdata.searchDocuments({
            dataEntity: "BR",
            fields: ['originalModelNumber','industrialCode','categoryName'],
            pagination: {
                page: 1,
                pageSize: 1000
            },
            where: whereCondition
        })
        fieldsForJcode.map((el:any) => el.modelNumber = el.originalModelNumber);

        if(fieldsForJcode.length === 0){
            ctx.body = "Not Found"
            ctx.status = 200;
            
        }else{
            //Trash the doubles
            fieldsForJcode= fieldsForJcode.filter((v:any,i:any,a:any)=>a.findIndex((v2:any)=>(JSON.stringify(v) === JSON.stringify(v2)))===i);
            
            ctx.body = "OK";
            ctx.status = 200;
        }
        return fieldsForJcode;
    } catch (error) {
        return error;
    }
}

