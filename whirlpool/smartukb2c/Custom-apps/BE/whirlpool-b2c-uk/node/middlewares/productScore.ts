import { getError } from "./errors";
import json from "co-body";

export async function changeProductScore(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {route: {params: {id}}},
            clients: {products},
            req
        } = ctx;
        const body = await json(req);
        const productObject = <any>await products.getProductbyID(Number(id));

        productObject['Score'] = body.score;
        const response = await products.updateProduct(Number(id), productObject);

        ctx.body = response;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
