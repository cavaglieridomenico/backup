import { convertToCSV } from "../commonFunctions/convertIntoCSV";
export async function getOrdersByRangeTimeMid(ctx: Context, next: () => Promise<any>) {
    try {
        const user = await ctx.clients.Vtex.GetLoggedUser(ctx.vtex.adminUserAuthToken as string).then((data) => data.user)
        ctx.vtex.logger.info(`Order report requested by user ${user}. Date range from ${ctx.query.from} to ${ctx.query.to}`)
        ctx.set("Cache-Control", "no-cache");
        ctx.status = 200;
        ctx.body = "ok"
        handleFile(ctx, user)
        await next()
    } catch (e) {
        ctx.vtex.logger.error(`Report generation ended with an error`);
        ctx.vtex.logger.debug(e);
        ctx.body = e
        ctx.status = 500
    }
}


async function handleFile(ctx: Context, user: any) {
    const body = await convertToCSV(ctx)
    if (!body) throw new Error("Failed to generate csv")

    const documentId = await ctx.clients.masterdata.createDocument({
        dataEntity: "OR",
        fields: {
            email: user,
            subject: "Order Report"
        },
    }).then((data: any) => data.DocumentId)
    await ctx.clients.Vtex.UploadFile(documentId, "file", "\ufeff" + body, "csv")
    await ctx.clients.masterdata.updatePartialDocument({
        dataEntity: "OR",
        id: documentId,
        fields: {
            triggerEmail: true
        }
    })
}