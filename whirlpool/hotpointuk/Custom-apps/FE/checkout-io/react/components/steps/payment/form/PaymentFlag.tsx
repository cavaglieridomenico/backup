import React, { PureComponent } from 'react'

// import GiftCard from './flags/GiftCard'
import GenericCard from './flags/GenericCard'
import PayPal from './flags/PayPal'
import Cash from './flags/Cash'

interface Props {
  paymentSystemGroup: string
}

class PaymentFlag extends PureComponent<Props> {
  public render() {
    const { paymentSystemGroup } = this.props

    let Flag

    switch (paymentSystemGroup) {
      case 'custom203PaymentGroupPaymentGroup':
        Flag = Cash
        break
      case 'payPalPaymentGroup':
        Flag = PayPal
        break
      default:
        Flag = GenericCard
        break
    }

    return <Flag />
  }
}

export default PaymentFlag
