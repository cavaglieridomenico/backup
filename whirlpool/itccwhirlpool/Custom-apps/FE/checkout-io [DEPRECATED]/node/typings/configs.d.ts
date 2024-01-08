export interface AppSettings {
	auth: AuthProperties
	googleMapsApiKey: string
	country: string
	defaultCurrencyCode: string
	defaultLocale: string
	isMultilanguage: boolean
	enableLogs: boolean
	paypalClientId: string
	paypalConnectorId: string
	worldpayConnectorId: string
	isCC: boolean
	ccProperties: CCProperties
}

interface AuthProperties {
	appKey: string
	appToken: string
}

interface CCProperties {
	loginReturnUrl: string
}
