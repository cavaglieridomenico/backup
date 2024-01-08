//@ts-nocheck
import { createContext, useContext } from 'react'

export const OrderContext = createContext({} as Order)

export function useOrder() {
  if(window){
    window.orderDetails = useContext(OrderContext);
  }
  return useContext(OrderContext)
}
