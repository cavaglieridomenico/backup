import { GetLoggedUserEmail } from "../utils/commonFunctions"

export async function GetUserInfo(ctx: Context, next: () => Promise<any>) {
  const loggedUser = await GetLoggedUserEmail(ctx)

  if (loggedUser) {
    ctx.body = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "CL",
      fields: ['id','isNewsletterOptIn','isProfilingOptIn','gender'],
      pagination: {
        page: 1,
        pageSize: 1
      },
      where: `email=${loggedUser.userId}`
    })
  } else {
    ctx.body = []
  }
  ctx.set("Cache-Control", "no-store")
  ctx.status = 200
  await next()
}

export async function GetUserInfoByEmail(ctx: Context, next: () => Promise<any>) {

  try {
    ctx.body = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "CL",
      fields: ['email', 'isNewsletterOptIn','isProfilingOptIn'],
      pagination: {
        page: 1,
        pageSize: 1
      },
      where: `email=${ctx.query.email}`
    })
  }
  catch (err) {
    console.log(err)
    ctx.body = []
  }
  ctx.set("Cache-Control", "no-store")
  ctx.status = 200
  await next()
}

export async function getUserData(ctx: Context, body: any) {
  try {
    body = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "CL",
      fields: ['firstName', 'lastName', 'homePhone'],
      pagination: {
        page: 1,
        pageSize: 1
      },
      where: `email=${body}`
    })
  }
  catch (err) {
    console.log(err);
    body = [];
  }
  return body;
}

export async function getUserShippingData(ctx: Context, body: any) {
  try {
    body = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "AD",
      fields: ['addressName', 'city', 'complement', 'country', 'neighborhood', 'number', 'postalCode', 'receiverName', 'reference', 'state', 'street'],
      pagination: {
        page: 1,
        pageSize: 1
      },
      where: `addressName=${body}`
    })
  }
  catch (err) {
    console.log(err);
    body = [];
  }
  return body;
}
