import type { EventContext } from '@vtex/api'

import type { Clients } from '../clients'
import { CRON_JOB_RETRIEVE_ORDERS_FROM_FEED_ENDPOINT, CRON_JOB_RETRIEVE_ORDERS_FROM_FEED_INTERVAL } from '../utils/constants';
import { CustomLogger } from '../utils/CustomLogger';
import { stringify } from '../utils/functions';

export async function onAppInstalledEvent(ctx: EventContext<Clients>) {
  let logger = new CustomLogger(ctx);
  ctx.vtex.logger = logger

  ctx.vtex.logger.debug(`Installed event received`)

  try {
    const cronHasBeenCreated = await ctx.clients.CronJob.createCronIfNotExists(
      CRON_JOB_RETRIEVE_ORDERS_FROM_FEED_ENDPOINT,
      ctx.clients.CronJob.createCronBody(CRON_JOB_RETRIEVE_ORDERS_FROM_FEED_ENDPOINT, {
        endDate: new Date(new Date().getFullYear() + 2, 0, 1, 1).toISOString(),
        expression: CRON_JOB_RETRIEVE_ORDERS_FROM_FEED_INTERVAL
      },
        "POST"
      )
    );
    ctx.vtex.logger.info(`cron job ${cronHasBeenCreated ? "created" : "already exists "} on ws ${ctx.vtex.workspace}`)
  } catch (err) {
    ctx.vtex.logger.error(err.msg ?? stringify(err));
  }

  return true
}