import { json } from "co-body";


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

        ctx.body = {
                message: "Product score updated: " + body.score,
                response: response
            };
        ctx.status = 200;

    } catch (error) {
        ctx.status = 500
        ctx.body = {
            message: "Error changing the product score",
            error: error
        }
    }
    await next();
}

