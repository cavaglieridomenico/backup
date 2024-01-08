import { PING_ENDPOINT, PING_ENDPOINT_EXPRESSION } from "../utils/constants";
import { stringify } from "../utils/functions";

export async function createCronJob(ctx: Context | InstalledContextEvent, next: () => Promise<any>) {
  try {
    const res = await ctx.clients.CronJob.createCronIfNotExists(
      PING_ENDPOINT,
      ctx.clients.CronJob.createCronBody(PING_ENDPOINT, {
        endDate: new Date(new Date().getFullYear() + 5, 0, 1, 1).toISOString(),
        expression: PING_ENDPOINT_EXPRESSION
      },
        "POST"
      ),
      ctx
    );
    res ? ctx.state.logger.info(`cron job created on ws ${ctx.vtex.workspace}`) : ctx.state.logger.info(`cron job already exists on ws ${ctx.vtex.workspace}`);
  } catch (err) {
    ctx.state.logger.error(err.msg ?? stringify(err));
    ctx.body = err.msg ?? stringify(err);
    (ctx as Context).status = 500
  }
  await next()
}