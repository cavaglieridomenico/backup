import React, { useEffect } from 'react'
interface ServiceLocatorProps {
  endpoint: string;
}
const ServiceLocator:StorefrontFunctionComponent<ServiceLocatorProps> = ({endpoint}) => {
  console.log("endpoint",endpoint);


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
      if(previousContainer){
        previousContainer.remove()
      }
    }
  },[])
  return <div className="store-locator-app" id="store-locator-app" data-brand="WP" data-country="FR" data-locale="fr_FR" data-type="service"></div>
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
