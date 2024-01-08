export interface AppSettings {
	googleMapsApiKey: string
	country: string
	defaultCurrencyCode: string
	defaultLocale: string
	isMultilanguage: boolean
	paypalClientId: string
	enableLogs: boolean
	paypalConnectorId: string
	worldpayConnectorId: string
	isCC: boolean
	ccProperties: CCProperties
  multiseller?: MultiSeller
}
interface CCProperties {
  loginReturnUrl: string
}

interface MultiSeller {
  isEnabled?: boolean,
  sellers?: CategorySeller[]
}

interface CategorySeller {
  categoryId?: string,
  sellerList?: string
}
