import React, { FC } from 'react'
import { Route } from 'vtex.my-account-commons/Router'
import style from "./ffstyles.css"
import { ContextProvider } from './providers/context'
import GoToProfileLink from './GoToProfileLink'
import { useIntl } from 'react-intl'

const MyAccountFFPage: FC = ({ children }) => {
  const intl = useIntl()
  return <Route exact path="/friends" render={() =>
  <div>
    <GoToProfileLink
    label={intl.formatMessage({ id: "store/myaccount-go-back-label"})}
    />
    <div  className={style.FFContainer}>
    {children}
    </div>
    </div>} />

}

const MyAccountCustomSection: React.FC = ({children}) => {
  return(
    <ContextProvider>
      <MyAccountFFPage>{children}</MyAccountFFPage>
    </ContextProvider>
  )
}

export default MyAccountCustomSection
