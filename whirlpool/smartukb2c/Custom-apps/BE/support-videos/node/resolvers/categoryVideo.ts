import { CATEGORYVIDEOS_ENTITY } from "../utils/constants";
import { CustomLogger } from "../utils/Logger";

export const categoryVideos_resolver = async ( _: any, {productId}: any, ctx: Context) => {
  ctx.vtex.logger = new CustomLogger(ctx);
  let categoryTree = await ctx.clients.vtexAPI.getCategoryIdByProductId(productId);
  categoryTree = categoryTree.substring(1, categoryTree.length - 1);
  //console.log("categoryTree = " + categoryTree);
  let whereCondition = categoryTree.split('/').map((el: string) => "categoryId=" + el).join(' OR ');
  //console.log("wherecondition = " + whereCondition);
    
  let urls: any = await ctx.clients.masterdata.searchDocuments({
    dataEntity: CATEGORYVIDEOS_ENTITY,
    fields: ['video'],
    where: whereCondition,
    pagination: {
      page: 1,
      pageSize: 10
    }   
  });
  ctx.body = "OK";
  ctx.status = 200;
  ctx.vtex.logger.info(`GraphQL query to url-videos OK --data: ${JSON.stringify(urls)}`);
  return urls;
}

