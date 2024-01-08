// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react'
import { isEmpty, path } from 'ramda'
import { ProductContext } from 'vtex.product-context'
import { defineMessages } from 'react-intl' 
import styles from './styles.css' 
import { FormattedMessage,
    MessageDescriptor,
    useIntl,
    defineMessages } from 'react-intl'

interface product {
  properties: Array<{
    values: Array<string>
  }>
}

const messages = defineMessages({
    warning: { id: 'store/countdown.warningMessage' },
    warning2: { id: 'store/countdown.warningMessageCountdown' }, 
    errorMessage: { id: 'store/countdown.warningErrorMessage'}
    })

const WarningPdp: StorefrontFunctionComponent<Props> = () => {
  const valuesFromContext = useContext(ProductContext)
  if (!valuesFromContext || isEmpty(valuesFromContext)) {
    return null
  }
  const { product }: { product: product } = valuesFromContext
  const availabilityObject = path(['properties'], product) 
  
  const warning =(availabilityObject?.filter( x => {  return x.name=="warning" || x.name=="avvertimento" || x.name=="Attention" })[0]?.values[0])
  const hazardous = (availabilityObject?.filter( x => {  return x.name=="hazardous" || x.name=="pericoloso" || x.name=="hasardeux"})[0]?.values[0])
  const error =(availabilityObject?.filter( x => {  return x.name=="error" || x.name=="errore" || x.name=="Erreur" })[0]?.values[0])

  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message) 

  useEffect( () => {
    console.log(valuesFromContext)
  }, []);
 
  return (<div 
              className={ (warning == "vero" || warning == "true" || warning == "vrai" || warning == "wahr" || 
              hazardous == "vero" || hazardous == "true" || hazardous == "vrai" || 
              error == "vero" || error == "true" || error == "vrai" || error == "wahr") 
              ? styles.warningShowPdp 
              : styles.warningHidePdp}>

            {(warning == "vero" || warning == "true" || warning == "vrai" || warning == "wahr") &&  <p className={styles.pdpWarningMessage}>{translateMessage(messages.warning2)}</p>}
            {(hazardous == "vero" || hazardous == "true" || hazardous == "vrai" || warning == "wahr") &&  <p className={styles.pdpWarningMessage}>{translateMessage(messages.warning)}</p>}
            {(error == "vero" || error == "true" || error == "vrai" || error == "wahr") &&  <p className={styles.pdpWarningMessage}>{translateMessage(messages.errorMessage)}</p>}
        
          </div>)
}

export default WarningPdp
 