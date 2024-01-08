import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import styles from "./styles.css"
import ThumpsUp from './Icons/ThumpsUp'
import TruckIcon from './Icons/TruckIcon'
import Uk from './Icons/Uk'
import WashMachine from './Icons/WashMachine'
//import { FormattedMessage } from 'react-intl'
// import FlexibleIcon from "./Icons/FlexibleIcon"
//import LocalService from "./Icons/LocalService"
//import Guarantee from "./Icons/Guarantee"
//import Engineers from "./Icons/Engineers"

interface Services { }

const Services: StorefrontFunctionComponent<Services> = ({ }) => {
   const CSS_HANDLES = ['serviceMainDiv', "whirlpoolServiceRightDiv", "serviceDiv1", "serviceDiv2", "serviceImage"]
   const handles = useCssHandles(CSS_HANDLES)

   return <div className={`${handles.serviceMainDiv}`}>

      <div className={`${handles.whirlpoolServiceRightDiv}`}>

         <div className={styles.serviceDiv2}>
            <ThumpsUp className={styles.serviceImage} />
            <p className={styles.serviceText}>Genuine Parts</p>
         </div>

         <div className={styles.serviceDiv2} >
            <TruckIcon className={styles.serviceImage} />
            <p className={styles.serviceText}>Next day delivery</p>
         </div>

         <div className={styles.serviceDiv2} >
            <Uk className={styles.serviceImage} />
            <p className={styles.serviceText}>Uk Customer Service</p>
         </div>

         <div className={styles.serviceDiv2}>
            <WashMachine className={styles.serviceImage} />
            <p className={styles.serviceText}>Line drawings available</p>
         </div>

      </div>
   </div>
}

export default Services
