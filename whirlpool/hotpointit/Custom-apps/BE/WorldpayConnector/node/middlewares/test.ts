
export async function Test(ctx: Context, next: () => Promise<any>) {
  ctx.status=200
  await next()
}
