import { json } from 'co-body';
import { getError } from './errors';

// GET -> /v1/document/:acronym/:documentId
// Get document
export async function getDocument(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {
                route: {
                    params: { acronym, documentId },
                },
            },
            clients: { document }, // Get needed client from context
        } = ctx

        // Implement request using document client
        const data = await document.getDocument(acronym.toString(), documentId.toString())

        // Return response
        ctx.body = data

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/document/:acronym
// Create document
export async function createDocument(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            vtex: {
                route: {
                    params: { acronym },
                },
            },
            clients: { document }, // Get needed client from context
        } = ctx

        // Read the data passed into the body as JSON
        const body = await json(req)

        // Implement request using productSpecification client
        const data = await document.createDocument(acronym.toString(), body)

        // Return response
        ctx.body = data

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// GET -> /v1/document/:acronym/all
// Get all documents
export async function getAllDocuments(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            query: { _fields },
            vtex: {
                route: {
                    params: { acronym },
                },
            },
            clients: { document }, // Get needed client from context
        } = ctx

        // Implement request using document client
        const data = await document.getAllDocuments(acronym.toString(), _fields.toString())

        // Return response
        ctx.body = data

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// GET -> /v1/schema/:acronym/all
// Get all schemas
export async function getAllSchemas(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {
                route: {
                    params: { acronym },
                },
            },
            clients: { document }, // Get needed client from context
        } = ctx

        // Implement request using document client
        const data = await document.getAllSchemas(acronym.toString())

        // Return response
        ctx.body = data

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/schema/:acronym/:schemaName
// Create schema
export async function createSchema(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            vtex: {
                route: {
                    params: { acronym, schemaName },
                },
            },
            clients: { document }, // Get needed client from context
        } = ctx

        // Read the data passed into the body as JSON
        const body = await json(req)

        // Implement request using document client
        const data = await document.createSchema(acronym.toString(), schemaName.toString(), body)

        // Return response
        ctx.body = data

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/document/vtable/:appName
// Create VTable app
export async function createVTableApp(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            vtex: { route: { params: { appName } } },
            query: { _schema },
            clients: { document }, // Get needed client from context
        } = ctx

        // Read the data passed into the body as JSON
        const body = await json(req)

        // Implement request using productSpecification client
        const data = await document.createVTableApp(appName.toString(), _schema.toString(), body)

        // Return response
        ctx.body = data

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}


// GET -> /v1/document/scroll/:dataEntityName
// Scroll documents
export async function scrollDocuments(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { dataEntityName } } },
            query,
            clients: { document },
        } = ctx

        // Set query
        let queryString = '';

        if (Object.keys(query).length !== 0) {
            queryString += '?';
            for (const [key, value] of Object.entries(query)) {
                queryString += `${key}=${value}&`;
            }
        }

        // Implement request using productSpecification client
        const data = await document.scrollDocuments(dataEntityName.toString(), queryString);

        // Return response
        console.log(data.headers['x-vtex-md-token'])
        ctx.body = await data.data

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

