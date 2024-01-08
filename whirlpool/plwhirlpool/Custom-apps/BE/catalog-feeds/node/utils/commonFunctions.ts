import { APP, EventContext, IOClients } from "@vtex/api"
import { AppSettings } from "../typings/configs"

export const GetAppSettings = async (ctx: Context | EventContext<IOClients>) => {
  if (ctx.state.settings != undefined) return ctx.state.settings

  const settings: AppSettings = await ctx.clients.apps.getAppSettings(APP.ID)
  ctx.state.settings = settings
  return settings
}

export const FormatDate = (date = new Date()) => `${date.toISOString().split("T")[0]} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`

export const FormatPrice = (price: number | string) => (+price).toFixed(2).replace('.', ',')

export const ConvertToMillis = (time: number, unit: 'seconds' | 'minutes' | 'hours' | 'days') => {
  switch (unit) {
    case 'days':
      time *= 24
    case 'hours':
      time *= 60
    case 'minutes':
      time *= 60
    case 'seconds':
      time *= 1000
  }
  return time
}
