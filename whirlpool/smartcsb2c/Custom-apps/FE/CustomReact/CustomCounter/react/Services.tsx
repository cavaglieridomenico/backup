import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'
// import FlexibleIcon from "./Icons/FlexibleIcon"
import LocalService from "./Icons/LocalService"
// import Guarantee from "./Icons/Guarantee"
import Engineers from "./Icons/Engineers"

interface Services {}

const Services: StorefrontFunctionComponent<Services> = ({}) => {
  const CSS_HANDLES = ['serviceMainDiv',"whirlpoolServiceRightDiv","serviceDiv1","serviceDiv2","serviceImage"]
  const handles = useCssHandles(CSS_HANDLES)

  return <div className={`${handles.serviceMainDiv}`}> 

                <div className={`${handles.whirlpoolServiceRightDiv}`}>
                
                     {/* <div className={`${handles.serviceDiv2}`}>
                        <FlexibleIcon className={`${handles.serviceImage}`}/>
                        <FormattedMessage id="store/countdown.servicesFirstLabel">
                           {message => <p>{message}</p> }
                        </FormattedMessage> 
                     </div> */}

                     <div className={`${handles.serviceDiv2}`} >
                        <LocalService className={`${handles.serviceImage}`}/>
                        <FormattedMessage id="store/countdown.servicesSecondLabel">
                           {message => <p>{message}</p> }
                        </FormattedMessage>  
                     </div>

                     {/* <div className={`${handles.serviceDiv2}`} >
                        <Guarantee className={`${handles.serviceImage}`}/>
                        <FormattedMessage id="store/countdown.servicesThirdLabel">
                           {message => <p>{message}</p> }
                        </FormattedMessage>  
                     </div> */}
                  
                     <div className={`${handles.serviceDiv2}`}>
                        <Engineers className={`${handles.serviceImage}`}/>
                        <FormattedMessage id="store/countdown.servicesFourthLabel">
                           {message => <p>{message}</p> }
                        </FormattedMessage> 
                     </div>

                </div>
         </div>
} 
 
export default Services
