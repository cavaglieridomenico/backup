export const conditionalRender = (
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

export const condOnTimeRemaining = (time: any, condition: string) => {
  if (
    time.days == condition &&
    time.hours == condition &&
    time.minutes == condition &&
    time.seconds == condition
  ) {
    return true;
  } else {
    return false;
  }
};
