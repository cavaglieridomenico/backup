import {uploadCatalog} from "./service";

export async function catalogSlfcUpload(
    ctx: Context,
    next: () => Promise<any>
) {
    ctx.set('Cache-Control', 'no-store')
    return uploadCatalog(ctx).then(res => {
            ctx.res.setHeader('Content-Type', 'application/json;charset=UTF-8');
            ctx.status = 200
            ctx.res.end(JSON.stringify(res))
            next()
            return ctx
        }, err => {
            ctx.res.setHeader('Content-Type', 'application/json;charset=UTF-8');
            let error = {
                status: err.response?.status != undefined ? err.response.status : 500,
                message: err.message != undefined ? err.message : "Bad Request",
                information: err.response?.data != undefined ? err.response.data : err
            }
            ctx.status = err.response?.status != undefined ? err.response.status : 500
            ctx.res.end(JSON.stringify(error))
            return ctx
        }
    )
}
