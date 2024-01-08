// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react'
import { isEmpty, path } from 'ramda'
import { ProductContext } from 'vtex.product-context'
import { defineMessages } from 'react-intl'
import styles from './styles.css'
import WarningIcon from './Icons/WarningIcon'
import { 
    MessageDescriptor,
    useIntl,
    defineMessages } from 'react-intl'



const messages = defineMessages({
    warning: { id: 'store/custom-product-page.warningMessageBom' },
    warning2: { id: 'store/custom-product-page.warningMessage2Bom' }
    })

const Warning: StorefrontFunctionComponent<Props> = (product:any) => {
  const valuesFromContext = useContext(ProductContext)
  if (!valuesFromContext || isEmpty(valuesFromContext)) {
    return null
  }

  const [isHazardous, setIsHazardous] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message) 

  useEffect( () => {
    setIsWarning(product.product.warning &&  product.product.warning[0] == "true");
    setIsHazardous(product.product.hazardous && product.product.hazardous[0] == "true")
  }, []);
 
  return (<div className={ (isHazardous || isWarning ? styles.warningShow : styles.warningHide)}>
              <WarningIcon className={styles.iconWarning}/>
              { isWarning && (<span className={styles.warningHover}>{translateMessage(messages.warning2)}</span>)}
              { isHazardous && ( <span className={styles.warningHover}>{translateMessage(messages.warning)}</span>)}
          </div>)
}

export default Warning
 