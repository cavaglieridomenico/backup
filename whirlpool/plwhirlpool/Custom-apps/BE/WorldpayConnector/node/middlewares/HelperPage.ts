import { readFileSync } from "fs"
import { join } from "path"

export async function HelperPage(ctx: Context, next: () => Promise<any>) {
    ctx.status = 200
    //console.log("helper")
    ctx.body =  readFileSync(join(__dirname, '..', 'utils', 'helperPage.html'), {
        encoding: 'utf8'
    })
    await next()
  }
