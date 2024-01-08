import { json } from 'co-body';
import { getError } from './errors';

// GET -> /v1/products/:id
// Get product by ID
export async function getProduct(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { id } } },  // Get "id" param in URL from context
            clients: { products },   // Get needed client from context
        } = ctx;

        // Implement request using product client
        const res = await products.getProductbyID(Number(id));
        // Send response containing the data from API
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// GET -> /v1/product/:id
// Get product by ID through Search API
export async function getProductById(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { productId } } },  // Get "id" param in URL from context
            clients: { search },   // Get needed client from context
        } = ctx;

        // Implement request using product client
        const res = await search.searchProductById(productId.toString());
        // Send response containing the data from API
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/products
// Create new product
export async function createProduct(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,  // Get body of the request, i.e. the new product info
            clients: { products }   // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using product client
        const res = await products.createProduct(body);
        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// PUT -> /v1/products/:id
// Update product
export async function updateProduct(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,    // Get body of the request, i.e. the new product info to be updated
            vtex: { route: { params: { id } } },  // Get "id" param in URL from context
            clients: { products }  // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using product client
        const res = await products.updateProduct(Number(id), body);
        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
