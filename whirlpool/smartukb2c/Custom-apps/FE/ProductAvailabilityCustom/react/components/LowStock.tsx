import React, { Fragment, FunctionComponent } from 'react'
import classNames from 'classnames'
import styles from '../styles.css'

interface Props {
  text: string
  availability: number
}

const LowStock: FunctionComponent<Props> = ({ text, availability }) => {
  const [before, after] = text.split('{quantity}')
  return (
    <Fragment>
      {before && <span className={classNames(styles.lowStockText, 'c-muted-2 t-body')}>{before}</span>}
      {availability && <span className={classNames(styles.lowStockHighlight, 'c-muted-2 t-body b mh1')}>{availability}</span>}
      {after && <span className={classNames(styles.lowStockText, 'c-muted-2 t-body')}>{after}</span>}
    </Fragment>
  )
}

export default LowStock
