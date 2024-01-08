import { json } from 'co-body';
import { getError } from './errors';

// GET -> /v1/productSpecification/:productId
// Get product specification by ID
export async function getProductSpecification(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { productId } } },
            clients: { productSpecification }  // Get needed client from context
        } = ctx;

        // Implement request using productSpecification client
        const data = await productSpecification.getProductSpecification(Number(productId));
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

//  POST -> /v1/productSpecificationUpdate/:productId
// Update product specification by ID
export async function updateProductSpecification(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            vtex: { route: { params: { productId } } },
            clients: { productSpecification }  // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using productSpecification client
        const data = await productSpecification.updateProductSpecification(Number(productId), body);
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/product-specification/append/:productId
// Append new values to product specification by ID
export async function appendProductSpecification(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            vtex: { route: { params: { productId } } },
            clients: { productSpecification }  // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Get specification id
        const specificationIds: Array<number> = body.map((element: any) => element.Id);

        // Get product specifications
        const productSpecifications = await productSpecification.getProductSpecification(Number(productId));

        for (let specificationId of specificationIds) {
            let prevValues: Array<string | number> = [];

            for (let specification of productSpecifications) {
                if (specification.Id === specificationId) {
                    prevValues = [...specification.Value];
                    break;
                }
            }
            // Append new values to old values
            body.forEach((element: any) => {
                if (element.Id === specificationId) {
                    element.Value = [...prevValues, ...element.Value];
                }
            });
        }

        // Implement request using productSpecification client
        const data = await productSpecification.updateProductSpecification(Number(productId), body);
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/productSpecification/:productId
// Create product specification
export async function createProductSpecification(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            vtex: { route: { params: { productId } } },
            clients: { productSpecification }  // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using productSpecification client
        const data = await productSpecification.createProductSpecification(Number(productId), body);
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// DELETE -> /v1/productSpecification/:productId
// Delete all product specification
export async function deleteAllProductSpecifications(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { productId } } },
            clients: { productSpecification }  // Get needed client from context
        } = ctx;

        // Implement request using productSpecification client
        const data = await productSpecification.deleteAllProductSpecifications(Number(productId));
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// DELETE -> /v1/productSpecificationDelete/:productId/:specificationId
// Delete product specification by ID
export async function deleteProductSpecification(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { productId, specificationId } } },
            clients: { productSpecification }  // Get needed client from context
        } = ctx;

        // Implement request using productSpecification client
        const data = await productSpecification.deleteProductSpecification(Number(productId), Number(specificationId));
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
