import React, { FC, useEffect, useState } from 'react'
import { useRuntime } from "vtex.render-runtime"
import { MyAccountContextProvider, useMyAccount } from './providers/myAccountContext'
import { Route } from 'vtex.my-account-commons/Router'
import style from "./ffstyles.css"
import { ContextProvider } from './providers/context'
import GoBackButton from './components/GoBackButton'
import "./style.global.css"



const MyAccountFFPage: FC = ({ children }) => {
  const { fnFSectionUrl } = useMyAccount()

  return <Route exact path={fnFSectionUrl}
    render={() =>
      <div>
        <div className={style.FFBackButtonContainer}>
          <GoBackButton path="/" name="Back"></GoBackButton>
        </div>
        <div className={style.FFContainer}>
          {children}
        </div>
      </div>
    }
  />
}

const MyAccountCustomSection: React.FC = ({ children }) => {
  const { isFF, isVIP } = useMyAccount()
  const { culture } = useRuntime()
  const [sessionInvitations, setSessionInvitations] = useState<any>(null)
  useEffect(() => {
    if (sessionInvitations === null)
      setSessionInvitations(window?.sessionStorage?.getItem("invitations"))
  }, [])
  return (
    <MyAccountContextProvider>
      <ContextProvider>
        {
          (culture.locale == "it-IT" || culture.locale == "en-US") && !isFF && !isVIP &&
          <MyAccountFFPage>{children}</MyAccountFFPage>
        }
        {
          culture.locale != "it-IT" && culture.locale != "en-US" && sessionInvitations == 'true' && !isVIP &&
          <MyAccountFFPage> {children}</MyAccountFFPage>
        }
      </ContextProvider>
    </MyAccountContextProvider >
  )
}

export default MyAccountCustomSection
