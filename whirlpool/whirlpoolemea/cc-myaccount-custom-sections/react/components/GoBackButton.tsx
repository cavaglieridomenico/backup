import React, { FunctionComponent } from 'react'
import styles from './GoBackButton.css'
import { arrowBackSvg } from '../vectors/vectors'
import {
  Link,
  withRouter,
  RouteComponentProps,
} from 'vtex.my-account-commons/Router'


const BackButton: FunctionComponent<Props> = ({ path, name }) => {

  const arrowIcon = Buffer.from(arrowBackSvg).toString("base64");

  return (
    <Link to={path} className='t-action--small' style={{textDecoration: 'none'}}>
            <img className={styles.gobackIcon} src={`data:image/svg+xml;base64,${arrowIcon}`} alt="Arrow Back Icon" />
      <span className={`${styles.goBackLinkInvoice} c-action-primary`}>{name}</span>
    </Link>
  )
}

interface Props extends RouteComponentProps {
  path: string
  name: string
}

export default withRouter(BackButton)
