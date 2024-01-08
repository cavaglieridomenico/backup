
export const getSLRegionsResolver = (
    _: any,
    { brand, country, locale, country_id }: { brand: string, country: string, locale: string, country_id: string },
    ctx: any
) => getSLRegionsMid(ctx, brand, country, locale, country_id)



const getSLRegionsMid = async (ctx: any, brand: string, country: string, locale: string, country_id: string) => {
    try {
        return await ctx.clients.sandWatch.SLRegions(brand, country, locale, country_id)
    } catch (error) {
        return
    }
}