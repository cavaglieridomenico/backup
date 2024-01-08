import { json } from "co-body";
import { FAQ } from "../typings/Interfaces";
import { createFaq } from "../utils/FAQs";
export async function createFaqMid(ctx: Context, next: () => Promise<any>) {
  try {
    let payload: FAQ = await json(ctx.req)
    await createFaq(ctx, payload)
    await next()
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}

//Resolver GraphQl

export const createFaqResolver = (
  _: any,
  { fields }: { fields: any },
  ctx: any
) => createFaq(ctx, fields)
