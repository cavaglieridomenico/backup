import React, { FunctionComponent } from 'react'
import styles from './GoBackButton.css'
import { arrowBackSvg } from '../vectors/vectors'
import { FormattedMessage } from 'react-intl'
import {
  Link,
  withRouter,
  RouteComponentProps,
} from 'vtex.my-account-commons/Router'


const BackButton: FunctionComponent<Props> = ({ path }) => {

  const arrowIcon = Buffer.from(arrowBackSvg).toString("base64");

  return (
    <Link to={path} className={`${styles.title} t-action--small`}>
            <img className={styles.gobackIcon} src={`data:image/svg+xml;base64,${arrowIcon}`} alt="Arrow Back Icon" />
      <span className={styles.goBackLinkInvoice}><FormattedMessage id="store/invoice-section.back-button-label" /></span>
    </Link>
  )
}

interface Props extends RouteComponentProps {
  path: string
  name: string
}

export default withRouter(BackButton)