export const vtexCredentials: { [index: string]: { "X-VTEX-API-AppKey": string, "X-VTEX-API-AppToken": string } } = {
    "smartcsb2cqa": {
        "X-VTEX-API-AppKey": 'vtexappkey-smartcsb2cqa-MDDNZA',
        "X-VTEX-API-AppToken": 'PMZHEGPKXAVTJSCQEGMPWNMMLNTWRQETSNRUDEVRKVLOPYBJEONPMEVCAMWQMTTHVBAWBIMAKVEBBYXMLJRCCPHORPTRHEERBETNYFIWBNERAUACOKEDBREFTMEMOVTG'
    },
    "smartcsb2c": {
        "X-VTEX-API-AppKey": 'vtexappkey-smartcsb2c-ROLPZO',
        "X-VTEX-API-AppToken": 'ILHJNGTLBAOBAJZRAJFBQLSYIXEQNBDRSZTQPEUYOPPURMQVXUBDIRVXTIAPBCYZWWJAPJBWOGNBVYGWHISTAZIAEWWHDEWMQQXVDPGOSFPBEUBVBEISJFZWNIWTMUSK'
    }
}

export function checkCredentials(ctx: Context) {
    if ((ctx.header['x-vtex-account'] !== undefined && ctx.header['x-vtex-api-appkey'] !== vtexCredentials[ctx.header['x-vtex-account'].toString()]['X-VTEX-API-AppKey']) ||
        (ctx.header['x-vtex-account'] !== undefined && ctx.header['x-vtex-api-apptoken'] !== vtexCredentials[ctx.header['x-vtex-account'].toString()]['X-VTEX-API-AppToken'])) {
        ctx.status = 403;
        ctx.body = {
            'errorStatus': ctx.status,
            'errorMessage': "The endpoint is protected by credentials 'X-VTEX-API-AppKey' - 'X-VTEX-API-AppToken'"
        };
        return ctx;
    } else {
        ctx.status = 200;
        return ctx;
    }
}