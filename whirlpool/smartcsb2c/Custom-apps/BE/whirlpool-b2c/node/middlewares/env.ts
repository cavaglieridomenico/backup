export async function setEnv(ctx: Context, next: () => Promise<any>) {
    if (process.env.SETTINGS === undefined) {
        // Get ENVs
        const appSettings = await ctx.clients.apps.getAppSettings(`${process.env.VTEX_APP_ID}`);
        // Set ENVs
        process.env.SETTINGS = JSON.stringify(appSettings);
        //console.log('SETTINGS', process.env.SETTINGS);
    }

    await next();
}  
