import {json} from "co-body";
import {Collection, CollectionProducts, SearchCollection} from "../utils/typing";
import {getError} from "./errors";

// GET -> /v1/get-collection/:collectionId
// Get collection by ID
export async function getCollectionById(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { collectionId } } },
            clients: { collections }
        } = ctx;

        const data: Collection = await collections.getCollectionById(Number(collectionId));
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// GET -> /v1/get-collection/getByCategoryName/:categoryName
// Get collection by Category Name
export async function getCollectionByCategoryName(ctx: Context, next: () => Promise<any>) {

    const response = async (body: any, statusCode?: number, errorMessage?: string) => {
        ctx.body = body;
        if(errorMessage) ctx.body = { "errorMessage": errorMessage };
        ctx.status = statusCode ? statusCode : 400;

        await next();
        return;
    }

    try {
        const {
            vtex: { route: { params: { categoryName } } },
            clients: { collections }
        } = ctx;

        if(!categoryName) {
            await response(null, 404, "Missing path parameter: categoryName")
        } else {
            const collection = await collections.searchCollection(`${categoryName}`)
            const passCollection = collection ? collection.items.find(el => el.name == categoryName.toString().replace('%20', ' ')) : false;

            if(passCollection){
                await response(ctx.body = (await collections.getCollectionProducts(Number(passCollection.id))).Data, 200);
            }
        }
    } catch (error) {
        await response(null, 404, "Error not defined")
    }
}

// GET -> /v1/search-collection/:searchTerm
// Search collection by searchTerm
export async function searchCollection(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { searchTerm } } },
            clients: { collections }
        } = ctx;

        const data: SearchCollection = await collections.searchCollection(searchTerm.toString());
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}


// GET -> /v1/get-collection-products/:collectionId
// Get collection's products by ID
export async function getCollectionProducts(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { collectionId } } },
            clients: { collections }
        } = ctx;

        const data: CollectionProducts = await collections.getCollectionProducts(Number(collectionId));
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}


// POST -> /v1/create-collection
// Create collection
export async function createCollection(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            clients: { collections },
            req
        } = ctx;


        const body = await json(req);

        const data: Collection = await collections.createCollection(body);

        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}


// PUT -> /v1/update-collection/:collectionId
// Update collection
export async function updateCollection(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { collectionId } } },
            clients: { collections },
            req
        } = ctx;


        const body = await json(req);

        const data: Collection = await collections.updateCollection(Number(collectionId), body);

        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
