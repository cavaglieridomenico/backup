//import { IbothFaqSchemas } from "../../typings/Interfaces";
import { getAllFaqCategories } from '../utils/categories'
export async function getCategoryFaqs(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.body = await getAllFaqCategories(ctx, Number(ctx.query.page), Number(ctx.query.pageSize))
    await next()
  } catch (error) {
    console.log(error);
  }
}

//Resolver GraphQl

export const getFaqCategories = async (
  _: any,
  { page, pageSize }: { page: number, pageSize: number },
  ctx: any,
) => getAllFaqCategories(ctx, page, pageSize)
