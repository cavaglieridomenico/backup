import { json } from "co-body";
import { ICat } from "../typings/Interfaces";
import { createCategory } from "../utils/categories";

export async function createCategoryMid(ctx: Context, next: () => Promise<any>) {
  try {
    const payload: ICat = await json(ctx.req)
    await createCategory(ctx, payload)
    await next()
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


//GaphQl resolver

export const createCategoryResolver = (
  _: any,
  { fields }: { fields: any },
  ctx: any
) => createCategory(ctx, fields)
