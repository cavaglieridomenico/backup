// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react'
import { isEmpty, path } from 'ramda'
import { ProductContext } from 'vtex.product-context'
import { defineMessages } from 'react-intl'
import fetchRequest from '../utils/fetchRequest'
import styles from './styles.css'
import WarningIcon from './Icons/WarningIcon'
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
    warning2: { id: 'store/countdown.warningMessage2' },
    errorMessage: { id: 'store/countdown.warningErrorMessage'}
    })

const Warning: StorefrontFunctionComponent<Props> = () => {
  const valuesFromContext = useContext(ProductContext)
  if (!valuesFromContext || isEmpty(valuesFromContext)) {
    return null
  }
  const { product }: { product: product } = valuesFromContext
  const availabilityObject = path(['properties'], product) 
  
  const warning = (availabilityObject?.filter( x => {  return x.name=="warning" || x.name=="avvertimento" || x.name=="Attention" || x.name=="Warnung"})[0]?.values[0])
  const hazardous = (availabilityObject?.filter( x => {  return x.name=="hazardous" || x.name=="pericoloso" || x.name=="hasardeux" || x.name=="gefährlich"})[0]?.values[0])
  const error =(availabilityObject?.filter( x => {  return x.name=="error" || x.name=="errore" || x.name=="Erreur" || x.name=="Error"})[0]?.values[0])

  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message) 

  useEffect( () => {
    console.log(valuesFromContext)
  }, []);
 
  return (<div className={ (warning == "vero" || warning == "true" || warning == "vrai" || warning == "wahr" 
                          || hazardous == "vero" || hazardous == "true" || hazardous == "vrai" || warning == "wahr"
                          || error == "vero" || error == "true" || error == "vrai" || error == "wahr") ? styles.warningShow : styles.warningHide}>
              <WarningIcon className={styles.iconWarning}/>
              { (warning == "vero" || warning == "true" || warning == "vrai" || warning == "wahr") && <span className={styles.warningHover}>{translateMessage(messages.warning2)}</span>}
              { (hazardous == "vero" || hazardous == "true" || hazardous == "vrai" || warning == "wahr") && <span className={styles.warningHover}>{translateMessage(messages.warning)}</span>}
              { (error == "vero" || error == "true" || error == "vrai" || error == "wahr") && <span className={styles.warningHover}>{translateMessage(messages.errorMessage)}</span>}
          </div>)
}

export default Warning
 