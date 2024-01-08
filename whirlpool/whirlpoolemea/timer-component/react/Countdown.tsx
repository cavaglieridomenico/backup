import React, { useEffect, useState } from "react";
import { TimeSplit } from "./typings/global";
import { tick } from "./utils/time";
import style from "./style.css";
import {
  conditionalRender,
  condOnTimeRemaining,
} from "./utils/handleConditionTime";
import { generateBlockClass } from "./utils/cssHandles";
import { getLoader } from "./utils/loader";

interface loadingInterface {
  width: string;
  height: string;
}
interface CountdownProps {
  isCircle: boolean;
  loading: loadingInterface;
  showDateFormat: boolean;
  targetDate: string;
  ore: string;
  minuti: string;
  secondi: string;
  blockClass: string;
  children: React.Component;
  Head?: React.ComponentType;
  Else?: React.ComponentType;
}
const Countdown: StorefrontFunctionComponent<CountdownProps> = ({
  isCircle = true,
  loading = { width: 340, height: 140 },
  showDateFormat,
  targetDate,
  ore = "00",
  minuti = "00",
  secondi = "00",
  blockClass,
  Head,
  children,
  Else,
}) => {
  const classes = generateBlockClass(style.countdownContainer, blockClass);
  if (!targetDate || !ore || !minuti || !secondi) {
    return null;
  }
  const [isStart, setStart] = useState(false);
  const [isAlreadyFinish, setIsAlreadyFinish] = useState(false);

  const [finishEl, setFinishEl] = useState(
    <div className={style.effectOpacicyOn}>
      {Head && <Head />}
      <div className={classes}>
        <div className={style.timer}>
          <span className={style.colorBord}>
            00 {showDateFormat && "giorno"}
          </span>{" "}
          <span className={style.colorBlack + " " + style.marginSideDot5Rem}>
            :
          </span>
          <span className={style.colorBord}>00 {showDateFormat && "h"}</span>
          <span className={style.colorBlack + " " + style.marginSideDot5Rem}>
            :
          </span>
          <span className={style.colorBord}>00 {showDateFormat && "m"}</span>
          <span className={style.colorBlack + " " + style.marginSideDot5Rem}>
            :
          </span>
          <span className={style.colorBord}>00 {showDateFormat && "s"}</span>
        </div>
      </div>
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
    targetDate + "T" + ore + ":" + minuti + ":" + secondi + ".000+02:00",
    setTime
  );

  useEffect(() => {
    if (condOnTimeRemaining(timeRemaining, "00") && isStart && Else) {
      if (isAlreadyFinish) {
        setFinishEl(<Else />);
      } else {
        setTimeout(() => {
          setFinishEl(<Else />);
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
    getLoader(style, isCircle, loading)
  ) : (
    <React.Fragment>
      {conditionalRender(
        timeRemaining.days,
        timeRemaining.hours,
        timeRemaining.minutes,
        timeRemaining.seconds,
        <React.Fragment>
          {Head && <Head />}
          <div className={classes}>
            <div
              className={
                showDateFormat
                  ? style.timer + " " + style.fontSizeMobile
                  : style.timer
              }
            >
              <span className={style.colorBord}>
                {timeRemaining.days}{" "}
                {showDateFormat &&
                  (parseInt(timeRemaining.days) > 1 ||
                  parseInt(timeRemaining.days) == 0
                    ? "giorni"
                    : "giorno")}
              </span>
              <span
                className={style.colorBlack + " " + style.marginSideDot5Rem}
              >
                :
              </span>
              <span className={style.colorBord}>
                {timeRemaining.hours} {showDateFormat && "h"}
              </span>
              <span
                className={style.colorBlack + " " + style.marginSideDot5Rem}
              >
                :
              </span>
              <span className={style.colorBord}>
                {timeRemaining.minutes} {showDateFormat && "m"}
              </span>
              <span
                className={style.colorBlack + " " + style.marginSideDot5Rem}
              >
                :
              </span>
              <span className={style.colorBord}>
                {timeRemaining.seconds} {showDateFormat && "s"}
              </span>
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
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {
    isCircle: {
      title: "Loader circolare",
      description:
        "Mostra il loader circolare (true) o un loader rettangolare (false)",
      type: "boolean",
      default: true,
    },
    showDateFormat: {
      title: "Formato timer",
      description: "Mostra il timer nel formato x giorni, y H, w M, z S",
      type: "boolean",
    },
    targetDate: {
      title: "Data di fine",
      description: "Formato AAAA-MM-DD (ed 2021-10-12)",
      type: "string",
    },
    ore: {
      title: "Ora di fine",
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
      default: "0",
    },
    minuti: {
      title: "Minuto di fine",
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
      default: "0",
    },
    secondi: {
      title: "Secondo di fine",
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
      default: "0",
    },
  },
};

export default Countdown;
