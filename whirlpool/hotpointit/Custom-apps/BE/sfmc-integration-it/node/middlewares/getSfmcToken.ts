import { EventContext } from "@vtex/api"

export async function GetSfmcToken({ state, clients: { SfmcAPI, apps }, vtex: { logger } }: EventContext<any> | Context,  next: () => Promise<any>) {
  let { settings } = state

  if (settings != null){
    settings = await apps.getAppSettings('' + process.env.VTEX_APP_ID)
    state.settings = settings;
  }
  //controllo che se settings non è definito me lo devo andare a prendere
  try {
    const response = await SfmcAPI.getTokenV2(settings)
    state.sfmcToken = response.access_token
  } catch (err) {
    logger.error('[GetSfmcToken] - Error getting token from SFMC')
    logger.debug(err?.response || err)
  }
  await next()
}

