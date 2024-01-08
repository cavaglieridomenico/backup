
export const getSLServicesResolver = (
    _: any,
    { brand, country, locale, country_id, province, region, city }: { brand: string, country: string, locale: string, country_id: string, province: string, region: string, city: string },
    ctx: any
) => getSLServicesMid(ctx, brand, country, locale, country_id, province, region, city)



const getSLServicesMid = async (ctx: any, brand: string, country: string, locale: string, country_id: string, province: string, region: string, city: string) => {
    try {
        return await ctx.clients.sandWatch.SLServices(brand, country, locale, country_id, province, region, city)
    } catch (error) {
        return
    }
}