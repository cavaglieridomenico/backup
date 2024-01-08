import React from "react";
import useCountdown from "./utils/useCountdown";
import style from "./style.css";
import { getLoader } from "./utils/loader";
import { useCssHandles } from "vtex.css-handles";
import { useIntl } from "react-intl";

interface LoadingInterface {
  width: string;
  height: string;
}
interface CountdownProps {
  Else?: React.ComponentType;
  endDateTime: string;
  isCircle?: boolean;
  loading?: LoadingInterface;
  characterSeparator?: string;
  showUnit?: boolean;
}

const CSS_HANDLES = [
  "countdownContainer",
  "timerContainer",
  "daysContainer",
  "hoursContainer",
  "minutesContainer",
  "secondsContainer",
  "timerLabel",
  "daysLabel",
  "hoursLabel",
  "minutesLabel",
  "secondsLabel",
  "separatorLabel",
  "unitLabel",
] as const;

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({
  Else,
  endDateTime,
  isCircle = true,
  loading = { width: 60, height: 60 },
  characterSeparator,
  showUnit = true,
}) => {
  const intl = useIntl();
  const handles = useCssHandles(CSS_HANDLES);

  const {
    daysLeft,
    hoursLeft,
    minutesLeft,
    secondsLeft,
    isLoading,
    isFinished,
  } = useCountdown(endDateTime);

  return (
    <>
      {isFinished && Else ? (
        <Else />
      ) : !isLoading ? (
        <div className={handles.countdownContainer}>
          {/* DAYS */}
          <div className={`${handles.timerContainer} ${handles.daysContainer}`}>
            <span className={`${handles.timerLabel} ${handles.daysLabel}`}>
              {daysLeft}
            </span>
            {showUnit ? (
              <span className={handles.unitLabel}>
                {intl.formatMessage({
                  id: "store/countdown-component.days-label",
                })}
              </span>
            ) : null}
          </div>
          {characterSeparator ? (
            <span className={handles.separatorLabel}>{characterSeparator}</span>
          ) : null}
          {/* HOURS */}
          <div
            className={`${handles.timerContainer} ${handles.hoursContainer}`}
          >
            <span className={`${handles.timerLabel} ${handles.hoursLabel}`}>
              {hoursLeft}
            </span>
            {showUnit ? (
              <span className={handles.unitLabel}>
                {intl.formatMessage({
                  id: "store/countdown-component.hours-label",
                })}
              </span>
            ) : null}
          </div>
          {characterSeparator ? (
            <span className={handles.separatorLabel}>{characterSeparator}</span>
          ) : null}
          {/* MINUTES */}
          <div
            className={`${handles.timerContainer} ${handles.minutesContainer}`}
          >
            <span className={`${handles.timerLabel} ${handles.minutesLabel}`}>
              {minutesLeft}
            </span>
            {showUnit ? (
              <span className={handles.unitLabel}>
                {intl.formatMessage({
                  id: "store/countdown-component.minutes-label",
                })}
              </span>
            ) : null}
          </div>
          {characterSeparator ? (
            <span className={handles.separatorLabel}>{characterSeparator}</span>
          ) : null}
          {/* SECONDS */}
          <div
            className={`${handles.timerContainer} ${handles.secondsContainer}`}
          >
            <span className={`${handles.timerLabel} ${handles.secondsLabel}`}>
              {secondsLeft}
            </span>
            {showUnit ? (
              <span className={handles.unitLabel}>
                {intl.formatMessage({
                  id: "store/countdown-component.seconds-label",
                })}
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        getLoader(style, isCircle, loading)
      )}
    </>
  );
};
Countdown.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {
    endDateTime: {
      title: "End date-time",
      description: "Select the Countdown end date",
      type: "string",
      format: "date-time",
    },
  },
};

export default Countdown;
