import { searchFaq } from "../utils/FAQs";

export async function searchFaqMid(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.body = await searchFaq(ctx, Number(ctx.query.page), Number(ctx.query.pageSize), ctx.query.keyword as string)
    ctx.status = 200;
    await next()
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


//Resolver GraphQl

export const searchFaqResolver = (
  _: any,
  { page, pageSize, keyword }: { page: number, pageSize: number, keyword: string},
  ctx: any
) => searchFaq(ctx, page, pageSize, keyword)
