import { getError } from "./errors";

// Init token
let token: {
    access_token: string,
    old_time: number
}
// Init token credentials
let input = {
    grant_type: 'client_credentials',
    client_id: '',
    client_secret: '',
}

// Function to get the client's specifications
const getClient = (brand: string) => {
    // Define token credentials based on brand
    let client_id: string = '';
    let client_secret: string = '';
    if (process.env.TEST) {
        if (brand === 'whirlpool') {
            client_id = JSON.parse(process.env.TEST).WHIRLPOOL_CLIENT_ID;
            client_secret = JSON.parse(process.env.TEST).WHIRLPOOL_CLIENT_SECRET;
        } else if (brand === 'bauknecht') {
            client_id = JSON.parse(process.env.TEST).BAUKNECHT_CLIENT_ID;
            client_secret = JSON.parse(process.env.TEST).BAUKNECHT_CLIENT_SECRET;
        } else if (brand === 'hotpoint') {
            client_id = JSON.parse(process.env.TEST).HOTPOINT_CLIENT_ID;
            client_secret = JSON.parse(process.env.TEST).HOTPOINT_CLIENT_SECRET;
        } else if (brand === 'indesit') {
            client_id = JSON.parse(process.env.TEST).INDESIT_CLIENT_ID;
            client_secret = JSON.parse(process.env.TEST).INDESIT_CLIENT_SECRET;
        }
    }
    return { client_id, client_secret };
}


// Gets the token from salesforce
export async function getToken(ctx: Context, brand: string) {
    // Define token credentials based on brand
    const { client_id, client_secret } = getClient(brand);

    // Check if the token is still valid
    if (token === undefined || token.access_token === undefined || token.old_time === undefined || token.old_time < Number(new Date()) || input.client_id !== client_id || input.client_secret !== client_secret) {
        try {
            // Get token credentials based on brand
            input.client_id = client_id;
            input.client_secret = client_secret;

            // Get token and extract access_token
            let tokenResponse = await ctx.clients.sfmcAPI.getToken(input);
            const access_token: string = JSON.parse(JSON.stringify(tokenResponse)).access_token

            // Update token
            token = {
                access_token,
                old_time: (Number(new Date()) + 1080000)
            }

            return token;

        } catch (error) {
            console.log('************* Error Token **************');
            getError(error, ctx);
            return token;
        }
    } else {
        return token;
    }

}
