
export async function checkAuthorization(ctx: Context, next: () => Promise<any> ) {
    const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);

    if (ctx.header['x-vtex-api-appkey'] == appSettings.X_VTEX_API_APPKEY && ctx.header['x-vtex-api-apptoken'] == appSettings.X_VTEX_API_APPTOKEN)
    {
        await next();
    } else {
        throw new Error("The endpoint is protected by credentials 'X-VTEX-API-AppKey' - 'X-VTEX-API-AppToken'");
    }
}
