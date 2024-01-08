import React from 'react'
import { useIntl, defineMessages } from 'react-intl'
import { Input } from 'vtex.styleguide'
import style from '../invoices.css'
import { useProfile } from '../context/ProfileContext'
import { Values } from '../form/CustomDatas'

interface PrivateSectionProps {}

const PrivateSection: React.FC<PrivateSectionProps> = ({}) => {
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
      {/* NAME AND SURNAME */}
      <div
        className={style.profileInput}
        data-testid="profile--invoice-name-wrapper"
      >
        <Input
          label={`${intl.formatMessage(messages.nameAndSurname)}${
            customDatasRequiredFields?.isInvoiceFiscalCodeRequired ? '*' : ''
          }`}
          name="sendInvoiceTo"
          type="text"
          value={customDataValues.sendInvoiceTo}
          error={errors?.sendInvoiceTo}
          errorMessage={errors?.sendInvoiceTo}
          onChange={(e: any) => {
            handleChangeInputCustomDatas(e), resetInput('sendInvoiceTo')
          }}
        />
      </div>
      {/* FISCAL  CODE */}
      <div
        className={style.profileInput}
        data-testid="profile--invoice-fiscl-code-wrapper"
      >
        <Input
          label={`${intl.formatMessage(messages.invoiceFiscalCode)}${
            customDatasRequiredFields?.isInvoiceNameRequired ? '*' : ''
          }`}
          name="invoiceFiscalCode"
          type="text"
          value={
            customDataValues.typeOfDocument == Values.private
              ? customDataValues.invoiceFiscalCode
              : ''
          }
          error={errors?.invoiceFiscalCode}
          errorMessage={errors?.invoiceFiscalCode}
          onChange={(e: any) => {
            handleChangeInputCustomDatas(e),
              resetInput(
                customDataValues.typeOfDocument == Values.private
                  ? 'invoiceFiscalCode'
                  : null
              )
          }}
        />
      </div>
      {/* PEC */}
      <div
        className={style.profileInput}
        data-testid="profile--invoice-pec-wrapper"
      >
        <Input
          label={`${intl.formatMessage(messages.SDIPEC)}${
            customDatasRequiredFields?.isSDIPECRequired ? '*' : ''
          }`}
          name="SDIPEC"
          type="text"
          value={customDataValues.SDIPEC}
          error={errors?.SDIPEC}
          errorMessage={errors?.SDIPEC}
          onChange={(e: any) => {
            handleChangeInputCustomDatas(e), resetInput('SDIPEC')
          }}
        />
      </div>
    </>
  )
}

export default PrivateSection

const messages = defineMessages({
  nameAndSurname: {
    defaultMessage: 'Name and surname',
    id: 'checkout-io.profile.invoice.select.nameSurname',
  },
  invoiceFiscalCode: {
    defaultMessage: 'Fiscal code',
    id: 'checkout-io.profile.invoice.select.invoiceFiscalCode',
  },
  SDIPEC: {
    defaultMessage: 'PEC',
    id: 'checkout-io.profile.invoice.select.pec',
  },
})
