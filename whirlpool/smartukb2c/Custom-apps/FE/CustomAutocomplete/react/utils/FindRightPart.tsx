import React from 'react'   
import styles from '../styles.css' 
import { FormattedMessage } from 'react-intl' 

const FindRightPart: StorefrontFunctionComponent = () => { 
 
  return (  <div className={styles.findRightHeaderWrapper}> 
                <FormattedMessage id="store/countdown.findTheRightPart">
                    {message => <p className={styles.findRightHeader}>{message}</p>}
                </FormattedMessage>
            </div>  
          )
}

export default FindRightPart
 