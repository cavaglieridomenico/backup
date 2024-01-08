import React, { FC } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import GoToProfileLink from './GoToProfileLink'
import { useIntl } from 'react-intl'

const MyAccountInvoicePage: FC = ({ children }) => {
  const intl = useIntl()
  return <Route exact path="/factures" render={() =>
  <div>
    <GoToProfileLink
    label={intl.formatMessage({ id: "store/myaccount-go-back-label"})}
    />
    {children}
  </div>} />

}

export default MyAccountInvoicePage
