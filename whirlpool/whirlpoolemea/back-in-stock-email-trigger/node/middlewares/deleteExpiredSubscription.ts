import CoBody from "co-body";
import { stringify } from "querystring";
import { deleteDocument } from "../utils/documentCRUD";
import { CustomLogger } from "../utils/Logger";

export async function deleteSubscription(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.vtex.logger = new CustomLogger(ctx);
    let req: { id: string } = await CoBody(ctx);
    deleteDocument(ctx, ctx.state.appSettings!.mdEntity, req.id)
      .catch(err => ctx.vtex.logger.error("Delete subscription for 'back in stock': " + stringify(err)))
    ctx.status = 200;
    ctx.body = "OK";
  } catch (err) {
    ctx.status = 500;
    ctx.body = "Internal Server Error";
    ctx.vtex.logger.error("Delete subscription for 'back in stock': " + stringify(err));
  }
  await next();
}
