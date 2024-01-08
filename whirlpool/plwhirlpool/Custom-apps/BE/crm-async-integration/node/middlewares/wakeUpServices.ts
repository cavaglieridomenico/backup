//@ts-nocheck

import { EventContext, IOClients } from "@vtex/api";
import { CustomLogger } from "../utils/Logger";
const fetch = require('node-fetch');

export async function wakeUpServices(ctx: EventContext<IOClients>, next: () => Promise<any>) {

  console.log("Wake up")

  ctx.vtex.logger = new CustomLogger(ctx);

  fetch("http://" + ctx.vtex.account + ".myvtex.com/app/crm-async-integration/notify", { method: "POST" })
    .then(res => console.log("wake up notify - OK - status: " + res.status))
    .catch(err => ctx.vtex.logger.error("wake up notify - KO"));

  fetch("http://" + ctx.vtex.account + ".myvtex.com/app/crm-async-integration/vtex/crmbpid", { method: "POST" })
    .then(res => console.log("wake up setCrmBpId - OK - status: " + res.status))
    .catch(err => ctx.vtex.logger.error("wake up setCrmBpId - KO"));

  fetch("http://" + ctx.vtex.account + ".myvtex.com/app/crm-async-integration/vtex/user", { method: "GET" })
    .then(res => console.log("wake up getUserFromVtex - OK - status: " + res.status))
    .catch(err => ctx.vtex.logger.error("wake up getUserFromVtex - KO"));

  fetch("http://" + ctx.vtex.account + ".myvtex.com/app/crm-async-integration/crm/user", { method: "GET" })
    .then(res => console.log("wake up getUserFromCRM - OK - status: " + res.status))
    .catch(err => ctx.vtex.logger.error("wake up getUserFromCRM - KO"));

  await next();
}
