export async function CheckCredentials(ctx: Context, next: () => Promise<any>) {
  console.log("🚀 ~ file: validate.ts:27 ~ CheckCredentials ~ ctx.header.authorization:", ctx.header.authorization)

  if (ctx.header.authorization && ctx.header.authorization.indexOf('Basic ') !== -1) {
    const base64Credentials = ctx.header.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')
    console.log("🚀 ~ file: validate.ts:8 ~ CheckCredentials ~ password:", password)
    console.log("🚀 ~ file: validate.ts:8 ~ CheckCredentials ~ username:", username)

    if (username !== ctx.state.settings.basicAuthUsername || password !== ctx.state.settings.basicAuthPassword) {
      ctx.status = 401;
      ctx.body = 'Invalid Credentials'
    } else await next();

  } else {
    ctx.status = 401;
    ctx.body = 'Missing Authhorization Header'
  }
}