import { json } from 'co-body'
import { IbothFaqSchemas /*, IFaqCategories, IFaqQuestionGroups*/ } from '../typings/Interfaces';
import { createFirstAndSecondLevelFaq } from '../utils/categories';
export async function createFirstAndSecondLevelFaqMid(ctx: Context, next: () => Promise<any>) {
  try {
    let payload: IbothFaqSchemas = await json(ctx.req)
    if (payload.category && payload.group) {
      await createFirstAndSecondLevelFaq(ctx, payload)
      await next()
    } else {
      ctx.status = 400;
      ctx.body = 'Group or Category is missing';
    }
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


//Resolver GraphQl

export const createFaqCategoryAndGroupResover = async (
  _: any,
  { fields }: { fields: any },
  ctx: any
) => createFirstAndSecondLevelFaq(ctx, fields)
