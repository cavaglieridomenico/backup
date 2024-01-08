import React, { FC } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import  GoBackButton  from './components/GoBackButton'
import { MyAccountContextProvider, useMyAccount } from './providers/myAccountContext'
import style from "./ffstyles.css"

const MyAccountInvoicePageSection: FC = ({ children }) => {
  const {invoiceSectionUrl} = useMyAccount()
  
  return <Route exact path={invoiceSectionUrl} render={() =>
  <div className={style.invoicesBackButtonContainer}>
    <GoBackButton path="/" name="Back"></GoBackButton>
    {children}
  </div>} />
}

const MyAccountInvoicePage: FC = ({
  children
}) => {
  return(
    <MyAccountContextProvider>
        <MyAccountInvoicePageSection children={children}/>
    </MyAccountContextProvider>
  )
}

export default MyAccountInvoicePage
