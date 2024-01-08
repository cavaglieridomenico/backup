import { json } from "co-body";
import { deleteFaq } from "../utils/FAQs";
export async function deleteFaqMid(ctx: Context, next: () => Promise<any>) {
  try {
    const payload = await json(ctx.req)
    await deleteFaq(ctx, payload.id)
    await next()
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


//Resolver GraphQl

export const deleteFaqResolver = (
  _: any,
  { id }: { id: string },
  ctx: any
) => deleteFaq(ctx, id)
