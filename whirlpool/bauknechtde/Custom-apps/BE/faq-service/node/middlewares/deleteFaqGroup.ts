import { json } from 'co-body';
import { deleteFaqGroup } from '../utils/groups'
export async function deleteFaqGroupMid(ctx: Context, next: () => Promise<any>) {
  try {
    let payload = await json(ctx.req)
    await deleteFaqGroup(ctx, payload.id)
    await next()
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


//Resolver GraphQl

export const deleteFaqGroupResolver = (
  _: any,
  { id }: { id: string },
  ctx: any
) => deleteFaqGroup(ctx, id)
