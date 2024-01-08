import React from "react";
import style from "./style.css";

interface settings {
  clickLabel: string;
  linkLabel: string;
  editLabel: string;
}
interface WindowOptanon extends Window {
  Optanon: any;
}
const Title: StorefrontFunctionComponent<settings> = ({
  clickLabel,
  linkLabel,
  editLabel,
}) => {
  let optanon = ((window as unknown) as WindowOptanon).Optanon;
  return (
    <div className={style.cookieTitleContainer}>
      <span>{clickLabel}</span>
      <a
        className={`${style.linkText} optanon-toggle-display`}
        onClick={() => optanon.ToggleInfoDisplay()}
        style={{ color: "#b24c24", cursor: "pointer" }}
      >
        {linkLabel}
      </a>
      <span>{editLabel}</span>
    </div>
  );
};

Title.schema = {
  title: "editor.cookie-table.title",
  description: "editor.cookie-table.description",
  type: "object",
  properties: {
    clickLabel: {
      title: "clickLabel",
      description: "Mogą Państwo zmieniać swoje",
      default: "Cliquer ",
      type: "string",
    },
    linkLabel: {
      title: "linkLabel",
      description: "Link part",
      default: "ustawienia dotyczące Cookies poprzez centrum preferencji.",
      type: "string",
    },
    editLabel: {
      title: "editLabel",
      description: "Last part of the sentence",
      default: "",
      type: "string",
    },
  },
};

export default Title;
