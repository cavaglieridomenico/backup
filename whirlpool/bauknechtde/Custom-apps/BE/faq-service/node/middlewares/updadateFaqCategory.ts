import { json } from "co-body";
import { IFaqCategories } from '../typings/Interfaces'
import { updateFaqCategory } from "../utils/categories";
export async function updateFaqCategoryMid(ctx: Context, next: () => Promise<any>) {
  try {
    let payload: IFaqCategories = await json(ctx.req)
    await updateFaqCategory(ctx, payload)
    await next()
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}

//Resolver GraphQl

export const updateFaqCategoryResolver = (
  _: any,
  { fields }: { fields: any },
  ctx: any
) => updateFaqCategory(ctx, fields)
