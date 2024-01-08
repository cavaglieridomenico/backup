import { json } from 'co-body';
import { getError } from './errors';

// SPECIFICATION
// POST -> /v1/specification
// Create new specification
export async function createSpecification(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            clients: { specification }  // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using skuSpecification client
        const data = await specification.createSpecification(body);
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// SPECIFICATION FIELD
// POST -> /v1/specificationField
// Create new specification field
export async function createSpecificationField(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            clients: { specification }  // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using skuSpecification client
        const data = await specification.createSpecificationField(body);
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// SPECIFICATION FIELD VALUE
// POST -> /v1/specificationFieldValue
// Create new specification field value
export async function createSpecificationFieldValue(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            clients: { specification }  // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using skuSpecification client
        const data = await specification.createSpecificationFieldValue(body);
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// SPECIFICATION GROUP
// POST -> /v1/specificationGroup
// Create new specification group
export async function createSpecificationGroup(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            clients: { specification }  // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using skuSpecification client
        const data = await specification.createSpecificationGroup(body);
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// PUT -> /v1/specificationGroup/:groupId
// Update new specification group
export async function updateSpecificationGroup(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            vtex: { route: { params: { groupId } } },
            clients: { specification }  // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using skuSpecification client
        const data = await specification.updateSpecificationGroup(groupId.toString(), body);
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// SPECIFICATION VALUE
// POST -> /v1/specificationValue
// Create new specification value
export async function createSpecificationValue(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            clients: { specification }  // Get needed client from context
        } = ctx;

        // Read the data passed into the body as JSON
        const body = await json(req);
        // Implement request using skuSpecification client
        const data = await specification.createSpecificationValue(body);
        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
