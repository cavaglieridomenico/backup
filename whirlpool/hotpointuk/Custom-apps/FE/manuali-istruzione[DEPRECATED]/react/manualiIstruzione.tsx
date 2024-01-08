import React from 'react'
import { Button } from 'vtex.styleguide'

// import { useCssHandles } from 'vtex.css-handles'
import classnames from 'classnames'

import styles from './styles.css'

// const CSS_HANDLES = ['container', 'background', 'text', 'item'] as const

interface ManualiIstruzioniProps { }

const ManualiIstruzioni: StorefrontFunctionComponent<ManualiIstruzioniProps> = ({ }) => {
   const submit = (e:any) => {
    e.preventDefault;
    // let Campo_Ricerca;
    // let Campo_Ricerca_Code;
  }
  return (
    <>
      <form
        className={classnames(styles.formContainer, 'flex w-100 items-center justify-center')}
        action="https://docs.whirlpool.eu/default.cfm?startSearch=1&brand=WP&locale=IT&typeSearch=CODE"
        target="_blank"
        method="get">
          <input type="hidden" name="startSearch" value="1" />
          <input type="hidden" name="brand" value="WP" />
          <input type="hidden" name="locale" value="IT" />
          <input type="hidden" name="typeSearch" value="" />
          <div className={styles.inputContainer}>
            <label className={classnames(styles.inputLabel)} htmlFor="Campo_Ricerca">Cerca la documentazione usando il 12NC/F0</label>
            <input  className={styles.input} type="text" name="Campo_Ricerca" id="Campo_Ricerca" />
            <div  className={classnames(styles.inputText)}>
              <span>
              INSERISCI IL CODICE 12NC/F0 DEL PRODOTTO
              </span>
            </div>
            <div className={classnames(styles.button)} >
              <Button onClick={submit} type="submit" value="Submit" variation="primary">
                RICERCA
              </Button>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <label className={classnames(styles.inputLabel)} htmlFor="Campo_Ricerca_Code">Cerca la documentazione usando il codice commerciale</label>
            <input  className={styles.input} type="text" name="Campo_Ricerca_Code" id="Campo_Ricerca_Code" />
            <div className={classnames(styles.inputText)}>
              <span>
                INSERISCI IL CODICE COMMERCIALE DEL TUO PRODOTTO
              </span>
            </div>
            <div className={classnames(styles.button)} >
              <Button onClick={submit} type="submit" value="Submit" variation="primary">
                RICERCA
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
  properties: {},
}

export default ManualiIstruzioni
