import { AppSettings } from "../../../../../typings/configs"

export const useInvoiceFiscalCode = (appSettings: AppSettings) => {
	return appSettings && appSettings.country == "GB"
}

export const useCodiceFiscaleAzienda = (appSettings: AppSettings) => {
	return appSettings && appSettings.country == "IT"
}
