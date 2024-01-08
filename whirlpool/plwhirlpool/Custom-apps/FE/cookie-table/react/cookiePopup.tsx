import React from "react";

interface settings {
  clickLabel: string;
  linkLabel: string;
  editLabel: string;
}
interface WindowOptanon extends Window {
  Optanon: any;
}
const CookiePopup: StorefrontFunctionComponent<settings> = ({
  clickLabel,
  linkLabel,
  editLabel,
}) => {
  let optanon = ((window as unknown) as WindowOptanon).Optanon;
  return (
    <div
    style={{ display: 'flex' }}>
      <span 
      className="optanon-toggle-dot"
      style={{ fontSize: "1.8rem", display: "flex", alignItems: "center", marginTop: "0.2rem" }}>•</span>
      <p
       className="optanon-toggle-paragraph"
      style={{ marginTop: "1.5rem" }}
      > 
        <span
         className="optanon-toggle-spanDesc"
         style={{ marginLeft: "0.6rem" }}
         >{clickLabel}</span>
        <a
          className="optanon-toggle-display"
          onClick={() => optanon.ToggleInfoDisplay()}
          style={{ color: "#edb112", cursor: "pointer" }}
          >
          {linkLabel}
        </a>
        <span>{editLabel}</span>
      </p>
    </div>
  );
};

CookiePopup.schema = {
  title: "editor.cookie-table.cookiePopup",
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

export default CookiePopup;
