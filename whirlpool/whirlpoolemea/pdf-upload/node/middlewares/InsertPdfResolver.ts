

//import { json } from "co-body"
import multiparty from "multiparty"
import { CustomLogger } from "../utils/CustomLogger"

export async function InsertPdfResolver(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx)
  let body: any = ctx.req
  try {
    let file: any = await getBody(body, ctx)
    ctx.body = {url:file}
    ctx.status = 200
  } catch (e) {
    ctx.vtex.logger.error(e)
    ctx.body = e
    ctx.status = 500
  }
await next()
}


function getBody (body: any, ctx : Context) {
  return new Promise((resolve, reject) => {
    let form = new multiparty.Form()
    let returnFile: any
    form.on('error', function (err) {
      reject(err);
    });
    form.on('part', async function (part) {
      if (part.filename === undefined) {
        part.resume();
      }
      if (part.filename !== undefined) {
        let result1 = await ctx.clients.masterdata.createDocument({
          dataEntity: "AT",
          fields: {
            file: '',
          },
        })
        let id = result1.DocumentId
        await ctx.clients.VtexAPI.UploadFile(id, 'file', part, 'pdf').catch((err: any) => {
          ctx.vtex.logger.error("Error saving pdf")
          ctx.vtex.logger.error(err)
        })
        let nome = `${id}_feed_file.pdf`
        returnFile = `https://${ctx.vtex.account}.myvtex.com/api/dataentities/AT/documents/${id}/file/attachments/${nome}`
        resolve(returnFile)
        part.resume();
      }

      part.on('error', function (err:any) {
        // decide what to do
        reject(err)
      });
    });
    form.on('close',  async function () {
      console.log('Read completed!', returnFile );
    });
    form.parse(body)
  })
}

