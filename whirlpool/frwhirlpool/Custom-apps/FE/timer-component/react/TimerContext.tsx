import React, { createContext, useEffect, useState } from "react";
import { TimeSplit } from "./typings/global";
import { tick } from "./utils/time";

export const TimerContextProvider = createContext({
  targetTime: {
    days: "99",
    hours: "99",
    minutes: "99",
    seconds: "99",
  },
});

const groupChildren = (elements: any[], isGroupd: boolean) => {
  if (!isGroupd) {
    return elements;
  }
  return [
    [elements[0], elements[1]],
    [elements[2], elements[3]],
    [elements[4], elements[5]],
  ];
};

interface TimerContextProps {
  primaData: string;
  secondaData: string;
  terzaData: string;
  isWithSeparator: boolean;
  children: [React.Component];
}
const TimerContext: StorefrontFunctionComponent<TimerContextProps> = ({
  primaData,
  secondaData,
  terzaData,
  isWithSeparator = true,
  children,
}) => {
  const [primaDataHook, setPrimaDataHook] = useState<TimeSplit>({
    days: "99",
    hours: "99",
    minutes: "99",
    seconds: "99",
  });
  const [secondaDataHook, setSecondaDataHook] = useState<TimeSplit>({
    days: "99",
    hours: "99",
    minutes: "99",
    seconds: "99",
  });
  const [terzaDataHook, setTerzaDataHook] = useState<TimeSplit>({
    days: "99",
    hours: "99",
    minutes: "99",
    seconds: "99",
  });

  const [generalHook, setGeneralHook] = useState([
    primaDataHook,
    secondaDataHook,
    terzaDataHook,
  ]);

  tick(primaData + ".000+02:00", setPrimaDataHook);
  tick(secondaData + ".000+02:00", setSecondaDataHook);
  tick(terzaData + ".000+02:00", setTerzaDataHook);

  const [isStart, setIsStart] = useState(false);
  const CHILD_INITIAL_VALUE = groupChildren(children, isWithSeparator);

  const [elements, setElements] = useState(CHILD_INITIAL_VALUE);
  const [elNum, setElNum] = useState([0, 1, 2]);

  const getHook = (num: number) => {
    switch (num) {
      case 1:
        return secondaDataHook;
      case 2:
        return terzaDataHook;
      case 0:
        return primaDataHook;
    }
    return primaDataHook;
  };

  useEffect(() => {
    setIsStart(true);
  }, []);

  useEffect(() => {
    setGeneralHook([getHook(elNum[0]), getHook(elNum[1]), getHook(elNum[2])]);
  }, [elNum, primaDataHook, secondaDataHook, terzaDataHook]);

  const swap = (num: number) => {
    setElNum((prev) => {
      let newStatus = prev.filter((e) => e !== num);
      newStatus.push(num);
      setElements([
        elements[newStatus[0]],
        elements[newStatus[1]],
        elements[newStatus[2]],
      ]);
      return newStatus;
    });
  };

  useEffect(() => {
    if (
      primaDataHook.days == "00" &&
      primaDataHook.hours == "00" &&
      primaDataHook.minutes == "00" &&
      primaDataHook.seconds == "00"
    ) {
      swap(0);
    }
  }, [primaDataHook]);
  useEffect(() => {
    if (
      secondaDataHook.days == "00" &&
      secondaDataHook.hours == "00" &&
      secondaDataHook.minutes == "00" &&
      secondaDataHook.seconds == "00"
    ) {
      swap(1);
    }
  }, [secondaDataHook]);
  useEffect(() => {
    if (
      terzaDataHook.days == "00" &&
      terzaDataHook.hours == "00" &&
      terzaDataHook.minutes == "00" &&
      terzaDataHook.seconds == "00"
    ) {
      swap(2);
    }
  }, [terzaDataHook]);

  return isStart ? (
    <React.Fragment>
      <TimerContextProvider.Provider value={{ targetTime: generalHook[0] }}>
        {elements[0]}
      </TimerContextProvider.Provider>
      <TimerContextProvider.Provider value={{ targetTime: generalHook[1] }}>
        {elements[1]}
      </TimerContextProvider.Provider>
      <TimerContextProvider.Provider value={{ targetTime: generalHook[2] }}>
        {elements[2]}
      </TimerContextProvider.Provider>
    </React.Fragment>
  ) : null;
};
TimerContext.schema = {
  title: "Timer Context",
  description: "editor.countdown.description",
  type: "object",
  properties: {
    primaData: {
      title: "Data di fine",
      description: "Formato AAAA-MM-DDTHH:MM:SS (ed 2021-10-12T01:00:00)",
      type: "string",
    },
    secondaData: {
      title: "Data di fine",
      type: "string",
      description: "Formato AAAA-MM-DDTHH:MM:SS (ed 2021-10-12T01:00:00)",
    },
    terzaData: {
      title: "Data di fine",
      type: "string",
      description: "Formato AAAA-MM-DDTHH:MM:SS (ed 2021-10-12T01:00:00)",
    },
  },
};

export default TimerContext;
