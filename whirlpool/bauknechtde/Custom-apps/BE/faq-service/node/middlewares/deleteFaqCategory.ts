import { json } from 'co-body';
import { deleteFaqCategory } from '../utils/categories';
export async function deleteFaqCategoryMid(ctx: Context, next: () => Promise<any>) {
  try {
    let payload = await json(ctx.req)
    await deleteFaqCategory(ctx, payload.id)
    await next()
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


//GraphQl Mutation

export const deleteFaqCategoryResolver = (
  _: any,
  { id }: { id: string },
  ctx: any
) => deleteFaqCategory(ctx, id)


