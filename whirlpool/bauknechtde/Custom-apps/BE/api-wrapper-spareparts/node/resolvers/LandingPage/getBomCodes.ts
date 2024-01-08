import { BR, MAIN } from "../../typings/types";

export const getBomCodes_resolver = async ( _: any, {searchTerm}: any, ctx: Context) =>{

    // add * to the search tearm to be able to search a partial string
    
    let searchTermChanged = searchTerm.toUpperCase();
    searchTermChanged = searchTermChanged.replace(/\s/g, '');
    searchTermChanged = "*"+searchTermChanged+"*";
    
    searchTerm = "*"+searchTerm+"*";

    let whereCondition = `(modelNumber = "${searchTerm}" OR industrialCode = "${searchTerm}" OR originalModelNumber = "${searchTerm}" OR modelNumber = "${searchTermChanged}" OR originalModelNumber = "${searchTermChanged}")`;

    // check if the searchterm exists and take the fields associated
    try {
        let bomCodes: any = await ctx.clients.masterdata.searchDocuments({
            dataEntity: BR,
            fields: ['industrialCode', 'originalModelNumber'],
            schema: MAIN,
            pagination: {
                page: 1,
                pageSize: 1000
            },
            where: whereCondition,
            sort: "bomId ASC"
        })

        bomCodes.map((el:any) => el.modelNumber = el.originalModelNumber);

        if(bomCodes.length === 0){
            ctx.body = "Not Found"
            ctx.status = 200;
            return [];
        }else{
            bomCodes = bomCodes.filter((v:any,i:any,a:any)=>a.findIndex((v2:any)=>(JSON.stringify(v) === JSON.stringify(v2)))===i);

            ctx.body = "OK";
            ctx.status = 200;

        }
        return bomCodes;
    } catch (error) {
        return error;
    }
}
