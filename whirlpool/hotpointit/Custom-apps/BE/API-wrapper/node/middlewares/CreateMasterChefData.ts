import multiparty from "multiparty"
import { createReadStream } from 'fs'
export async function createMasterChefData(ctx: Context, next: () => Promise<any>) {
  try {
    const { file, user } = await formParser(ctx)
    //console.log(file);
    let { DocumentId } = await ctx.clients.masterdata.createOrUpdateEntireDocument({
      dataEntity: "MD",
      fields: user
    })
    await ctx.clients.vtexAPI.UploadFile(DocumentId, createReadStream(file.path), file.originalFilename)
    ctx.status = 200;
    await next()
  } catch (err) {
    //console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}
const formParser = (ctx: Context) => {
  return new Promise<any>((res, rej) => {
    let form = new multiparty.Form()
    form.parse(ctx.req, async (err: any, fields: any, files: any) => {
      if (err) rej(err);
      Object.entries(fields).forEach(([key, value]: any[]) => fields[key] = value[0])
      res({
        file: files.image[0],
        user: {
          ...fields,
          image: undefined
        }
      })
    })
  })
}
// public async UploadFile(idEntity: string, area: string, body: any, extension: string): Promise<any> {
//   const form = new FormData()
//   form.append("", body, `${idEntity}_feed_${area}.${extension}`)
//   console.log("UploadFile", form.append)
//   return this.http.post(`/api/dataentities/AT/documents/${idEntity}/file/attachments`, form, {
//     headers: form.getHeaders(),
//   })
// }
