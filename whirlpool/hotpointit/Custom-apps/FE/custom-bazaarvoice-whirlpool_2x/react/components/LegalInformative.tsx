import React from 'react'
import styles from '../styles.css'

const LegalInformative = (): JSX.Element => {
  return (
    <div className={styles.legalInformativeText}>
      La nostra azienda raccoglie le recensioni tramite il fornitore di servizi
      Bazaarvoice. Bazaarvoice utilizza misure antifrode e di autenticità per
      verificare le recensioni. Tutte le recensioni provengono da utilizzatori
      verificati tramite review request email (la c.d. post-interaction email or
      PIE). Le informazioni sull'autenticità delle recensioni dei clienti su
      Bazaarvoice possono essere trovate{' '}
      <a
        href="https://knowledge.bazaarvoice.com/wp-content/conversations/en_US/Display/omnibus_directive.html"
        className={styles.legalInformativeLink}
      >
        qui
      </a>
      .
    </div>
  )
}

export default LegalInformative
