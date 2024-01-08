import React, {useEffect} from 'react'
interface ProblemiSoluzioniProps { }
interface ProblemiSoluzioniProps {
  endpoint: string;
}
const ProblemiSoluzioni: StorefrontFunctionComponent<ProblemiSoluzioniProps> = ({endpoint }) => {
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
  return <div id="booking-ref-app" data-brand="WP" data-country="FR" data-locale="fr_FR" data-version="2020"> </div>
}

ProblemiSoluzioni.schema = {
  title: 'editor.problemiSoluzioni.title',
  description: 'editor.problemiSoluzioni.description',
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

export default ProblemiSoluzioni
