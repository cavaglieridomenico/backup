import { PureComponent } from 'react'
import PayPal from './flags/PayPal'
import Visa from './flags/Visa'
import GooglePay from './flags/GooglePay'
import ApplePay from './flags/ApplePay'
import GenericCard from './flags/GenericCard'
import Mastercard from './flags/Mastercard'

interface Props {
  paymentName: string
}

class PaymentFlag extends PureComponent<Props> {
  public render() {
    const { paymentName } = this.props
    let flag :any[] = []

    switch (paymentName) {
      case 'PayPal':
        flag.push(PayPal)
        break
      case 'Visa':
        flag.push(Visa,Mastercard)
        break
      case 'Apple Pay':
        flag.push(ApplePay)
        break
      case 'Google Pay':
        flag.push(GooglePay)
        break
      case 'Carte di credito':
        flag.push(Visa,Mastercard)
        break
      case 'Card Payment':
        flag.push(Visa,Mastercard)
        break    
      default:
        flag.push(GenericCard)
        break
    }

    return (<>

      {flag.map((F, index)=>(<F key={index}/>))}

    </>)
  }
}

export default PaymentFlag
