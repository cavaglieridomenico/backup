import React, { useState, useEffect } from "react";
import style from "./serviceStyle.css";
import Icon from "./Icon";

interface ServiceProps {
  name: string;
  key: number;
  Tooltip1?: any;
  Tooltip2?: any;
  Tooltip3?: any;
}

const Service: StorefrontFunctionComponent<ServiceProps> = ({
  name,
  key,
  Tooltip1,
  Tooltip2,
  Tooltip3,
}) => {
  const [tooltip, setTooltip] = useState<JSX.Element>();

  const liStyle = {
    display: "flex",
    fontSize: "0.8rem",
    flexDirection: 'column' as 'column',
    width: "33%"
  };

  useEffect(() => {
    switch (name) {
      case "Полная сервисная защита на 4 года":
        setTooltip(<Tooltip3 />);
        break;
      case "Установка":
        setTooltip(<Tooltip2 />);
        break;
      case "Доставка":
        setTooltip(<Tooltip1 />);
        break;
      default:
        break;
    }
  }, []);

  return (
    <>
      <li style={liStyle} key={key}>
        <Icon iconName={name} />
        <p className={style.serviceTitle}>{name}</p>
        <span style={{ marginLeft: "5px" }}></span>
        {tooltip}
      </li>
    </>
  );
};

export default Service;
