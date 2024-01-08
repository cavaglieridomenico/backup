import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { Input } from 'vtex.styleguide'
import style from '../invoices.css'
import { useProfile } from '../context/ProfileContext'
import { Values } from '../form/CustomDatas'

interface CompanySectionProps {}

const CompanySection: React.FC<CompanySectionProps> = ({}) => {
  /*--- INTL MANAGEMENT ---*/
  const intl = useIntl()

  const {
    customDataValues,
    errors,
    customDatasRequiredFields,
    handleChangeInputCustomDatas,
    resetInput,
  } = useProfile()

  return (
    <>
      {/* SOCIAL REASON */}
      <div
        className={style.profileInput}
        data-testid="profile--invoice-social-reason-wrapper"
      >
        <Input
          label={`${intl.formatMessage(messages.socialReason)}${
            customDatasRequiredFields?.isInvoiceSocialReasonRequired ? '*' : ''
          }`}
          name="invoiceSocialReason"
          type="text"
          value={customDataValues.invoiceSocialReason}
          error={errors?.invoiceSocialReason}
          errorMessage={errors?.invoiceSocialReason}
          onChange={(e: any) => {
            handleChangeInputCustomDatas(e), resetInput('invoiceSocialReason')
          }}
        />
      </div>
      {/* VAT */}
      <div
        className={style.profileInput}
        data-testid="profile--invoice-vat-wrapper"
      >
        <Input
          label={`${intl.formatMessage(messages.invoiceVat)}${
            customDatasRequiredFields?.isInvoiceVatRequired ? '*' : ''
          }`}
          name="invoiceVat"
          type="text"
          value={
            customDataValues.typeOfDocument == Values.company
              ? customDataValues.invoiceFiscalCode
              : ''
          }
          error={errors?.invoiceVat}
          errorMessage={errors?.invoiceVat}
          onChange={(e: any) => {
            handleChangeInputCustomDatas(e),
              resetInput(
                customDataValues.typeOfDocument == Values.company
                  ? 'invoiceFiscalCode'
                  : null
              )
          }}
        />
      </div>
    </>
  )
}

export default CompanySection

const messages = defineMessages({
  socialReason: {
    defaultMessage: 'Social reason',
    id: 'checkout-io.profile.invoice.select.invoiceSocialReason',
  },
  invoiceVat: {
    defaultMessage: 'VAT number',
    id: 'checkout-io.profile.invoice.select.invoiceVatNumber',
  },
})
