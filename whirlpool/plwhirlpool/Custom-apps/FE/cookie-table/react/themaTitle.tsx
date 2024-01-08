import React from "react";

interface settings {
  clickLabel: string;
  linkLabel: string;
  editLabel: string;
}
interface WindowOptanon extends Window {
  Optanon: any;
}
const ThemaTitle: StorefrontFunctionComponent<settings> = ({
  clickLabel,
  linkLabel,
  editLabel,
}) => {
  let optanon = ((window as unknown) as WindowOptanon).Optanon;
  return (
    <div>
      <p>
        <span>{clickLabel}</span>
        <a
          className="optanon-toggle-display"
          onClick={() => optanon.ToggleInfoDisplay()}
          style={{ color: "#505050", cursor: "pointer", fontSize: "0.875rem" }}
        >
          {linkLabel}
        </a>
        <span>{editLabel}</span>
      </p>
    </div>
  );
};

ThemaTitle.schema = {
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

export default ThemaTitle;
