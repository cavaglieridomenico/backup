import React, { useEffect } from "react";
import { usePixel } from "vtex.pixel-manager";
import styles from './styles.css'


export interface dataToSend {
  title: string;
  value: string;
}

export interface AnalyticsWrapperProps {
  analyticsProperties: "provide" | "none";
  nameEvent: string;
  name?: string;
  data: dataToSend[];
  isView: boolean;
  nameView?: string;
  children: any;
  isHeaderMenuMobile?: boolean;
}

const Analytics: StorefrontFunctionComponent<AnalyticsWrapperProps> = ({
  analyticsProperties,
  nameEvent,
  name = "data",
  data,
  isView,
  nameView,
  children,
  isHeaderMenuMobile
}: AnalyticsWrapperProps) => {
  if (!analyticsProperties) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  let obj: any = {};
  let dataContainer: any = {};

  // for(datum in data)
  // {

  // }

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
    <div role={"button"} onClick={handleClick} className={`${isHeaderMenuMobile ? styles.analytics_link_mobile : ''}`}>
      {children}
    </div>
  );
};
export default Analytics;
