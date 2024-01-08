export async function getOrdersFilteredByRangeTime(ctx: Context, page: number = 1, dataArr: any[] = []) {
    let res = await ctx.clients.masterdata.searchDocuments({
        dataEntity: "orders",
        fields: ["_all"],
        pagination: {
            page: page,
            pageSize: 10
        },
        where: `createdIn between ${ctx.query.from.toString()} AND ${ctx.query.to.toString()}`,
        sort: `createdIn DESC`
    })
    if (res.length >= 1) {
        res.forEach((el: any) => {
            if ((ctx.query.isIncomplete == "true" && !el.isCompleted) || (ctx.query.isIncomplete == "false" && el.isCompleted)) {
                dataArr.push(el)
            }
        })
        await getOrdersFilteredByRangeTime(ctx, ++page, dataArr)
    }
    return dataArr
}
