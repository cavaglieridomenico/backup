
export async function deleteInternal(ctx: Context, next: () => Promise<any>) {

  let from = ctx.state.deleteInternalRequest!.from;

  try {

    let response = await ctx.clients.Rewriter.DeleteInternal(from);

    if (response.data.internal.delete == null) {
      ctx.status = 400;
      ctx.body = " Error deleting internal: -Internal not existent with From string => " + from
    } else {
      ctx.status = 200;
      ctx.body = {
        message: " Internal deleted: From string => " + from
      }
      await next();
    }

  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      message: "Error deleting internal: Something went wrong for From string => " + from
    }
  }
}
