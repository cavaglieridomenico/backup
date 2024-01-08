import React from 'react'
import style from './style.css'

interface NumbersProps {
  firstNumber: string,
  secondNumber: string,
  label: string,
  last: boolean, //Check if last numbers block to not show dots separator
  lastStatic?: boolean
}

const Numbers: StorefrontFunctionComponent<NumbersProps> = ({ 
  firstNumber, 
  secondNumber,
  label,
  last ,
  lastStatic,
}) => {

  return(
    <div className={style.numbersContainer}>
      <div className={style.wrapper}>
        <div className={style.numberContainer}>
          <p className={style.number}>
            {firstNumber}
          </p>
        </div>
        <div className={style.numberContainer}>
          <p className={!last ? style.number : style.number + " " + style.secondsDigitTwo}>
            {secondNumber}
          </p>
        </div>
        {!last && !lastStatic && <p className={style.countdownDots}>:</p>}
      </div>
      <p className={style.labels}>{label}</p>
    </div>
  )
}

export default Numbers