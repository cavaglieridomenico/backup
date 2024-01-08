//@ts-nocheck
import React, {useEffect} from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl' 
import ThumpsUp from "./Icons/ThumpsUp"
import PencilIcon from "./Icons/PencilIcon"

interface CountdownProps {
  firstElement: string;
}  

const Countdown: StorefrontFunctionComponent<CountdownProps> = ( ) => { 
  const CSS_HANDLES = ['countdownMain',"countdownInner","countdownImage1","countdownImage2"]
  const handles = useCssHandles(CSS_HANDLES)  
 
  return <div className={`${handles.countdownMain}`}>
            <div className={`${handles.countdownInner}`}> 
              <ThumpsUp className={`${handles.countdownImage1}`}/>
              <FormattedMessage id="store/countdown.firstElement">
                {message => <p>{message}</p> }
              </FormattedMessage> 
            </div>  

            <div className={`${handles.countdownInner}`}>
              <img className={`${handles.countdownImage2}`} src={"/arquivos/ch-06.png"} />
              <FormattedMessage id="store/countdown.secondElement">
                {message => <p>{message}</p> }
              </FormattedMessage> 
            </div> 

            <div className={`${handles.countdownInner}`}>
              <PencilIcon className={`${handles.countdownImage1}`}/>
              <FormattedMessage id="store/countdown.thirdElement">
                {message => <p>{message}</p> }
              </FormattedMessage>  
            </div>

         </div>
} 
 
 
export default Countdown
