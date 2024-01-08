import { getFaqByUrl } from "../utils/FAQs";

export async function getFaqByUrlMid(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.body = await getFaqByUrl(ctx, ctx.vtex.route.params.url.toString())
    ctx.status = 200;
    await next()
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


//Resolver GraphQl

export const getFaqByUrlResolver = async (
  _: any,
  { url }: { url: string },
  ctx: any
) => getFaqByUrl(ctx, url)
