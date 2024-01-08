
export async function ping(ctx: Context, next: () => Promise<any>) {
  ctx.status = 200;
  ctx.body = "OK";
  ctx.state.logger.debug(`Ping ${(new Date()).toISOString()}`);
  console.info(`ping ${Date.now()}`)
  await next();
}
