export async function isNotMP(ctx: Context | OrderEvent, next: () => Promise<any>) {
  if (!ctx.state.appSettings.vtex.isMP) {
    await next();
  } else {
    (ctx as Context).status = 403;
    ctx.body = "Forbidden Access";
  }
}

export async function isMP(ctx: Context, next: () => Promise<any>) {
  if (ctx.state.appSettings.vtex.isMP) {
    await next();
  } else {
    ctx.status = 403;
    ctx.body = "Forbidden Access";
  }
}
