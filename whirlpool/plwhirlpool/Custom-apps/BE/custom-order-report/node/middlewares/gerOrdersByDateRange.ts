import { convertIntoCSV } from "../commonFunctions/convertIntoCSV";
export async function getOrdersByRangeTimeMid(ctx: Context, next: () => Promise<any>) {
    try {
        const user = await ctx.clients.AuthUser.GetLoggedUser(ctx.vtex.adminUserAuthToken as string).then((data) => data.user)
        ctx.set("Cache-Control", "no-cache");
        let body = await convertIntoCSV(ctx)
        const documentId = await ctx.clients.masterdata.createDocument({
            dataEntity: "OR",
            fields: {
                email: user,
                subject: "Order Report"
            },
        }).then((data: any) => data.DocumentId)
        await ctx.clients.AuthUser.UploadFile(documentId, "file", "\ufeff" + body, "csv").then(() => {
            ctx.status = 200;
            ctx.body = "ok"
        }), (err: any) => {
            console.log(err);
        }

        await next()
    } catch (e) {
        ctx.body = e
        ctx.status = 500
        console.log(e);
    }
}

