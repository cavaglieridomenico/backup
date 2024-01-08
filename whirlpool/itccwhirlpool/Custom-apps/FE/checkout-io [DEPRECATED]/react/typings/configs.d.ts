export interface AppSettings {
	auth: AuthProperties
	googleMapsApiKey: string
	country: string
	defaultCurrencyCode: string
	defaultLocale: string
	isMultilanguage: boolean
	// typLink: string
	enableLogs: boolean
	paypalClientId: string

	// May these 2 ids be merged in a single array field??
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
