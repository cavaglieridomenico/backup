import { json } from "co-body";
import { getError } from "./errors";


// POST -> /v1/user
// Register new user
export async function registerUser(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            req,
            clients: { user }
        } = ctx;

        // Remove cache
        ctx.set('Cache-Control', 'no-cache');

        // Read the data passed into the body as JSON
        const body = await json(req);

        // Check if all required fields were filled
        if (!body['firstName'] || !body['lastName'] || !body['email'] || !body['isNewsletterOptIn']) {
            throw {
                response: {
                    status: 400,
                    data: { Message: 'Registration failed. Please fill all the required fields' }
                },
                message: 'Bad Request'
            }; 
        }

        const newUser = {
            'firstName': body['firstName'],
            'lastName': body['lastName'],
            'email': body['email'],
            'isNewsletterOptIn': body['isNewsletterOptIn']
        }

        // Implement request using user client
        const res = await user.registerUser(newUser);

        // Return response
        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// GET -> /v1/user
// Get user document id by email
export async function getUserDocumentIdByEmail(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            query: { email },
            clients: { user }
        } = ctx

        // Remove cache
        ctx.set('Cache-Control', 'no-cache');

        // Implement request using user client
        const res = await user.getUserDocumentIdByEmail(email.toString());

        // Return response
        ctx.body = res.data[0];

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
