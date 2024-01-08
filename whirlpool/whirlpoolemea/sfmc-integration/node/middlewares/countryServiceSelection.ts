export async function hasDropPrice_Service(ctx: Context | DropPriceAlertContext, next: () => Promise<any>) {
  const hasDropPrice_Service = ctx.state.appSettings.o2p?.dropPrice?.hasPriceDrop;

  if (hasDropPrice_Service) {
    await next()
  } else {
    (ctx as Context).status = 405;
    (ctx as Context).body = {
      message: "DropPrice service not allowed"
    }
  }
}

export async function hasDropPriceUnsubscribe_Service(ctx: Context | StatusChangeContext, next: () => Promise<any>) {
  if (ctx.state.appSettings.o2p?.dropPrice?.hasPriceDropUnsubscribe) {
    await next();
  } else {
    (ctx as Context).status = 200;
    ctx.body = "OK";
  }
}

export async function hasReturnFlow(ctx: Context, next: () => Promise<any>) {
  if (ctx.state.appSettings.vtex.mpHasReturn) {
    await next()
  } else {
    ctx.status = 404;
    ctx.body = "Resource Not Found";
  }
}

export async function hasRefundFlow(ctx: Context, next: () => Promise<any>) {
  if (ctx.state.appSettings.vtex.mpHasRefund) {
    await next()
  } else {
    ctx.status = 404;
    ctx.body = "Resource Not Found";
  }
}

export async function hasCategoryAdvise(ctx: Context, next: () => Promise<any>) {
  if (ctx.state.appSettings.vtex.mpHasCategoryAdvice) {
    await next()
  } else {
    ctx.status = 404;
    ctx.body = "Resource Not Found";
  }
}

export async function hasProdComparison(ctx: Context, next: () => Promise<any>) {
  if (ctx.state.appSettings.vtex.mpHasProdComparison) {
    await next()
  } else {
    ctx.status = 404;
    ctx.body = "Resource Not Found";
  }
}

export async function hasBackInStock(ctx: Context | StatusChangeContext, next: () => Promise<any>) {
  if (ctx.state.appSettings.vtex.mpHasBackInStock) {
    await next()
  } else {
    (ctx as Context).status = 404;
    ctx.body = "Resource Not Found";
  }
}
