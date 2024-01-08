import React, { useEffect, useState } from "react";
import { TimeSplit } from "./typings/global";
import { tick } from "./utils/time";
import {
  conditionalRender,
  condOnTimeRemaining,
} from "./utils/handleConditionTime";
import {
  // generateBlockClass
  CSS_HANDLES,
} from "./utils/cssHandles";
import { useCssHandles } from "vtex.css-handles";
import Loader from "./components/Loader";
//@ts-ignore
import { useIntl } from "react-intl";
import { messages } from "./utils/formattedMessages";

interface loadingInterface {
  width: string;
  height: string;
}
interface CountdownProps {
  isCircle: boolean;
  loading: loadingInterface;
  showDateFormat: boolean;
  showTimerDots: boolean;
  showTimerLabels: boolean;
  targetDate: string;
  hours: string;
  minutes: string;
  seconds: string;
  blockClass: string;
  children: React.Component;
  Head?: React.ComponentType;
  Else?: React.ComponentType;
}
const Countdown: StorefrontFunctionComponent<CountdownProps> = ({
  isCircle = true,
  loading = { width: 340, height: 140 },
  showTimerDots,
  showTimerLabels,
  targetDate,
  hours = "00",
  minutes = "00",
  seconds = "00",
  // blockClass,
  Head,
  children,
  Else,
}) => {
  // Handles and FormattedMessages
  const handles = useCssHandles(CSS_HANDLES);
  const { formatMessage } = useIntl();
  // Not needed if we use handles
  // const classes = generateBlockClass(style.container, blockClass);

  if (!targetDate || !hours || !minutes || !seconds) {
    return null;
  }

  const [isStart, setStart] = useState(false);
  const [isAlreadyFinish, setIsAlreadyFinish] = useState(false);
  const [finishEl, setFinishEl] = useState(
    <div className={handles["effect__opacity-on"]}>
      {Head && <Head />}
      {Else && <Else />}
      <div>{children}</div>
    </div>
  );

  const [timeRemaining, setTime] = useState<TimeSplit>({
    days: "99",
    hours: "99",
    minutes: "99",
    seconds: "99",
  });

  tick(
    targetDate + "T" + hours + ":" + minutes + ":" + seconds + ".000+02:00",
    setTime
  );

  useEffect(() => {
    if (condOnTimeRemaining(timeRemaining, "00") && isStart) {
      if (isAlreadyFinish) {
        setFinishEl(Else ? <Else /> : <></>);
      } else {
        setTimeout(() => {
          setFinishEl(Else ? <Else /> : <></>);
        }, 3000);
      }
    }
  }, [timeRemaining, isStart]);

  useEffect(() => {
    if (
      timeRemaining.days !== "99" &&
      timeRemaining.hours !== "99" &&
      timeRemaining.minutes !== "99" &&
      timeRemaining.seconds !== "99"
    ) {
      if (condOnTimeRemaining(timeRemaining, "00")) {
        setIsAlreadyFinish(true);
      }
      setStart(true);
    }
  }, [timeRemaining]);

  return !isStart ? (
    <div
      className={`${handles.loader__form} flex justify-center items-center w-100`}
    >
      <Loader isCircle={isCircle} formatLoading={loading} />
    </div>
  ) : (
    <React.Fragment>
      {conditionalRender(
        timeRemaining.days,
        timeRemaining.hours,
        timeRemaining.minutes,
        timeRemaining.seconds,
        <React.Fragment>
          {Head && <Head />}
          <div className={handles.container}>
            <div className={`flex ${handles.container__timer}`}>
              {/* DAYS AND HOURS */}
              <div className={`flex ${handles["container__timer-first"]}`}>
                {/* DAYS */}
                <div className={`flex flex-column justify-center items-center`}>
                  <div className={`${handles["container__timer-number"]}`}>
                    <span className={handles["timer__span"]}>
                      {timeRemaining.days}
                    </span>
                  </div>
                  {/* DAYS LABEL */}
                  {showTimerLabels && (
                    <span className={`${handles["timer__span-label"]}`}>
                      {formatMessage(messages.daysLabel)}
                    </span>
                  )}
                </div>
                {/* : */}
                {showTimerDots && (
                  <span className={`${handles["timer__span-dots"]} mh2`}>
                    :
                  </span>
                )}
                {/* HOURS */}
                <div className={`flex flex-column justify-center items-center`}>
                  <div className={`${handles["container__timer-number"]}`}>
                    <span className={handles["timer__span"]}>
                      {timeRemaining.hours}
                    </span>
                  </div>
                  {/* HOURS LABEL */}
                  {showTimerLabels && (
                    <span className={`${handles["timer__span-label"]}`}>
                      {formatMessage(messages.hoursLabel)}
                    </span>
                  )}
                </div>
              </div>
              {/* MINUTES AND SECONDS */}
              <div className={`flex ${handles["container__timer-second"]}`}>
                {/* : */}
                {showTimerDots && (
                  <span className={`${handles["timer__span-dots"]} mh2`}>
                    :
                  </span>
                )}
                {/* MINUTES */}
                <div className={`flex flex-column justify-center items-center`}>
                  <div className={`${handles["container__timer-number"]}`}>
                    <span className={handles["timer__span"]}>
                      {timeRemaining.minutes}
                    </span>
                  </div>
                  {/* MINUTES LABEL */}
                  {showTimerLabels && (
                    <span className={`${handles["timer__span-label"]}`}>
                      {formatMessage(messages.minutesLabel)}
                    </span>
                  )}
                </div>
                {/* : */}
                {showTimerDots && (
                  <span className={`${handles["timer__span-dots"]} mh2`}>
                    :
                  </span>
                )}
                {/* SECONDS */}
                <div className={`flex flex-column justify-center items-center`}>
                  <div className={`${handles["container__timer-number"]}`}>
                    <span className={handles["timer__span"]}>
                      {timeRemaining.seconds}
                    </span>
                  </div>
                  {/* SECONDS LABEL */}
                  {showTimerLabels && (
                    <span className={`${handles["timer__span-label"]}`}>
                      {formatMessage(messages.secondsLabel)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>{children}</div>
        </React.Fragment>,
        finishEl
      )}
    </React.Fragment>
  );
};

Countdown.schema = {
  title: "Timer Component",
  description: "Timer component used to display countdown",
  type: "object",
  properties: {
    isCircle: {
      title: "Circled Loader",
      description:
        "Show circled loader (true) or a not circoled loader (false)",
      type: "boolean",
      default: true,
    },
    showTimerDots: {
      title: "Timer Dots",
      description:
        "Choose to show or not dots in timer component (the ':' symbol)",
      type: "boolean",
    },
    showTimerLabels: {
      title: "Timer Labels",
      description:
        "Choose to show label under numbers (ex: Days label under days counter)",
      type: "boolean",
    },
    targetDate: {
      title: "End Date Countdown",
      description: "Format YYYY-MM-DD (ex 2021-10-20)",
      type: "string",
    },
    hours: {
      title: "Hour End",
      type: "string",
      enum: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ],
      enumNames: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ],
      default: "00",
    },
    minutes: {
      title: "Minute End",
      type: "string",
      enum: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
        "60",
      ],
      enumNames: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
        "60",
      ],
      default: "00",
    },
    seconds: {
      title: "Second end",
      type: "string",
      enum: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
        "60",
      ],
      enumNames: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
        "60",
      ],
      default: "00",
    },
  },
};

export default Countdown;
