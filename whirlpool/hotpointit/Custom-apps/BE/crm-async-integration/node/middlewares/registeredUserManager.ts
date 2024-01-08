import { json } from "co-body"
import { CustomLogger } from "../utils/Logger";
export async function registeredUserManagerMid(ctx: Context, next: () => Promise<any>) {
  ctx.vtex.logger = new CustomLogger(ctx)
  let triggeredPayload = await json(ctx.req);
  try {
    await ctx.clients.masterdata.createDocument({
      dataEntity: 'CL',
      fields: {
        email: triggeredPayload.Email,
        firstName: triggeredPayload.Name,
        lastName: triggeredPayload.Surname,
        isNewsletterOptIn: triggeredPayload.NewsLetterOptIn,
        campaign: triggeredPayload.Campaign.toUpperCase()
      },
    })
    ctx.body = 'Saved!'
    await next()
  } catch (e) {
    let user: any = await ctx.clients.masterdata.searchDocuments<any>({
      dataEntity: 'CL',
      fields: ["id", "isNewsletterOptIn"],
      pagination: {
        page: 1,
        pageSize: 1
      },
      where: `email=${triggeredPayload.Email}`
    }).then(res => res?.[0]).catch((e) => ctx.vtex.logger.error(e))
    if (user) {
      await ctx.clients.masterdata.updatePartialDocument({
        dataEntity: 'CL',
        id: user.id,
        fields: {
          isNewsletterOptIn: user.isNewsletterOptIn || triggeredPayload.NewsLetterOptIn,
          campaign: triggeredPayload.Campaign.toUpperCase()
        },
      })
      ctx.status = 200
      ctx.body = 'Has been updated'
      await next()
    } else {
      ctx.status = 500;
      ctx.body = "Internal Server Error"
      ctx.vtex.logger.error(e)
    }
  }
}
