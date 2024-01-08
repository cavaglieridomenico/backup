
import React from 'react'   
import styles from './styles.css' 
import { 
    MessageDescriptor,
    useIntl,
    defineMessages } from 'react-intl'  
import TruckIcon from './Icons/TruckIcon'
 
const messages = defineMessages({
    delivery: { id: 'store/countdown.delivery' }
    })

const DeliveryInfo: StorefrontFunctionComponent = () => { 

    const intl = useIntl()
    const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)  
    
     

    return (    <div className={styles.deliveryDiv}> 
                    <TruckIcon className={styles.truckIcon} />
                    <span className={styles.deliveryHover}>{translateMessage(messages.delivery)}</span>
                </div>  
            )
}

export default DeliveryInfo