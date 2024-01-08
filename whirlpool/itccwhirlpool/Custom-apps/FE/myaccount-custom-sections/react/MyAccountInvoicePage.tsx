import React, { FC } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import  GoBackButton  from './components/GoBackButton'
// import GoToProfileLink from './GoToProfileLink'
// import { useIntl } from 'react-intl'

const MyAccountInvoicePage: FC = ({ children }) => {
  // const intl = useIntl()
  return <Route exact path="/fatture" render={() =>
  <div style={{"padding": "1rem"}}>
    {/* <GoToProfileLink
    label={intl.formatMessage({ id: "store/myaccount-go-back-label"})}
    /> */}
    <GoBackButton path="/" name="Indietro"></GoBackButton>
    {children}
  </div>} />

}

export default MyAccountInvoicePage
