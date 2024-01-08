
import { getGroupsAndItsFaqs } from '../utils/FAQs';
export async function getGroupsDataMid(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.body = await getGroupsAndItsFaqs(ctx, ctx.vtex.route.params.id.toString())
    await next()
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


//Resolver GraphQl

export const getGroupsDataResolver = (
  _: any,
  { categoryId }: { categoryId: string },
  ctx: any
) => getGroupsAndItsFaqs(ctx, categoryId)


