import FormData from 'form-data'
import { getError } from './errors'

// GET -> /v1/retrieveAttachment/:acronym/:documentId/:field/:fileName
// Retrieve attachment
export async function retrieveAttachment(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {
                route: {
                    params: { acronym, documentId, field, fileName },
                },
            },
            clients: { attachment }
        } = ctx;

        // Implement request using document client
        const data = await attachment.retrieveAttachment(acronym.toString(), documentId.toString(), field.toString(), fileName.toString());

        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/saveAttachment/:acronym/:documentId/:field
// Save attachment
export async function saveAttachment(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {
                route: {
                    params: { acronym, documentId, field },
                },
            },
            headers,
            req,
            clients: { attachment }
        } = ctx;

        let contentType: string = '';

        if (headers['content-type']) {
            contentType = headers['content-type'].split(' ')[1];
        }

        // Parse form data
        const body: FormData = new FormData()
        body.append('File', req);

        // Implement request using document client
        const data = await attachment.saveAttachment(acronym.toString(), documentId.toString(), field.toString(), body, contentType.toString());

        // Return response
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
