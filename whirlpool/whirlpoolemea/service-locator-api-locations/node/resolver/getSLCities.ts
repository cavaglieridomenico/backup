export const getSLCitiesResolver = (
    _: any,
    { brand, country, locale, country_id, province, region }: { brand: string, country: string, locale: string, country_id: string, province: string, region: string },
    ctx: any
) => getSLCitiesMid(ctx, brand, country, locale, country_id, province, region)



const getSLCitiesMid = (ctx: any, brand: string, country: string, locale: string, country_id: string, province: string, region: string) => {
    try {
        return ctx.clients.sandWatch.SLCities(brand, country, locale, country_id, province, region).then((data: any) => data).catch((err: any) => console.log(err.response.config.data))
    } catch (error) {
        return
    }
}