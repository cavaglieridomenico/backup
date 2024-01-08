import React, {useState,useRef,useEffect} from "react"
import { useIntl } from 'react-intl'
import style from "./components/style.css"
import { closeSvgBlack } from './vectors/vectors'
import {useRuntime} from "vtex.render-runtime"
import { usePixel } from "vtex.pixel-manager"

interface WindowGTM extends Window {
  dataLayer: any[];
}
interface MyAccountLogoutLinkProps {
  returnUrl: string
  label: string
  render: ([{ name, path }]: Array<{ name: string; path: string }>) => any
}

const MyAccountLogoutLink: React.FC<MyAccountLogoutLinkProps> = ({
    render,
    label,
    //Use this prop from Theme to change the return Url
    returnUrl="/login"
  }) => {
    const intl = useIntl()
    const {push} = usePixel()
    const closeIcon = Buffer.from(closeSvgBlack).toString("base64");
    const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];
    const {account} = useRuntime()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const actualSection = window.location.hash

    //GA4FUNREQ60
    const analyticsPopupWrapper: any = useRef(null);
    useEffect(() => {
      if (isModalOpen && analyticsPopupWrapper) {
        const ga4Data = {
          event: "popup",
          popupId: analyticsPopupWrapper.current.id,
        };
        push({ ...ga4Data, action: "view" });
        analyticsPopupWrapper.current.addEventListener("click", () => push({ ...ga4Data, action: "click" }));
  
        return () => {
          push({ ...ga4Data, action: "close" });
        };
      } else {
        return;
      }
    }, [isModalOpen, analyticsPopupWrapper]);

    
    const handleLogout = () => {
      window.sessionStorage.setItem("loggedIn", "false");
      dataLayer.push({
        event: "personalArea",
        eventCategory: "Personal Area",
        eventAction: "Logout",
        eventLabel: "Logout: ok",
      });
      //GA4FUNREQ24B
      push({event: "ga4-logout"})
      
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
        <div 
          className={style.logoutModalWrapper} 
          //GA4FUNREQ60
          id="logout_popup"
          ref={analyticsPopupWrapper}
        >
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
  
  export default MyAccountLogoutLink