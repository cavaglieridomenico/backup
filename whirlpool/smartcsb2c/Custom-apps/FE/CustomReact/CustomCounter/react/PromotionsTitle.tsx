import React from 'react'   
import styles from './styles.css' 
import { FormattedMessage } from 'react-intl' 

const PromotionsTitle: StorefrontFunctionComponent = () => { 
 
  return (  <div className={styles.promotionsHeaderWrapper}> 
                <FormattedMessage id="store/countdown.promotionsTitle">
                    {message => <p className={styles.promotionsHeader}>{message}</p>}
                </FormattedMessage>
            </div>  
          )
}

export default PromotionsTitle