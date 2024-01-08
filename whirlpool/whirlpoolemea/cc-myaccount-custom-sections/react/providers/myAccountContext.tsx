import React, { createContext, useContext, useMemo, useEffect, useState } from 'react'
import { useQuery } from "react-apollo";
import getAppSettings from "../graphql/settings.graphql";
import { appInfos } from '../utils/appInfos';
import { useRuntime } from "vtex.render-runtime";
import type {AppSettings} from "../typings/appSettings"

interface MyAccountContextProps {
    settings: AppSettings
    isEPP: boolean
    isFF: boolean
    isVIP: boolean
    profileSectionUrl: string
    fnFSectionUrl: string
    invoiceSectionUrl: string
    hasGA4: boolean
}

const MyAccountContext = createContext<MyAccountContextProps>({} as MyAccountContextProps)

export const MyAccountContextProvider: React.FC = ({ children }) => {

  const [hasGA4, setHasGa4] = useState<boolean>(false)

    const { data } = useQuery(getAppSettings, {
        ssr: false,
        variables: {
            app: `${appInfos.vendor}.${appInfos.appName}`,
            version: appInfos.version,
        },
      });
    
      useEffect(() => {
        if (!data) {
          return;
        }
      }, [data]);
    
      const settings: AppSettings = data && JSON.parse(data?.appSettings?.message); 
  
    const {
    binding
  } = useRuntime();

  //Bindings Checks
  const isEPP = binding?.id == settings?.EPP_bindingId
  const isFF = binding?.id == settings?.FF_bindingId
  const isVIP = binding?.id == settings?.VIP_bindingId
  
  //Section links
  const profileSectionUrl = settings?.ProfileSectionUrl || '/profile'
  const fnFSectionUrl = settings?.FnFSectionUrl || '/friends'
  const invoiceSectionUrl = settings?.InvoiceSectionUrl || '/invoices'

  //GA4
  useEffect(() => {
    if(settings) setHasGa4(settings.hasGA4)
  }, [settings])


  const context = useMemo(
    () => ({
        settings,
        isEPP,
        isFF,
        isVIP,
        profileSectionUrl,
        fnFSectionUrl,
        invoiceSectionUrl,
        hasGA4
    }),
    [
        settings, 
        isEPP,
        isFF,
        isVIP,
        profileSectionUrl,
        fnFSectionUrl,
        invoiceSectionUrl,
        hasGA4
    ]
  )

  return (
    <MyAccountContext.Provider value={context}>{children}</MyAccountContext.Provider>
  )
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useMyAccount = () => {
  const context = useContext(MyAccountContext)

  if (context === undefined) {
    throw new Error('Error, context is not defined')
  }

  return context
}

export default { MyAccountContextProvider, useMyAccount }
