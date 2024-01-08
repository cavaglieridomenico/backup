import { APP } from '@vtex/api'
import { createHash } from 'crypto'
export const getCacheKey = (...args: (string | number)[]) => {
	return createHash("sha256").update(args.join('_')).digest("hex")
}

export const getAppSettings = async (ctx: Context) => {
	const appSettings: AppSettings | BindingBoundedAppSettings = await ctx.clients.apps.getAppSettings(APP.ID)
	if (!appSettings.bindingBounded) return appSettings as AppSettings

	const bindingSettings = (appSettings as BindingBoundedAppSettings).settings.find(settings => settings.bindingId == ctx.vtex.binding?.id)
	if (bindingSettings == undefined) throw new Error(`Unable to find settings for binding ${ctx.vtex.binding?.id}`)
	return bindingSettings
}
