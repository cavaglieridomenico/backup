import { json } from "co-body";
import { updateFaq } from "../utils/FAQs";
export async function updateFaqMid(ctx: Context, next: () => Promise<any>) {
  try {
    let payload = await json(ctx.req)
    await updateFaq(ctx, payload)
    await next()
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


//Resolver GraphQl

export const updateFaqResolver = (
  _: any,
  { fields }: { fields: any },
  ctx: any
) => updateFaq(ctx, fields)
