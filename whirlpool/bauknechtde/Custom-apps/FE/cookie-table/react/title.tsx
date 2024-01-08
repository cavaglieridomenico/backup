import React from "react";
import style from "./style.css";
import { useIntl } from "react-intl";
interface settings {}
interface WindowOptanon extends Window {
  Optanon: any;
}
const Title: StorefrontFunctionComponent<settings> = ({}) => {
  let optanon = (window as unknown as WindowOptanon).Optanon;
  const titleText = "\"Cookie Preference Center\"";
  const intl = useIntl();
  return (
    <div className={style.optanonToggleContainer}>
      <p>
        {intl.formatMessage({
          id: "store/cookie-table.click",
        })}{" "}
        <a
          className={style.optanonToggleDisplay}
          onClick={() => optanon.ToggleInfoDisplay()}
        >
          {titleText}
        </a>{" "}
        {intl.formatMessage({
          id: "store/cookie-table.pesronalSettings",
        })}
      </p>
    </div>
  );
};

export default Title;
