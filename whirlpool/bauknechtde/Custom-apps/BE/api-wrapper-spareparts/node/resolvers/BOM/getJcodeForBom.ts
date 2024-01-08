import { BR, SparePartFoundType, MAIN } from "../../typings/types";

export const getJcodeForBom_resolver = async (_: any, { referenceNumber, bomId, industrialCode }: any, ctx: Context) => {

  referenceNumber = referenceNumber.toUpperCase();
  referenceNumber = referenceNumber.replace(/\s/g, '');

  let sparePartFound: SparePartFoundType[] = [];

  if (referenceNumber != "") {

    bomId = bomId.toUpperCase();

    let whereCondition = `(bomId = "${bomId}" AND industrialCode = "${industrialCode}")`;

    // check if the searchResponse exists and take the value
    try {
      let searchResponse: any = await ctx.clients.masterdata.searchDocuments({
        dataEntity: BR,
        fields: ['sparePartId', 'referenceNumber'],
        schema: MAIN,
        pagination: {
          page: 1,
          pageSize: 1000
        },
        where: whereCondition,
      })
      //Trash the doubles
      searchResponse = searchResponse.filter((v: any, i: any, a: any) => a.findIndex((v2: any) => (JSON.stringify(v) === JSON.stringify(v2))) === i);

      searchResponse.forEach((item: any) => {
        let refNumber = item.referenceNumber.replace(/\s/g, '');
        if (refNumber.includes(referenceNumber)) {
          sparePartFound.push(item);
        }
      })

      if (sparePartFound.length === 0) {
        ctx.body = "Not Found"
        ctx.status = 200;

      } else {
        ctx.body = "OK";
        ctx.status = 200;

      }

    } catch (error) {
      //console.log(error);

      return error;
    }
  }
  return sparePartFound;
}
