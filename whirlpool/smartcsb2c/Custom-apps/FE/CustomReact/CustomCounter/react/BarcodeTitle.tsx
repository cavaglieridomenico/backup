import React from 'react'   
import styles from './styles.css' 
import { FormattedMessage } from 'react-intl' 

const BarcodeTitle: StorefrontFunctionComponent = () => { 
 
  return (  <div className={styles.barcodeHeaderWrapper}> 
                <FormattedMessage id="store/countdown.whereDoIFindMyModel">
                    {message => <p className={styles.barcodeHeader}>{message}</p>}
                </FormattedMessage>
            </div>  
          )
}

export default BarcodeTitle