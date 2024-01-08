import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import PhoneIcon from "./Icons/PhoneIcon"
//import pixel message
import { usePixel } from 'vtex.pixel-manager'

interface Phone { }

const Phone: StorefrontFunctionComponent<Phone> = ({ }) => {
  const [brand, setBrand] = React.useState("");

  const { push } = usePixel()

  React.useEffect(() => {
    let url = window && window.location ? window.location.href : "";
    if (url) {
      setBrand(url.includes("indesit") ? "indesit" : "hotpoint");
    }
  }, [])
  const CSS_HANDLES = ["phoneAndInfoWrapper","headerNavContainer", "headerNavLink", "headerNavItem", "phoneMainDiv", "phoneCall", "phoneCallA", "telemarketingIcon"]
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.phoneAndInfoWrapper}>

      <div>
        <div>
          {(brand === "hotpoint" ?
            <div className={handles.headerNavContainer}>
              <a className={handles.headerNavLink} href="https://www.hotpoint.co.uk/" target="_blank">
                <div className={handles.headerNavItem}>
                  Brand
                </div>
              </a>
              <a className={handles.headerNavLink} href="https://www.hotpointservice.co.uk/" target="_blank">
                <div className={handles.headerNavItem}>
                  Service
                </div>
              </a>
            </div> :
            <div className={handles.headerNavContainer}>
              <a className={handles.headerNavLink} href="https://www.indesit.co.uk/" target="_blank">
                <div className={handles.headerNavItem}>
                  Brand
                </div>
              </a>
              <a className={handles.headerNavLink} href="https://www.indesitservice.co.uk/" target="_blank">
                <div className={handles.headerNavItem}>
                  Service
                </div>
              </a>
            </div>)}

        </div>
      </div>
      <div className={`${handles.phoneMainDiv}`} style={{ display: "flex" }}>
        <PhoneIcon className={`${handles.telemarketingIcon}`} />
        <a className={`${handles.phoneCallA}`} href="tel:03448 225 225"
            onClick={() => {
              //GA4FUNREQ17
              push({
                  'event': 'contacts_click',
                  'type': 'telephone'
              })
          }}
        >03448 225 225</a>
      </div>
    </div>
  )


}

export default Phone