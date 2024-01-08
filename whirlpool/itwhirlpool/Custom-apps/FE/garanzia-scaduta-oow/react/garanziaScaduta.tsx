import React, { useEffect } from 'react'
import classnames from 'classnames'
import styles from './styles.css'

interface GaranziaScadutaProps {
  endpoint: string;
 }
 const GaranziaScaduta: StorefrontFunctionComponent<GaranziaScadutaProps> = ({endpoint }) => {

 useEffect(() => {
    const script = document.createElement('script')
    script.src = endpoint
    script.setAttribute('id', 'booking-ref-bootstrap')
    script.async = true

    document.head.appendChild(script)
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
  return <div className={classnames(styles.formContainer, 'flex w-100 items-center justify-center')} id="booking-ref-app" data-brand="WP" data-country="IT" data-locale="it_IT" data-version="2020" data-type="OOW"></div>
}
GaranziaScaduta.schema = {
  title: 'editor.garanziaScaduta.title',
  description: 'editor.garanziaScaduta.description',
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
export default GaranziaScaduta
