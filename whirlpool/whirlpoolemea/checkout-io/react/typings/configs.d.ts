export interface AppSettings {
	auth: AuthProperties
	googleMapsApiKey: string
	country: string
	defaultCurrencyCode: string
	defaultLocale: string
	isMultilanguage: boolean
	// typLink: string
	paypalClientId: string
	enableLogs: boolean
	paypalConnectorId: string
	worldpayConnectorId: string
	googlePayConnectorId: string
	applePayConnectorId: string
	adyenConnectorId: string
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
