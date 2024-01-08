import React, { useRef } from "react"
import {FormattedMessage} from 'react-intl'
import { Button } from 'vtex.styleguide'

// import { useCssHandles } from 'vtex.css-handles'
import classnames from 'classnames'

import styles from './styles.css'
import { usePixel } from "vtex.pixel-manager"
// const CSS_HANDLES = ['container', 'background', 'text', 'item'] as const

interface ManualiIstruzioniProps { 

  action: string,
  brand: string,
  locale: string,
  startSearch: string,
  typeSearch: string,
  textTitle12NC?: string
  textDescription12NC: string
  textButton12NC: string
  textTitleCommercialCode?: string
  textDescriptionCommercialCode: string
  textButtonCommercialCode: string

}

const ManualiIstruzioni: StorefrontFunctionComponent<ManualiIstruzioniProps> = ({ 

  action,
  brand,
  locale,
  startSearch,
  typeSearch,
  textTitle12NC,
  textDescription12NC,
  textButton12NC,
  textTitleCommercialCode,
  textDescriptionCommercialCode,
  textButtonCommercialCode

}) => {
  //GA4FUNREQ18
  const { push } = usePixel();
  const inputValueContainer: any = useRef<null | HTMLInputElement>(null);
  const inputCodeValueContainer: any = useRef<null | HTMLInputElement>(null);
  
   const submit = (e:any) => {
     e.preventDefault;
     // let Campo_Ricerca;
     // let Campo_Ricerca_Code;
     
     //GA4FUNREQ18
     const searchTerm = () => {
      return inputValueContainer && inputCodeValueContainer
        ? `${inputValueContainer.current.value} ${inputCodeValueContainer.current.value}`.trim()
        : "";
    };
     push({
       event: "ga4-view_search_results",
       type: "product documentation",
       searchTerm: searchTerm()
      });

    }
  return (
    <>
      <form
        className={classnames(styles.formContainer, 'flex w-100 items-center justify-center')}
        action={action}
        target="_blank"
        method="get">
          <input type="hidden" name="startSearch" value={startSearch} />
          <input type="hidden" name="brand" value={brand} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="typeSearch" value={typeSearch} />
          <div className={styles.inputContainer}>
            <label className={classnames(styles.inputLabel)} htmlFor="Campo_Ricerca">
              {textTitle12NC || <FormattedMessage id="user.manual.searchByCode12"/>}
            </label>
            <input className={styles.input} type="text" name="Campo_Ricerca" id="Campo_Ricerca" ref={inputValueContainer} />
            <div  className={classnames(styles.inputText)}>
              <span>
                {textDescription12NC || <FormattedMessage id="user.manual.searchByCode12sub" />}
              </span>
            </div>
            <div className={classnames(styles.button)} >
              <Button onClick={submit} type="submit" value="Submit" variation="primary">
                {textButton12NC || <FormattedMessage id="user.manual.buttonSearch" />}
              </Button>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <label className={classnames(styles.inputLabel)} htmlFor="Campo_Ricerca_Code">
              {textTitleCommercialCode || <FormattedMessage id="user.manual.searchByCodeCommercial" />}
            </label>
            <input  className={styles.input} type="text" name="Campo_Ricerca_Code" id="Campo_Ricerca_Code" ref={inputCodeValueContainer} />
            <div className={classnames(styles.inputText)}>
              <span>
                {textDescriptionCommercialCode || <FormattedMessage id="user.manual.searchByCodeCommercialSub" />}
              </span>
            </div>
            <div className={classnames(styles.button)} >
              <Button onClick={submit} type="submit" value="Submit" variation="primary">
                {textButtonCommercialCode || <FormattedMessage id="user.manual.buttonSearch" />}
              </Button>
            </div>
        </div>
      </form>
    </>)
}

ManualiIstruzioni.schema = {
  title: 'editor.manualiIstruzioni.title',
  description: 'editor.manualiIstruzioni.description',
  type: 'object',
  properties: {
    action: {
      title: 'Action URL',
      type: 'string',
      description: 'URL to which being redirect to perform the search. For example "https://docs.whirlpool.eu/default.cfm?startSearch=1&brand=WP&locale=PL&typeSearch=CODE"',
      default: "https://docs.whirlpool.eu/default.cfm?startSearch=1&brand=WP&locale=PL&typeSearch=CODE"
    },
    brand: {
      title: 'Brand',
      type: 'string',
      description: 'Brand to search for. For example "WP"',
      default: "WP"
    },
    locale: {
      title: 'Locale',
      type: 'string',
      description: 'Locale. For example: "PL"',
      default: "PL"
    },
    startSearch: {
      title: 'Start Search',
      type: 'string',
      description: 'Start Search Parameter. For example "1"',
      default: "1"
    },
    typeSearch: {
      title: 'Type Search',
      type: 'string',
      description: 'Type Search Parameter. For example "CODE"',
      default: "CODE"
    },
    textTitle12NC: {
      title: 'Title 12NC',
      type: 'string',
      description: 'Upper text title for the 12NC search box',
    },
    textDescription12NC: {
      title: 'Description 12NC',
      type: 'string',
      description: 'Lower text description for the 12NC search box',
    },
    textButton12NC: {
      title: 'CTA 12NC',
      type: 'string',
      description: 'Text for the 12NC CTA Button',
    },
    textTitleCommercialCode: {
      title: 'Title Commercial Code',
      type: 'string',
      description: 'Upper text title for the Commercial Code search box',
    },
    textDescriptionCommercialCode: {
      title: 'Description Commercial Code',
      type: 'string',
      description: 'Lower text description for the Commercial Code search box',
    },
    textButtonCommercialCode: {
      title: 'CTA Commercial Code',
      type: 'string',
      description: 'Text for the Commercial Code CTA Button',
    }
  },
}

export default ManualiIstruzioni
