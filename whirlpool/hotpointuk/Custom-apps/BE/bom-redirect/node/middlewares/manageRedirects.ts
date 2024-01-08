import { json } from "co-body"
import { RequestRedirect } from "../typings/request"
import { Authentication } from "../utils/Authentication"
import { DATA_ENTITY} from "../utils/constants"

export async function ManageRedirects(ctx: Context, next: () => Promise<any>) {

  await Authentication(ctx);
  let request: RequestRedirect = await json(ctx.req);
  await ManageRequest(ctx, request);
  ctx.status = 200;
  await next();
}

const ManageRequest = async (ctx: Context, request: RequestRedirect) => {

  //Check if the record already exist in entity

  let whereCondition = `bomId="${request.bomId}" AND industrialCode="${request.industrialCode}" AND sparePartId="${request.sparePartId}"`


  try {
    let getRecord: any = await ctx.clients.masterdata.searchDocuments({
      dataEntity: DATA_ENTITY,
      fields: ['id', 'bomId', 'categoryId', 'categoryName', 'familyGroup', 'fCode', 'industrialCode',
                'modelNumber', 'referenceNumber', 'originalModelNumber', 'sparePartId', 'spareSkuId',
                'twelveNc'],
      pagination: {
          page: 1,
          pageSize: 15
      },
      where: whereCondition,
    })

    if(getRecord.length > 0){

      let record = {
        bomId: getRecord[0].bomId,
        categoryId: getRecord[0].categoryId,
        categoryName: getRecord[0].categoryName,
        familyGroup: getRecord[0].familyGroup,
        fCode: getRecord[0].fCode,
        industrialCode: getRecord[0].industrialCode,
        modelNumber: getRecord[0].modelNumber,
        originalModelNumber: getRecord[0].originalModelNumber,
        referenceNumber: getRecord[0].referenceNumber,
        sparePartId: getRecord[0].sparePartId,
        spareSkuId: getRecord[0].spareSkuId,
        twelveNc: getRecord[0].twelveNc

      };
      let document:RequestRedirect = record

      if(JSON.stringify(document) != JSON.stringify(request)){

        //UPDATE bom document if the record already exists
        await ctx.clients.masterdata.updateEntireDocument({
          dataEntity:DATA_ENTITY,
          id: getRecord[0].id,
          fields:{
            bomId: request.bomId,
            categoryId: request.categoryId,
            categoryName: request.categoryName,
            familyGroup: request.familyGroup,
            fCode: request.fCode,
            industrialCode: request.industrialCode,
            modelNumber: request.modelNumber,
            originalModelNumber: request.originalModelNumber,
            referenceNumber: request.referenceNumber,
            sparePartId: request.sparePartId,
            spareSkuId: request.spareSkuId,
            twelveNc: request.twelveNc
          }
        })

        ctx.body = "RECORD updated"

      }
      else{
        ctx.body = " There is nothing to update"
      }
    }else{

      //if bom record is not found and we need to create a new document
      await ctx.clients.masterdata.createDocument({
        dataEntity:"BR",
        fields: {
          bomId: request.bomId,
          categoryId: request.categoryId,
          categoryName: request.categoryName,
          familyGroup: request.familyGroup,
          fCode: request.fCode,
          industrialCode: request.industrialCode,
          modelNumber: request.modelNumber,
          originalModelNumber: request.originalModelNumber,
          referenceNumber: request.referenceNumber,
          sparePartId: request.sparePartId,
          spareSkuId: request.spareSkuId,
          twelveNc: request.twelveNc
        }
      })

      ctx.body = "RECORD created";
      ctx.status = 200;

    }

  } catch (error) {
    ctx.body = "Error inside try catch";
    ctx.status = 400;
  }

}
