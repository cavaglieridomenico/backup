import React, { createContext, useContext, useMemo } from "react"
import { useQuery } from "react-apollo"
import { useRuntime } from "vtex.render-runtime"
import getAppSettings from "../graphql/getAppSettings.graphql"
import { AppSettings } from "../typings/configs"
import { appInfos } from "../utils/appInfo"

interface Context {
	appSettings: AppSettings
	appSettingsError: boolean
	appSettingsLoading: boolean
	refreshAppSettings: any
}

const AppSettingsContext = createContext<Context>({} as Context)

export const AppSettingsContextProvider: React.FC = ({ children }) => {
	const { production } = useRuntime()

	const {
		data,
		error,
		loading: appSettingsLoading,
		refetch: refreshAppSettings,
	} = useQuery(getAppSettings, {
		fetchPolicy: "no-cache",
		variables: {
			app: `${appInfos.vendor}.${appInfos.appName}`,
      version: appInfos.version
		},
	})

	const appSettings = JSON.parse(data?.appSettings?.message || "{}") as AppSettings
  const appSettingsError = Boolean(error);

	if (!production) {
		console.log(
			"%c APP-SETTINGS ",
			"background: purple; color: white",
			appSettings,
		)
		console.log(
			"%c AppSettingsLoading? / AppSettingsError? ",
			"background: white; color: black",
			appSettingsLoading,
			appSettingsError,
		)
	}

	const context = useMemo(
		() => ({
			appSettings,
			appSettingsError,
			appSettingsLoading,
			refreshAppSettings,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			appSettings,
			appSettingsError,
			appSettingsLoading,
			refreshAppSettings,
		],
	)

	return (
		<AppSettingsContext.Provider value={context}>{children}</AppSettingsContext.Provider>
	)
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useAppSettings = () => {
	const context = useContext(AppSettingsContext)

	if (context === undefined) {
		throw new Error("useAppSettings must be used within an AppSettingsContextProvider")
	}

	return context
}

export default { AppSettingsContextProvider, useAppSettings }
