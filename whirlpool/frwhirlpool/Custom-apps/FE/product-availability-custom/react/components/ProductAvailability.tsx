import classNames from 'classnames'
import React, { FunctionComponent, memo } from 'react'
import styles from '../styles.css'
import LowStock from './LowStock'



interface Props {
  threshold: number
  lowStockMessage: string
  highStockMessage: string
  availableQuantity: number | null | undefined
}

const Container: FunctionComponent = ({ children }) => {
  return (
    <div className={classNames(styles.container, 'flex pv2')}>
      {children}
    </div>
  )
}

const ProductAvailability: FunctionComponent<Props> = ({ threshold, lowStockMessage, availableQuantity, }) => {
  if (availableQuantity == null || availableQuantity < 1) {
    return null
  }

  const isLowStock = availableQuantity < threshold
  if (isLowStock && lowStockMessage) {
    return (
      <div className="product-availability-custom-container">
        <Container >
          {/* @ts-ignore*/}
          <LowStock text={lowStockMessage} />
        </Container>
      </div>
    )
  }


  return null
}

export default memo(ProductAvailability)
