export const getSLProvincesResolver = (
    _: any,
    { brand, country, locale, country_id, region }: { brand: string, country: string, locale: string, country_id: string, region: string },
    ctx: any
) => getSLProvincesMid(ctx, brand, country, locale, country_id, region)



const getSLProvincesMid = async (ctx: any, brand: string, country: string, locale: string, region: string, country_id: string) => {
    try {
        return ctx.clients.sandWatch.SLProvinces(brand, country, locale, country_id, region).then((data: any) => data).catch((err: any) => console.log(err))
    } catch (error) {
        return
    }
}