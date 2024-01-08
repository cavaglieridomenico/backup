import React, {useEffect} from 'react'
import styles from './styles.css'
import classnames from "classnames";

interface ProblemiSoluzioniProps {
  endpoint: string;
  idext: string;
  dataBrand: string;
  dataCountry: string;
  dataLocale: string;
  dataType: string;
  dataVersion: string;
  bookingRefBootstrap: string;
  bookingRef:string;
  
}

const ImportWidgetFromSandwatch: StorefrontFunctionComponent<ProblemiSoluzioniProps> = (
  {endpoint, 
    idext, 
    dataBrand,
    dataCountry,
    dataLocale,
    dataType,
    dataVersion,
    bookingRefBootstrap,
    bookingRef }) => {

      //const thisLink = window?.location?.hash
      

  useEffect(() => {

    
    const script = document.createElement('script')
    script.src = endpoint 
    script.setAttribute('id', bookingRefBootstrap)
    script.async = true
  
    document.head.appendChild(script)
    return () => {
      const previousScript = document.getElementById(bookingRefBootstrap)
      const previousContainer = document.getElementById(bookingRef)
      if (previousScript && previousScript.parentNode) {
        previousScript.parentNode.removeChild(previousScript)
      }
      if(previousContainer){
        previousContainer.remove()
      }
    }
  },[])

  //console.log("dataType", dataType)

  if(dataType){

    return<>
      <div className={classnames(styles.formContainer,"flex w-100 items-center justify-center")}>
          <div id={idext} data-brand={dataBrand} data-country={dataCountry} 
                  data-locale={dataLocale} data-type={dataType}
                  data-version={dataVersion}> 
          </div>
      </div>
    </>

  } else {

    return<>
      <div className={classnames(styles.formContainer,"flex w-100 items-center justify-center")}>
          <div id={idext} data-brand={dataBrand} data-country={dataCountry} 
                  data-locale={dataLocale} 
                  data-version={dataVersion}> 
          </div>
      </div>
    </>

  }
  
}

ImportWidgetFromSandwatch.schema = {
  title: 'Import Widget From Sandwatch',
  description: '',
  type: 'object',
  properties: {
      endpoint: {
      title: 'endpoint',
      description: 'Set endpoint',
      type: "string",
      default: "",
    },
    idext: {
      title: 'id',
      description: 'Set ID',
      type: "string",
      default: "",
    },
    bookingRef: {
      title: 'booking-ref-app',
      description: 'Set booking Ref',
      type: "string",
      default: "",
    },
    bookingRefBootstrap: {
      title: '',
      description: 'Set booking Ref bootstrap',
      type: "string",
      default: "",
    },
    dataBrand: {
      title: 'Data-brand',
      description: 'Set Data-brand',
      type: "string",
      default: "",
    },
    dataCountry: {
      title: 'Data-country',
      description: 'Set data-country',
      type: "string",
      default: "",
    },
    dataLocale: {
      title: 'Data-locale',
      description: 'Set data-locale',
      type: "string",
      default: "",
    },
    dataType: {
      title: 'Data-type',
      description: 'Set data-type',
      type: "string",
      default: "",
    },
    dataVersion: {
      title: 'Data-version',
      description: 'Set Data-version',
      type: "string",
      default: "",
    }
  },
}

export default ImportWidgetFromSandwatch
