import React, { useContext, useEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";
// import style from "./style.css";
import { TimerContextProvider } from "./TimerContext";
import { CSS_HANDLES } from "./utils/cssHandles";

interface CountdownProps {
  children: React.Component;
  Head?: React.ComponentType;
  Else: React.ComponentType;
}
const CountdownWithContext: StorefrontFunctionComponent<CountdownProps> = ({
  Head,
  children,
  Else,
}) => {
  const handles = useCssHandles(CSS_HANDLES);

  const { targetTime } = useContext(TimerContextProvider);
  if (!targetTime) {
    return null;
  }
  const [isStart, setStart] = useState(false);

  const [finishEl, setFinishEl] = useState(
    <div className={handles["effect__opacity-on"]}>
      {Head && <Head />}
      <div className={handles.container}>
        <div className={handles.container__timer}>
          <span className={handles["timer__span"]}>00</span>
          <span className={`${handles.timer__span} mh2`}>:</span>
          <span className={handles["timer__span"]}>00</span>
          <span className={`${handles.timer__span} mh2`}>:</span>
          <span className={handles["timer__span"]}>00</span>
          <span className={`${handles.timer__span} mh2`}>:</span>
          <span className={handles["timer__span"]}>00</span>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );

  const conditionalRender = (
    days: string,
    hour: string,
    min: string,
    sec: string,
    child: any,
    finish: any
  ) => {
    if (days == "00" && hour == "00" && min == "00" && sec == "00") {
      return finish;
    } else {
      return child;
    }
  };

  useEffect(() => {
    if (
      targetTime.days == "00" &&
      targetTime.hours == "00" &&
      targetTime.minutes == "00" &&
      targetTime.seconds == "00" &&
      isStart
    ) {
      setTimeout(() => {
        setFinishEl(<Else />);
      }, 3000);
    }
  }, [isStart, targetTime]);

  useEffect(() => {
    setTimeout(() => {
      setStart(true);
    }, 2000);
  }, []);

  return (
    <React.Fragment>
      {conditionalRender(
        targetTime.days,
        targetTime.hours,
        targetTime.minutes,
        targetTime.seconds,
        <React.Fragment>
          {Head && <Head />}
          <div className={handles.container}>
            <div className={handles.container__timer}>
              <span className={handles["timer__span"]}>{targetTime.days}</span>
              <span className={`${handles.timer__span} mh2`}>:</span>
              <span className={handles["timer__span"]}>{targetTime.hours}</span>
              <span className={`${handles.timer__span} mh2`}>:</span>
              <span className={handles["timer__span"]}>
                {targetTime.minutes}
              </span>
              <span className={`${handles.timer__span} mh2`}>:</span>
              <span className={handles["timer__span"]}>
                {targetTime.seconds}
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
CountdownWithContext.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {},
};

export default CountdownWithContext;
