import React from 'react' 
import styles from './styles.css' 
import { FormattedMessage } from 'react-intl' 

const VideosTitle: StorefrontFunctionComponent = () => { 
 
  return (  <div className={styles.videosHeaderWrapper}> 
                <FormattedMessage id="store/countdown.videosTitle">
                    {message => <p className={styles.videosHeader}>{message}</p>}
                </FormattedMessage>
            </div>  
          )
}

export default VideosTitle
 