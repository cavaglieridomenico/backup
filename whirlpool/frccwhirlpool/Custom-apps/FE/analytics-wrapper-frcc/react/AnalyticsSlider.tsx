import React, { useEffect } from "react";
import { usePixel } from "vtex.pixel-manager";

export interface dataToSend {
  title: string;
  value: string;
}

export interface AnalyticsWrapperProps {
  analyticsProperties: "provide" | "none";
  isSlider: boolean;
  nameEvent: string;
  name?: string;
  data: dataToSend[];
  isView: boolean;
  nameView?: string;
  children: any;
}

const Analytics: StorefrontFunctionComponent<AnalyticsWrapperProps> = ({
  analyticsProperties,
  nameEvent,
  name = "data",
  data,
  isView,
  nameView,
  children,
}: AnalyticsWrapperProps) => {
  if (!analyticsProperties) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  let obj: any = {};
  let dataContainer: any = {};
  data.map((datum: dataToSend) => {
    dataContainer[datum.title] = datum.value;
  });
  obj[name] = [dataContainer];
  const { push } = usePixel();

  const handleClick = () => {
    push({ event: nameEvent, ...obj });
  };

  useEffect(() => {
    if (isView) {
      push({ event: nameView, ...obj });
    }
  }, []);

  return (
    <div role={"button"} onClick={handleClick}>
      {children}
    </div>
  );
};
export default Analytics;
