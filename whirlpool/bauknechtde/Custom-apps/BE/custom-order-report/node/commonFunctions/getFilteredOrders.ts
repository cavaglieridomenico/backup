export async function scrollDocuments(ctx: Context, dataEntity: string, fields: string[], token: string | undefined = undefined, size: number = 1000): Promise<any[]> {
    const response: any = await ctx.clients.masterdata.scrollDocuments<any>({ dataEntity: dataEntity, fields: fields, mdToken: token, size: size, where: `createdIn between ${ctx.query.from.toString()} AND ${ctx.query.to.toString()}`, sort: `createdIn DESC` })
    const { data, mdToken }: { data: any[], mdToken: string } = response
    const filteredData = data.filter(order => !order.id.startsWith("00") && ((ctx.query.isIncomplete == "true" && !order.isCompleted) || (ctx.query.isIncomplete == "false" && order.isCompleted)))
    if (data.length < size) return filteredData
    return filteredData.concat(await scrollDocuments(ctx, dataEntity, fields, mdToken, size))
}