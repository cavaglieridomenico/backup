import { TimeSplit } from "../typings/global"

const SECONDS_IN_MINUTE = 60
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE
const SECONDS_IN_DAYS = 24 * SECONDS_IN_HOUR

export const parseTimeRemaining = (totalSeconds: number) : TimeSplit => {
    const days = Math.floor(totalSeconds / SECONDS_IN_DAYS)
    const hours = Math.floor((totalSeconds % SECONDS_IN_DAYS) / SECONDS_IN_HOUR)
    const minutes = Math.floor(((totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE))
    const seconds = Math.floor(((totalSeconds % SECONDS_IN_HOUR) % SECONDS_IN_MINUTE))
    return {
        days: fillWithZero(2,days),
        hours: fillWithZero(2, hours),
        minutes: fillWithZero(2, minutes),
        seconds: fillWithZero(2, seconds)
    }
}

const INITIAL_STATE = {days: "00",
hours: "00",
minutes: "00",
seconds: "00",
}

const fillWithZero = (digits: number, number: number) : string => {
   const filled = '0'.repeat(digits - 1) + number
   return filled.slice(filled.length - digits)
}

export const isPastDate = (date: string) : boolean =>{
  return new Date().getTime() - new Date(date).getTime() >= 0
}

/**
 *
 * @param targetDate ISOString for the date that the countdown will expire
 * @param dispatchFn A function that updates the state of the component
 */
export const tick = (targetDate: string, dispatchFn: React.Dispatch<React.SetStateAction<TimeSplit>>) => {
  const ONE_SECOND_IN_MILLIS = 1000
  let finalDate = new Date(targetDate)
  let now = new Date()

  let secondsLeft = (finalDate.getTime() - now.getTime())/ONE_SECOND_IN_MILLIS
  if(secondsLeft < 0){
    setTimeout(()=> {
      dispatchFn(INITIAL_STATE)
    }, ONE_SECOND_IN_MILLIS)
    return
  }
  setTimeout(()=> {
    dispatchFn(parseTimeRemaining(secondsLeft))
  }, ONE_SECOND_IN_MILLIS)
}

export const getTwoDaysFromNow = () => {
  const today = new Date()
  today.setDate(today.getDate() + 2)
  return today.toISOString()
}
