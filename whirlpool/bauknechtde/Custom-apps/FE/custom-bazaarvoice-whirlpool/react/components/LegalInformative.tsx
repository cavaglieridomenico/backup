import React from 'react'
import styles from '../styles.css'

const LegalInformative = (): JSX.Element => {
  return (
    <div className={styles.legalInformativeText}>
      Unser Unternehmen sammelt Bewertungen über den Dienstanbieter Bazaarvoice. 
      Bazaarvoice verwendet Betrugs- und Authentizitätsmaßnahmen zur Überprüfung der Bewertungen. 
      Alle Bewertungen stammen von verifizierten Nutzern durch review request email (die sogenannte 
      post-interaction email oder PIE). Informationen über die Echtheit von Kundenrezensionen 
      auf Bazaarvoice finden Sie {' '}
      <a
        href="https://knowledge.bazaarvoice.com/wp-content/conversations/en_US/Display/omnibus_directive.html"
        className={styles.legalInformativeLink}
      >
        hier
      </a>
      .
    </div>
  )
}

export default LegalInformative
