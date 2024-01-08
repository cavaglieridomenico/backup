import {json} from "co-body";
import {getError} from "./errors";
import {queries} from '../resolvers'
import {TenantHeader} from "@vtex/api";
import {checkCredentials} from "../utils/credentials";

// GET -> /v1/translation/token
// Trigger Token
export async function triggerToken(ctx: Context) {
    try {
        const {
            clients: {graphqlTranslation}
        } = ctx;

        // Remove cache
        ctx.set('Cache-Control', 'no-cache');

        const triggerResponse: any = await graphqlTranslation.triggerToken();
        //console.log("Trigger Token response: " + JSON.stringify(triggerResponse));

        if (triggerResponse !== undefined && triggerResponse['data']['authorize']) {
            ctx.status = 202
        }

        // Return response
        ctx.body = triggerResponse;
        return triggerResponse;

    } catch (error) {
        getError(error, ctx);
    }
    //await next();
}

// POST -> /v1/token
// Get Token
export async function getToken(ctx: Context) {
    try {
        const {
            req,
        } = ctx;

        // Read the data passed into the body as JSON
        let body = await json(req);
        //console.log("Translation Token triggered: " + JSON.stringify(body));
        //process.env['token'] = body['token'];
        let token = body['token']
        //console.log("Token: " + token)
        await ctx.clients.graphqlTranslation.memoryCache?.set('token', token)
        //token = ctx.clients.graphqlTranslation.memoryCache?.get('token')
        //console.log("Token: " + token)

        // Return response
        ctx.body = body;
        return body;

    } catch (error) {
        getError(error, ctx);
    }
    //await next();
}

// GET -> /v1/translated/category/:id/:language
// Retrieve translated category by ID and language
export async function getCategoryTranslation(ctx: Context, next: () => Promise<any>) {
    try {
        let {
            vtex: {route: {params: {id, language}}}
        } = ctx;
        
        // Context settings
        const locale: string = language.toString().includes('-CH') ? language.toString() : language.toString() + '-CH';
        ctx.vtex.locale = locale.toString();

        const tenant: TenantHeader = {locale: 'de-CH'};
        ctx.vtex.tenant = tenant;

        // Get translated category
        const res = await queries.categoryTranslation(id.toString(), locale.toString(), ctx);

        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }

    await next();
}

// GET -> /v1/translated/product/:id/:language
// Retrieve translated product by ID and language
export async function getProductTranslation(ctx: Context, next: () => Promise<any>) {
    try {
        let {
            vtex: {route: {params: {id, language}}}
        } = ctx;

        // Context settings
        const locale: string = language.toString().includes('-CH') ? language.toString() : language.toString() + '-CH';
        ctx.vtex.locale = locale.toString();

        const tenant: TenantHeader = {locale: 'de-CH'};
        ctx.vtex.tenant = tenant;

        // Get translated category
        const res = await queries.productTranslation(id.toString(), locale.toString(), ctx);

        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }

    await next();
}

// POST -> /v1/translate/category/:language
// Translate category
export async function translateCategory(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {route: {params: {language}}},
            clients: {graphqlTranslation},
            req
        } = ctx;

        // Remove cache
        ctx.set('Cache-Control', 'no-cache');

        checkCredentials(ctx);

        if (ctx.status === 403) {
            return ctx;
        }

        // Context settings
        const locale: string = language.toString().includes('-CH') ? language.toString() : language.toString() + '-CH';
        // ctx.vtex.locale = locale.toString();
        // ctx.vtex.tenant = { locale: 'de-CH' };

        const category = await json(req);

        let res: any = null

        // Retrieve token from cache
        let token = ctx.clients.graphqlTranslation.memoryCache?.get('token')
        console.log("Token in cache: " + token)

        if (token === undefined || token.trim().length === 0) {
            token = await generateToken(ctx)
        }

        try {
            res = await graphqlTranslation.translateCategory(category, locale, token);
        } catch (error) {
            if (error['response'] !== undefined) {
                if (error['response']['status'] === 401) {
                    token = await generateToken(ctx)
                    res = await graphqlTranslation.translateCategory(category, locale, token);
                }
            } else {
                getError(error, ctx);
            }
        }

        ctx.status = 200
        ctx.body = res;
        return res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// POST -> /v1/translate/product/:language
// Translate product
export async function translateProduct(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {route: {params: {language}}},
            clients: {graphqlTranslation},
            req
        } = ctx;

        // Remove cache
        ctx.set('Cache-Control', 'no-cache');

        checkCredentials(ctx);

        if (ctx.status === 403) {
            return ctx;
        }

        const locale: string = language.toString().includes('-CH') ? language.toString() : language.toString() + '-CH';
        const product = await json(req);

        let res: any = null

        // Retrieve token from cache
        let token = ctx.clients.graphqlTranslation.memoryCache?.get('token')
        console.log("Token in cache: " + token)

        if (token === undefined || token.trim().length === 0) {
            token = await generateToken(ctx)
        }

        try {
            res = await graphqlTranslation.translateProduct(product, locale, token);
        } catch (error) {
            if (error['response'] !== undefined) {
                if (error['response']['status'] === 401) {
                    token = await generateToken(ctx)
                    res = await graphqlTranslation.translateProduct(product, locale, token);
                }
            } else {
                getError(error, ctx);
            }
        }

        ctx.status = 200
        ctx.body = res;
        return res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

async function generateToken(ctx: Context) {

    // Remove cache
    ctx.set('Cache-Control', 'no-cache');

    let token = null

    await triggerToken(ctx)

    if (ctx.status === 202) {
        //token = process.env['token']
        token = ctx.clients.graphqlTranslation.memoryCache?.get('token')
        console.log("Generated new token: " + token)
    }

    ctx.body = token
    return token;
}
