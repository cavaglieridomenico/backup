import { json } from "co-body";
import { IFaqCategories } from '../typings/Interfaces'
import { updateFaqGroup } from "../utils/groups";
export async function updateFaqGroupMid(ctx: Context, next: () => Promise<any>) {
  try {
    let payload: IFaqCategories = await json(ctx.req)
    await updateFaqGroup(ctx, payload)
    await next()
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}

//GrahpQl resolver

export const updateFaqGroupResolver = (
  _: any,
  { fields }: { fields: any },
  ctx: any
) => updateFaqGroup(ctx, fields)
