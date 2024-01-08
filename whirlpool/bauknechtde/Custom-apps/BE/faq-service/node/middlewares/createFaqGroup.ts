import { json } from "co-body";
import { IFaqCategories } from "../typings/Interfaces";
import { createFaqsGroup } from "../utils/groups";
export async function createFaqGroup(ctx: Context, next: () => Promise<any>) {
  try {
    let payload: IFaqCategories = await json(ctx.req)
    await createFaqsGroup(ctx, payload)
    await next()
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}

//GraphQl mutation

export const createFaqGroupResover = async (
  _: any,
  { fields }: { fields: any },
  ctx: any
) => createFaqsGroup(ctx, fields)
