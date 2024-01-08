import React from "react";
import style from "./style.css";
//import { useRuntime } from "vtex.render-runtime";
import { FormattedMessage } from 'react-intl'
interface settings {
  firstPartText: string;
  link: string;
  lastPartText: string;
  // linkLabel_lang: string;
  // editLabel: string;
  // editLabel_lang: string;
}
interface WindowOptanon extends Window {
  Optanon: any;
}
const Title: StorefrontFunctionComponent<settings> = ({
  firstPartText="",
  link="",
  lastPartText="",
  // linkLabel_lang,
  // editLabel,
  // editLabel_lang,
}) => {
  //const { culture: { locale } } = useRuntime();
  //const lang = locale == "it-IT" ? "_it" : "_en";
  let optanon = (window as unknown as WindowOptanon).Optanon;
  return (
    <div className={style.cookieTitleContainer}>
      <span>{firstPartText ? firstPartText : <FormattedMessage id="store/cookie-table.firstPartText"/>}</span>
      <a
        className={`${style.linkText} optanon-toggle-display`}
        onClick={() => optanon.ToggleInfoDisplay()}
        style={{}}
      >
        {link ? link : <FormattedMessage id="store/cookie-table.link"/>}
      </a>
      <span>{lastPartText ? lastPartText : <FormattedMessage id="store/cookie-table.lastPartText"/>}</span>
    </div>
  );
};

Title.schema = {
  title: "COOKIE TABLE",
  description: "Set data for COOKIE TABLE",
  type: "object",
  properties: {
    firstPartText: {
      title: "Text before link",
      description: "Set text before link",
      default: "",
      type: "string",
    },
    link: {
      title: "Text for link",
      description: "Set Text for link",
      default: "",
      type: "string",
    },
    lastPartText: {
      title: "Text after link",
      description: "Set text after link",
      default: "",
      type: "string",
    },
    // linkLabel_lang: {
    //   title: "Set alternative Link",
    //   description: "Set alternative Link",
    //   default: "",
    //   type: "string",
    // },
    // editLabel: {
    //   title: "Set last part of label",
    //   description: "PRIMARY Last part of the sentence",
    //   default: "",
    //   type: "string",
    // },
    // editLabel_lang: {
    //   title: "Set last part of label",
    //   description: "ALTERNATIVE Last part of the sentence",
    //   default: "",
    //   type: "string",
    // },
  },
};

export default Title;
