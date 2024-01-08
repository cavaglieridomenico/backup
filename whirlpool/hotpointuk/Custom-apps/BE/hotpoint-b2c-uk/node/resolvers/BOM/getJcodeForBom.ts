export const getJcodeForBom_resolver = async ( _: any, {referenceNumber,bomId,industrialCode} : any, ctx: Context) =>{
    
    referenceNumber = referenceNumber.toUpperCase();
    referenceNumber = referenceNumber.replace(/\s/g, '');
    referenceNumber = "*"+referenceNumber+"*";
    
    bomId = bomId.toUpperCase();

    let whereCondition = `(referenceNumber = "${referenceNumber}" AND bomId = "${bomId}" AND industrialCode = "${industrialCode}")`;

     // check if the sparePartId exists and take the value
    try {
        let sparePartId: any = await ctx.clients.masterdata.searchDocuments({
            dataEntity: "BR",
            fields: ['sparePartId','referenceNumber'],
            pagination: {
                page: 1,
                pageSize: 1000
            },
            where: whereCondition,
        })
        //Trash the doubles
        sparePartId= sparePartId.filter((v:any,i:any,a:any)=>a.findIndex((v2:any)=>(JSON.stringify(v) === JSON.stringify(v2)))===i);
        
        if(sparePartId.length === 0){
            ctx.body = "Not Found"
            ctx.status = 200;
            
        }else{
            ctx.body = "OK";
            ctx.status = 200;
            
        }
        return sparePartId;
    } catch (error) {
        return error;
    }
}