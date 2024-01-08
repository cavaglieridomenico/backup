import { getGroupsByParentId } from '../utils/groups'
export async function getQuestionGroupByCategoryId(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.body = await getGroupsByParentId(ctx, ctx.vtex.route.params.id.toString())
    await next();
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}

//Resolver GraphQl

export const getGroupsByParentIdResolver = async (
  _: any,
  { FatherCategory }: { FatherCategory: string },
  ctx: any
) => getGroupsByParentId(ctx, FatherCategory)

