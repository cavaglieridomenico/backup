import React from 'react'
import { FormattedNumber } from 'react-intl'
import { CssHandlesTypes } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { ProductTypes } from 'vtex.product-context'

export const CSS_HANDLES = [
  'installments',
  'installmentsNumber',
  'installmentValue',
  'installmentsTotalValue',
  'interestRate',
  'paymentSystemName',
] as const

interface Props {
  message: string
  markers: string[]
  installment: ProductTypes.Installment
  handles: CssHandlesTypes.CssHandlesBag<typeof CSS_HANDLES>['handles']
}

function InstallmentsRenderer({
  message,
  markers,
  installment,
  handles,
}: Props) {
  const {
    Value,
    NumberOfInstallments,
    InterestRate,
    PaymentSystemName,
    TotalValuePlusInterestRate,
  } = installment

  const hasInterest = InterestRate !== 0

  const interestRatePercent = InterestRate / 100

  return (
    <span className={handles.installments}>
      <IOMessageWithMarkers
        message={message}
        markers={markers}
        handleBase="installments"
        values={{
          installmentsNumber: (
            <span
              key="installmentsNumber"
              className={handles.installmentsNumber}
            >
              {NumberOfInstallments && (
                <FormattedNumber value={NumberOfInstallments} />
              )}
            </span>
          ),
          installmentValue: (
            <span key="installmentValue" className={handles.installmentValue}>
              <FormattedCurrency value={Value} />
            </span>
          ),
          installmentsTotalValue: (
            <span
              key="installmentsTotalValue"
              className={handles.installmentsTotalValue}
            >
              <FormattedCurrency value={TotalValuePlusInterestRate} />
            </span>
          ),
          interestRate: (
            <span key="interestRate" className={handles.interestRate}>
              {interestRatePercent && (
                <FormattedNumber
                  value={interestRatePercent}
                  style="percent"
                  maximumFractionDigits={2}
                  minimumFractionDigits={0}
                />
              )}
            </span>
          ),
          paymentSystemName: (
            <span key="paymentSystemName" className={handles.paymentSystemName}>
              {PaymentSystemName}
            </span>
          ),
          hasInterest,
        }}
      />
    </span>
  )
}

export default InstallmentsRenderer
