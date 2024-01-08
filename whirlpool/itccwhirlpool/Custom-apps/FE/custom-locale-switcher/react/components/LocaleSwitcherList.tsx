import React from "react";
import { useQuery } from "react-apollo";
import { SupportedLanguage } from "langs";
import { useCssHandles } from "vtex.css-handles";

import Spinner from "./Spinner";
import getLabel from "../modules/getLabel";
import LOCALES from "../graphql/locales.gql";
import getSupportedLangs from "../modules/getSupportedLangs";
import style from "../style.css";

interface Props {
  open?: boolean;
  selectedLocale: SupportedLanguage;
  onItemClick: (selectedLang: SupportedLanguage) => void;
}

interface LocalesQuery {
  languages: {
    default: string;
    supported: string[];
  };
  currentBinding: {
    supportedLocales: string[];
  } | null;
}

function getLocale(supportedLangs: SupportedLanguage[], locale: string) {
  const localeObj = supportedLangs.find(
    ({ localeId }) => getLabel(localeId) === getLabel(locale)
  );

  return (
    localeObj ??
    (supportedLangs?.[0] || {
      text: getLabel(locale),
      localeId: locale,
    })
  );
}

const CSS_HANDLES = [
  "list",
  "listElement",
  "localeIdText",
  "loadingContainer",
  "chooseLanguage",
] as const;

export default function LocaleSwitcherList(props: Props) {
  const { open = false, onItemClick, selectedLocale } = props;
  const handles = useCssHandles(CSS_HANDLES);
  const { data, loading, error } = useQuery<LocalesQuery>(LOCALES);

  const supportedLanguages =
    data?.currentBinding?.supportedLocales ?? data?.languages?.supported ?? [];
  const supportedLangs = getSupportedLangs(supportedLanguages);

  if (loading && open) {
    return <Spinner handles={handles} />;
  }

  if (error || supportedLangs.length === 0) {
    return null;
  }

  const handleItemClick = (id: SupportedLanguage["localeId"]) => {
    // avoid infinite spinner
    if (id == selectedLocale.localeId) {
      return;
    }

    onItemClick(getLocale(supportedLangs, id));
  };

  const listClasses = `${handles.list} absolute z-5 list top-1 w3 ph0 mh0 mt4 bg-base`;
  const listElementClasses = `${handles.listElement} t-action--small pointer f5 pa3 hover-bg-muted-5 tc`;
  const chooseLanguage = `${handles.chooseLanguage}`;

  return (
    <ul hidden={!open} className={listClasses}>
      {supportedLangs.map(({ localeId, text }) => (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <li
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          role="link"
          tabIndex={-1}
          key={localeId}
          className={listElementClasses}
          onClick={() => handleItemClick(localeId)}
          onKeyDown={() => handleItemClick(localeId)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {text == "it" ? (
            <img
              src={"/arquivos/rounded-it-flag.svg"}
              className={style.otherFlag}
            />
          ) : (
            <img
              src={"/arquivos/rounded-uk-flag.png"}
              className={style.otherFlag}
            />
          )}
          <span className={`${handles.localeIdText} w-100`}>
            {text == "it" ? "ITA" : "ENG"}
          </span>
        </li>
      ))}
    </ul>
  );
}
