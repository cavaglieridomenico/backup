import { BR, MAIN } from "../../typings/types";

export const getFamilyGroup_resolver = async ( _: any, {industrialCode}: any, ctx: Context) =>{

    industrialCode = industrialCode.toUpperCase();
    let whereCondition = `industrialCode = "${industrialCode}"`;

    let familyGroupObj: FamilyGroupObJ = {
        familyGroup: []
    }

    // check if the industrialCode exists and take the bomId field
    try {
        let queryResponse: any = await ctx.clients.masterdata.searchDocuments({
            dataEntity: BR,
            fields: ['familyGroup'],
            schema: MAIN,
            pagination: {
                page: 1,
                pageSize: 1000
            },
            where: whereCondition,
        })

        if(queryResponse.length === 0){
            ctx.body = "Not Found"
            ctx.status = 200;
            return [];
        }else{

            //insert familyGroups into an array
            queryResponse.forEach((x:any) => {
                familyGroupObj.familyGroup.push(x.familyGroup);
            });
            //trash the doubles
            familyGroupObj.familyGroup = familyGroupObj.familyGroup.filter((v:any,i:any,a:any)=>a.findIndex((v2:any)=>(JSON.stringify(v) === JSON.stringify(v2)))===i);
            for( let  i = 0; i < familyGroupObj.familyGroup.length; i++){
                if ( familyGroupObj.familyGroup[i] === null) {
                    familyGroupObj.familyGroup.splice(i, 1);
                }
            }

            let otherIndex = familyGroupObj.familyGroup.indexOf("Other");
            if (otherIndex > -1){
                familyGroupObj.familyGroup.splice(otherIndex,1);
            }


            ctx.body = "OK";
            ctx.status = 200;
            return familyGroupObj;
        }

    } catch (error) {
        return error;
    }
}

type FamilyGroupObJ = {
    familyGroup: string[]
}
