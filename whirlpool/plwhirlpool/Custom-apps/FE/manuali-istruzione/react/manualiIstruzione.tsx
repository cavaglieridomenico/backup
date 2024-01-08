import React, { useRef } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "vtex.styleguide";

// import { useCssHandles } from 'vtex.css-handles'
import classnames from "classnames";

import styles from "./styles.css";
import { usePixel } from "vtex.pixel-manager";
// const CSS_HANDLES = ['container', 'background', 'text', 'item'] as const

interface ManualiIstruzioniProps {}

const ManualiIstruzioni: StorefrontFunctionComponent<ManualiIstruzioniProps> = ({}) => {
  //GA4FUNREQ18
  const { push } = usePixel();
  const ricercaValueContainer: any = useRef<null | HTMLInputElement>(null);
  const ricercaCodeValueContainer: any = useRef<null | HTMLInputElement>(null);

  const submit = (e: any) => {
    e.preventDefault;
    // let Campo_Ricerca;
    // let Campo_Ricerca_Code;

    //GA4FUNREQ18
    const searchTerm = () => {
      return ricercaValueContainer && ricercaCodeValueContainer
        ? `${ricercaValueContainer.current.value} ${ricercaCodeValueContainer.current.value}`.trim()
        : "";
    };
    push({
      event: "ga4-view_search_results",
      type: "product documentation",
      searchTerm: searchTerm(),
    });
  };
  return (
    <>
      <form
        className={classnames(
          styles.formContainer,
          "flex w-100 items-center justify-center"
        )}
        action="https://docs.whirlpool.eu/default.cfm?startSearch=1&brand=WP&locale=PL&typeSearch=CODE"
        target="_blank"
        method="get"
      >
        <input type="hidden" name="startSearch" value="1" />
        <input type="hidden" name="brand" value="WP" />
        <input type="hidden" name="locale" value="PL" />
        <input type="hidden" name="typeSearch" value="" />
        <div className={styles.inputContainer}>
          <label
            className={classnames(styles.inputLabel)}
            htmlFor="Campo_Ricerca"
          >
            <FormattedMessage id="user.manual.searchByCode12" />
          </label>
          <input
            className={styles.input}
            type="text"
            name="Campo_Ricerca"
            id="Campo_Ricerca"
            ref={ricercaValueContainer}
          />
          <div className={classnames(styles.inputText)}>
            <span>
              <FormattedMessage id="user.manual.searchByCode12sub" />
            </span>
          </div>
          <div className={classnames(styles.button)}>
            <Button
              onClick={submit}
              type="submit"
              value="Submit"
              variation="primary"
            >
              <FormattedMessage id="user.manual.buttonSearch" />
            </Button>
          </div>
        </div>
        <div className={styles.inputContainer}>
          <label
            className={classnames(styles.inputLabel)}
            htmlFor="Campo_Ricerca_Code"
          >
            <FormattedMessage id="user.manual.searchByCodeCommercial" />
          </label>
          <input
            className={styles.input}
            type="text"
            name="Campo_Ricerca_Code"
            id="Campo_Ricerca_Code"
            ref={ricercaCodeValueContainer}
          />
          <div className={classnames(styles.inputText)}>
            <span>
              <FormattedMessage id="user.manual.searchByCodeCommercialSub" />
            </span>
          </div>
          <div className={classnames(styles.button)}>
            <Button
              onClick={submit}
              type="submit"
              value="Submit"
              variation="primary"
            >
              <FormattedMessage id="user.manual.buttonSearch" />
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

ManualiIstruzioni.schema = {
  title: "editor.manualiIstruzioni.title",
  description: "editor.manualiIstruzioni.description",
  type: "object",
  properties: {},
};

export default ManualiIstruzioni;
