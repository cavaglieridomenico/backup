import React, { useEffect } from 'react'
import style from "./style.css";
interface ServiceLocatorProps {
  endpoint: string;
}
const ServiceLocator: StorefrontFunctionComponent<ServiceLocatorProps> = ({ endpoint }) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = endpoint
    script.setAttribute('id', 'store-locator-bootstrap')
    script.async = true

    document.head.appendChild(script)
    return () => {
      const previousScript = document.getElementById('store-locator-bootstrap')
      const previousContainer = document.getElementById('booking-ref-app')
      if (previousScript && previousScript.parentNode) {
        previousScript.parentNode.removeChild(previousScript)
      }
      if (previousContainer) {
        previousContainer.remove()
      }
    }
  }, [])
  return (
    <>
      <div className="store-locator-app" id="store-locator-app" data-brand="BK" data-country="DE" data-locale="de_DE" data-type="service"></div>
      <div className={style.gutternTop1}></div>
    </>
  )
}
ServiceLocator.schema = {
  title: "editor.serviceLocator.title",
  description: "editor.serviceLocator.description",
  type: "object",
  properties: {
    endpoint: {
      title: "endpoint servizio",
      description: "",
      type: "string",
      default: "",
    },
  },
};
export default ServiceLocator
