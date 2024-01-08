import { createContext, useContext } from 'react'

export const OrderContext = createContext({} as Order)

export function useOrder() {
  return useContext(OrderContext)
}

export const OrderGroupContext = createContext({} as OrderGroup)

export function useOrderGroup() {
  return useContext(OrderGroupContext)
}
