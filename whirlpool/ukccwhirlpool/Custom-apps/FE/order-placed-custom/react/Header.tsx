import React, { FC, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useOrderForm } from 'vtex.order-manager/OrderForm'


const CSS_HANDLES = ['orderPlacedHeader']

const Header: FC = ({ children }) => {
  // calling the useOrderForm for orderform in order to update items list inside the minicart and remove them
  const { orderForm, setOrderForm  } = useOrderForm()

  useEffect(()=>{
    if(orderForm){
      let updatedOrderForm = orderForm
      updatedOrderForm.items = []
      setOrderForm(updatedOrderForm)
    }
  },[])

  const handles = useCssHandles(CSS_HANDLES)
  return <header className={handles.orderPlacedHeader}>{children}</header>
}

export default Header
