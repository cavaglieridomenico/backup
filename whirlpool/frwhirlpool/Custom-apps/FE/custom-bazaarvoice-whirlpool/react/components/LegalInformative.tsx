import React from 'react'
import styles from '../styles.css'

const LegalInformative = (): JSX.Element => {
  return (
    <div className={styles.legalInformativeText}>
      Notre société collecte les avis par l'intermédiaire du prestataire de services Bazaarvoice. 
      Bazaarvoice utilise des mesures de prévention et détection de fraudes et d'authenticité pour vérifier les avis. 
      Tous les avis proviennent d'utilisateurs vérifiés par le biais d'un e-mail de demande d'avis (le fameux e-mail 
      post-interaction ou EPI). Des informations sur l'authenticité des avis des clients sur Bazaarvoice sont disponibles {' '}
      <a
        href="https://knowledge.bazaarvoice.com/wp-content/conversations/en_US/Display/omnibus_directive.html"
        className={styles.legalInformativeLink}
      >
        ici
      </a>
      .
    </div>
  )
}

export default LegalInformative
