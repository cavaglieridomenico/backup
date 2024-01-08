import React, { useState, useEffect } from "react";
import style from "./style.css";
// import { Tooltip } from "vtex.styleguide";
import { FormattedMessage } from "react-intl";
import messages from './utils/definedMessages';

interface DescriptionProps {
  countdownDate: string
}

const Description: StorefrontFunctionComponent<DescriptionProps> = ({ countdownDate }) => {

  const [mounted, setMounted] = useState<boolean>(false)
  const [timeExpired, setTimeExpired] = useState<boolean>(false)

  const countDate = new Date(countdownDate)
  const now = new Date()
  
  useEffect(() => {
    setMounted(true)
    if(countDate.getTime()- now.getTime()>=0){
      setTimeout(()=>{
        setTimeExpired(true)
      }, countDate.getTime()- now.getTime())
    }
    else
      setTimeExpired(true)
  }, []);

  return (
    mounted ?
      <div className={style.containerDescription}>
        <p className={style.description}>
          { !timeExpired && 
          <>
            <FormattedMessage {...messages.descriptionText} />
            <span className={style.descriptionOrange}>
              {<FormattedMessage {...messages.descriptionTextOrange} />}
            </span>
            <FormattedMessage {...messages.descriptionText2} />
          </>
          }
        </p>
      </div>
      : 
      <></>
  );
};



export default Description;
