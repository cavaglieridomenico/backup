import { json } from "co-body";
import { getError } from "./errors";

// PUT -> /v1/inventory/skus/:skuId/warehouses/:warehouseId
// Update invetory
export async function updateInventory(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            vtex: { route: { params: { skuId, warehouseId } } },
            clients: { inventory }
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);

        // Implement request using product client
        const res = await inventory.updateInventory(skuId.toString(), warehouseId.toString(), body);

        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
