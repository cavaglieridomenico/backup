import React from 'react'
import styles from '../styles.css'

const LegalInformative = (): JSX.Element => {
  return (
    <div className={styles.legalInformativeText}>
      Nasza firma zbiera recenzje za pośrednictwem usługodawcy, którym jest
      serwis Bazaarvoice. Bazaarvoice zapewnia odpowiednie narzędzia do
      weryfikacji autentyczności recenzji oraz przeciwdziałające oszustwom.
      Wszystkie recenzje pochodzą od zweryfikowanych użytkowników. Użytkownik
      otrzymuje prośbę o recenzję poprzez e-mail (tzw. e-mail po interakcji).
      Informacje na temat autentyczności recenzji klientów na Bazaarvoice można
      znaleźć{' '}
      <a
        href="https://knowledge.bazaarvoice.com/wp-content/conversations/en_US/Display/omnibus_directive.html"
        className={styles.legalInformativeLink}
      >
        tutaj
      </a>
      .
    </div>
  )
}

export default LegalInformative
