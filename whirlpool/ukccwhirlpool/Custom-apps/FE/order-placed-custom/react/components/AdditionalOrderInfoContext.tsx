import { createContext, useContext } from 'react'

export const AdditionalOrderInfoContext = createContext({} as AdditionalOrderInfo)

export function useAdditionalOrderInfo() {
  return useContext(AdditionalOrderInfoContext)
}
