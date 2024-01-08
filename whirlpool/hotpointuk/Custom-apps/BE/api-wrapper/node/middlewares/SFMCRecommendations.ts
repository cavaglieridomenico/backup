export async function SFMCRecommend(ctx: Context, next: () => Promise<any>) {

  ctx.body = await ctx.clients.SFMC.Recommendations(ctx.query.email as string);
  ctx.set("Cache-Control", "no-store")
  ctx.status=200
  await next()
}
