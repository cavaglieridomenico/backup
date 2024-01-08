import React, {useState} from "react"
import { useIntl } from 'react-intl'
import style from "./components/style.css"
import { closeSvgBlack } from './vectors/vectors'
import {useRuntime} from "vtex.render-runtime"
import { usePixel } from "vtex.pixel-manager"
import { MyAccountContextProvider, useMyAccount } from "./providers/myAccountContext"

interface MyAccountLogoutLinkProps {
  returnUrl: string
  label: string
  render: ([{ name, path }]: Array<{ name: string; path: string }>) => any
}

const MyAccountLogoutLinkButton: React.FC<MyAccountLogoutLinkProps> = ({
    render,
    label,
    returnUrl
  }) => {
    const intl = useIntl()
    const { push } = usePixel()
    const closeIcon = Buffer.from(closeSvgBlack).toString("base64");
    const { account } = useRuntime()
    const { hasGA4 } = useMyAccount()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const actualSection = window.location.hash

    const handleLogout = () => {
      window.sessionStorage.setItem("loggedIn", "false");
      window.sessionStorage.setItem("sid", "");
      hasGA4 ? push({event: "ga4-logout"}) : push({event: "personalArea", section: "Logout", isLogoutOk: true})
      window.location.assign(`/api/vtexid/pub/logout?scope=${account}&returnUrl=${returnUrl}`)
    }

    const handleModal = (value: boolean) => {
      value == true ? document.body.style.overflow = "hidden" : document.body.style.overflow = "scroll"
      setIsModalOpen(value)
    }

    return (
      <>
      <div className={style.logoutButton} onClick={() => handleModal(true)}>
      { render([
        {
          name: label ?? intl.formatMessage({ id: 'store/invoice-section.logout' }),
          path: actualSection,
        },
      ])}
      </div>
      <>
      {isModalOpen &&
        <div className={style.logoutModalContainer}>
        <div className={style.logoutModalWrapper}>
          <img className={style.logoutCloseImage} src={`data:image/svg+xml;base64,${closeIcon}`} alt="close icon" onClick={() => handleModal(false)}/>
          <div className={style.logoutModalTitleContainer}>
            <p className={style.logoutModalTitle}>{intl.formatMessage({ id: 'store/invoice-section.logout-modalTitle' })}</p>
          </div>
          <div className={style.logoutModalButtonsContainer}>
            <button className={style.logoutModalButtonUndo} onClick={() => handleModal(false)}>{intl.formatMessage({ id: 'store/invoice-section.logout-modalButtonUndo' })}</button>
            <button className={style.logoutModalButtonLogout} onClick={handleLogout}>{intl.formatMessage({ id: 'store/invoice-section.logout-modalButtonLogout' })}</button>
          </div>
        </div>
      </div>}
          </>
      </>

    )
  }

  const MyAccountLogoutLink: React.FC<MyAccountLogoutLinkProps> = ({
    render,
    label,
    //Use this prop from Theme to change the return Url
    returnUrl="/login"
  }) => {
    return(
      <MyAccountContextProvider>
          <MyAccountLogoutLinkButton label={label} render={render} returnUrl={returnUrl}/>
      </MyAccountContextProvider>
    )
  }

  export default MyAccountLogoutLink
