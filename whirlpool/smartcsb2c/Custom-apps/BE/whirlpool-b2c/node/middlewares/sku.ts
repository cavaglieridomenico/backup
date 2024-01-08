import { json } from 'co-body';
import { getError } from './errors';


// SKU API //

// GET -> /v1/skuIds
// Get SKU ids
export async function getSkuIds(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            query: { page, pagesize },
            clients: { sku }  // Get needed client from context
        } = ctx;

        // Implement request using search client
        const data = await sku.getSkuIds(Number(page), Number(pagesize));
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// GET -> /v1/sku/:skuId
// Get SKU by id
export async function getSku(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { skuId } } },
            clients: { sku }  // Get needed client from context
        } = ctx;

        // Implement request using search client
        const data = await sku.getSku(Number(skuId));
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// Get the SKU of a product using its RefID
export async function getSkuByRefId(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { refId } } },
            clients: { sku }  // Get needed client from context
        } = ctx;

        // Implement request using sku client
        const data = await sku.getSkuByRefId(refId.toString());
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// GET -> /v1/skuByProductId/:productId
// Get all the SKUs of a product using its ID
export async function getSkusByProductId(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { productId } } },
            clients: { sku }  // Get needed client from context
        } = ctx;

        // Implement request using search client
        const data = await sku.getSkusByProductId(Number(productId));
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/skuCreate
// Create SKU
export async function createSku(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            clients: { sku }
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using product client
        const res = await sku.createSku(body);
        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// PUT -> /v1/sku/:skuId
// Update SKU
export async function updateSku(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { skuId } } },
            req,
            clients: { sku }
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using product client
        const res = await sku.updateSku(Number(skuId), body);
        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}



// SKU FILE API // 

// GET -> /v1/skuFile/:skuId
// Get SKU file
export async function getSkuFile(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { skuId } } },
            clients: { sku }
        } = ctx;

        // Implement request using product client
        const res = await sku.getSkuFile(Number(skuId));
        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/skuFile/:skuId
// Create SKU file
export async function createSkuFile(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { skuId } } },
            req,
            clients: { sku }
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using product client
        const res = await sku.createSkuFile(Number(skuId), body);
        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// PUT -> /v1/skuFileUpdate/:skuId/:skuFileId
// Update SKU file
export async function updateSkuFile(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { skuId, skuFileId } } },
            req,
            clients: { sku }
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using product client
        const res = await sku.updateSkuFile(Number(skuId), Number(skuFileId), body);
        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}



// SKU COMPLEMENT API //

// GET -> /v1/sku-complement/:skuId
// Get SKU complement
export async function getSkuComplementById(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { skuId } } },
            clients: { sku }
        } = ctx;

        // Implement request using product client
        const res = await sku.getSkuComplementById(Number(skuId));
        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/sku-complement
// Associate SKU attachment
export async function createSkuComplement(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            clients: { sku }
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using product client
        const res = await sku.createSkuComplement(body);
        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
