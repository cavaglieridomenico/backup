import React from "react";
import style from "./style.css";
interface settings {}
interface WindowOptanon extends Window {
  Optanon: any;
}
const FooterPreferenceCenter: StorefrontFunctionComponent<settings> = ({}) => {
  let optanon = (window as unknown as WindowOptanon).Optanon;
  const titleText = "Cookie-Einstellungen";
  return (
    <div className={style.footerPopupContainer}>
      <p>
        <a
          className={style.footerPopupLabel}
          onClick={() => optanon.ToggleInfoDisplay()}
        >
          {titleText}
        </a>{" "}
      </p>
    </div>
  );
};

export default FooterPreferenceCenter;
