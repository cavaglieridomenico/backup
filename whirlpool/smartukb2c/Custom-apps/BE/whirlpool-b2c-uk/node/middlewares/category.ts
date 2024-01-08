import { json } from 'co-body'
import { getError } from "./errors"
import { CategoryTreeResponse } from "@vtex/clients/build"
import { Category } from '../utils/typing';

// GET -> /v1/category/:categoryId
// Get category by ID
export async function getCategoryById(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { categoryId } } },
            clients: { category }
        } = ctx

        // Implement request using search client
        const data: Category = await category.getCategoryById(categoryId.toString());

        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/category
// Create category
export async function createCategory(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            clients: { category }
        } = ctx

        // Read the data passed into the body as JSON
        const body: Category = await json(req);

        // Implement request using product client
        const res: Category | void = await category.createCategory(body);

        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}


// PUT -> /v1/category/:categoryId
// Update category
export async function updateCategory(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            vtex: { route: { params: { categoryId } } },
            clients: { category }
        } = ctx

        // Read the data passed into the body as JSON
        const body: Category = await json(req);

        // Implement request using product client
        const res: Category | void = await category.updateCategory(categoryId.toString(), body);

        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
        console.log(error)
    }
    await next();
}

// GET -> NONE
// Get category tree
export async function getCategoryTree(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { categoryLevels } } },
            clients: { category }
        } = ctx

        // Implement request using search client
        const data: CategoryTreeResponse[] = await category.getCategoryTree(categoryLevels.toString());

        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
