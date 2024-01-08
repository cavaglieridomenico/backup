import { json } from "co-body"

export async function AddOptin(ctx: Context, next: () => Promise<any>) {

  let userEmail = ctx.query.email
  let user = await ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: "CL",
    fields: ['id'],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `email=${userEmail}`
  })

  let reqbody = await json(ctx.req)

  if (user.length > 0) {    

    let fields: { [index: string]: boolean } = {
      isNewsletterOptIn: reqbody.isNewsletterOptIn,//true
      isProfilingOptIn: reqbody.isNewsletterOptIn ? reqbody.isProfilingOptIn : false //profile optin can be true if optin is true only
    } 

    await ctx.clients.masterdata.updatePartialDocument({
      dataEntity: "CL",
      id: user[0]?.id,
      fields: fields
    })
    ctx.status = 200
  }
  else {
    ctx.status = 404
  }

  await next()
}
