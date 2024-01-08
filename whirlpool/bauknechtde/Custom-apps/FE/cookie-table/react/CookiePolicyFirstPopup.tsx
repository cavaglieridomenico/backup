import React from "react";
import style from "./style.css";
import { useIntl } from "react-intl";
interface settings {}
interface WindowOptanon extends Window {
  Optanon: any;
}
const CookiePolicyFirstPopup: StorefrontFunctionComponent<settings> = ({}) => {
  let optanon = (window as unknown as WindowOptanon).Optanon;
  const titleText = "Einstellungszentrum";
  const intl = useIntl();
  return (
    <div className={style.optanonToggleContainer1Popup}>
      <p>
        {intl.formatMessage({
          id: "store/cookie-table.firstPart",
        })}{" "}
        <a
          className={style.optanonToggleDisplay}
          onClick={() => optanon.ToggleInfoDisplay()}
        >
          {titleText}
        </a>{" "}
        {intl.formatMessage({
          id: "store/cookie-table.secondPart",
        })}
      </p>
    </div>
  );
};

export default CookiePolicyFirstPopup;
