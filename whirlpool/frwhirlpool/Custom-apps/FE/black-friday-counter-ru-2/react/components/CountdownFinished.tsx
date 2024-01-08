import React from 'react'
import Numbers from './Numbers';
import { useIntl } from "react-intl";
import messages from '../utils/definedMessages';

// import { FormattedMessage } from "react-intl";
// import messages from "../utils/definedMessages"
// import style from './style.css'

interface CountdownFinishedProps {
  // openModal: boolean,
  // setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  // userAlreadyRegistered: boolean
}

const CountdownFinished: StorefrontFunctionComponent<CountdownFinishedProps> = ({ 
  // openModal, 
  // setOpenModal, 
  // userAlreadyRegistered 
}) => {
  const { formatMessage } = useIntl();


  return(
    <>
          <Numbers 
            firstNumber={"0"} 
            secondNumber={"0"} 
            label={formatMessage(messages.countdownDays)}
            last={false} 
          />
          <Numbers 
            firstNumber={"0"} 
            secondNumber={"0"} 
            label={formatMessage(messages.countdownHours)}
            last={false} 
          />
          <Numbers 
            firstNumber={"0"} 
            secondNumber={"0"} 
            label={formatMessage(messages.countdownMinutes)}
            last={false} 
          />
          <Numbers 
            firstNumber={"0"} 
            secondNumber={"0"} 
            label={formatMessage(messages.countdownSeconds)}
            last={false}
            lastStatic={true}
          />
    </>
  )
}

export default CountdownFinished