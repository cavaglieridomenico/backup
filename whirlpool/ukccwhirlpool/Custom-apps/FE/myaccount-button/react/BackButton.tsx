import React, { FunctionComponent } from 'react'
import styles from './backButton.css'
import {
  Link,
  withRouter,
  RouteComponentProps,
} from 'vtex.my-account-commons/Router'

import { arrowBackSvg } from './vectors/vectors'

const BackButton: FunctionComponent<Props> = ({ path, name }) => {

  const arrowIcon = Buffer.from(arrowBackSvg).toString("base64");

  return (
    <Link to={path} className={`${styles.title} t-action--small`}>
            <img className={styles.gobackIcon} src={`data:image/svg+xml;base64,${arrowIcon}`} alt="Arrow Back Icon" />
      <span className={styles.goBackLinkInvoice}>{name}</span>
    </Link>
  )
}

interface Props extends RouteComponentProps {
  path: string
  name: string
}

export default withRouter(BackButton)
