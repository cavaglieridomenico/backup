import React, { useEffect } from 'react'
import classnames from 'classnames'
import styles from './styles.css'

interface OutOfWarrantyProps {
  endpoint: string;
 }
 const OutOfWarranty: StorefrontFunctionComponent<OutOfWarrantyProps> = ({endpoint }) => {

 useEffect(() => {
    const script = document.createElement('script')
    script.src = endpoint || ""
    script.setAttribute('id', 'booking-ref-bootstrap')
    script.async = true
    document.head.appendChild(script)
    
    //script worldPay
    const scriptWorldPay = document.createElement("script");
    scriptWorldPay.src='https://payments.worldpay.com/resources/hpp/integrations/embedded/js/hpp-embedded-integration-library.js'
    // link worldPay
    const linkWP = document.createElement("link");
    linkWP.rel='stylesheet'
    linkWP.href='https://payments.worldpay.com/resources/hpp/integrations/embedded/css/hpp-embedded-integration-library.css'
    //Insert script and link WP
    document.body.appendChild(scriptWorldPay);
    document.body.appendChild(linkWP);

    return () => {
      const previousScript = document.getElementById('booking-ref-bootstrap')
      const previousContainer = document.getElementById('booking-ref-app')
      if (previousScript && previousScript.parentNode) {
        previousScript.parentNode.removeChild(previousScript)
      }
      if(previousContainer){
        previousContainer.remove()
      }
    }
  },[])
  return <div className={classnames(styles.formContainer, 'flex w-100 items-center justify-center')} id="booking-ref-app" data-brand="WP" data-country="FR" data-locale="fr_FR" data-version="2020" data-type="OOW"></div>
}
OutOfWarranty.schema = {
  title: 'store/garanzia-scaduta-oow.title',
  description: 'store/garanzia-scaduta-oow.description',
  type: 'object',
  properties: {
    endpoint: {
      title: "endpoint servizio",
      description: "",
      type: "string",
      default: "",
    }
  },
}
export default OutOfWarranty