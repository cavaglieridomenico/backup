import { getFaq } from "../utils/FAQs";

export async function getFaqMid(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.body = await getFaq(ctx, Number(ctx.query.page), Number(ctx.query.pageSize), ctx.query.group as string, ctx.query.category as string)
    ctx.status = 200;
    await next()
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


//Resolver GraphQl

export const getFaqResolver = (
  _: any,
  { page, pageSize, group, category }: { page: number, pageSize: number, group: string, category: string },
  ctx: any
) => getFaq(ctx, page, pageSize, group, category)
