import React, { useEffect, useState } from 'react'
import Countdown, { zeroPad } from "react-countdown";
// import Knob from './Knob';
import Numbers from './components/Numbers';
// import CountdownFinished from './components/CountdownFinished';
import { useIntl } from "react-intl";
import messages from './utils/definedMessages';

import style from './style.css'

interface CountdownBlackFridayProps {
  countdownDate: string
}
const CountdownBlackFriday: StorefrontFunctionComponent<CountdownBlackFridayProps> = ({ countdownDate }) => {

  const [mounted,setMounted] = useState(false)
  const [degree,setDegree] = useState(0)
  const { formatMessage } = useIntl();

  useEffect(() => {
    setMounted(true)
  },[])

  const renderer = (
    {days, hours, minutes, seconds, completed} : 
    {days:number,hours:number,minutes:number,seconds:number,completed:boolean}) => {

    if (completed) { // Render a complete state
      return ( 
      // <div className={style.countdownContainer}>
      //   <CountdownFinished />
      // </div>
      <div className={style.discountCountdownExpired}>
        <p className={style.countdownSubtitleExpired}>{formatMessage(messages.countdownSubtitleExpired)}</p>
        <p className={style.countdownDiscountExpired}>{formatMessage(messages.countdownDiscountExpired)}</p>
        <div className={style.orangeRow}></div>
        <p className={style.countdownDescriptionExpired}>{formatMessage(messages.countdownDescriptionExpired)}</p>
      </div>
      )
    } 
    else { // Render a countdown
      return (
          <div className={style.countdownContainer}>
            <Numbers 
              firstNumber={zeroPad(days)[0]} 
              secondNumber={zeroPad(days)[1]} 
              label={formatMessage(messages.countdownDays)}
              last={false} 
              />
            <Numbers 
              firstNumber={zeroPad(hours)[0]} 
              secondNumber={zeroPad(hours)[1]} 
              label={formatMessage(messages.countdownHours)}
              last={false} 
              />
            <Numbers 
              firstNumber={zeroPad(minutes)[0]} 
              secondNumber={zeroPad(minutes)[1]} 
              label={formatMessage(messages.countdownMinutes)}
              last={false} 
              />
            <Numbers 
              firstNumber={zeroPad(seconds)[0]} 
              secondNumber={zeroPad(seconds)[1]} 
              label={formatMessage(messages.countdownSeconds)}
              last={true} 
              />
          </div>
      );
    }
  };

  return (
    <div className={style.container}>
      {mounted && countdownDate !== "Invalid Date" &&
      <>
        <Countdown
          date={countdownDate}
          renderer={renderer}
          onTick={() => degree === 360 ? setDegree(0) : setDegree(degree + 6)}
        />
        {/* <Knob degree={degree} />   */}
      </>
      }
    </div>   
  )
}


export default CountdownBlackFriday