import React, { FC } from 'react'
import { Route } from 'vtex.my-account-commons/Router'

const MyAccountInvoicePage: FC = ({ children }) => {

  return <Route exact path="/factures" render={() => <>{children}</>} />

}

export default MyAccountInvoicePage