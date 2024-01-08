import React, { useEffect } from 'react'
import style from '../styles.css'
import validate from '../validateInfo'
import useForm from '../hook/useForm'
import ProductInfo from './ProductInfo'
import PersonalDataSection from './PersonalDataSection'
import ReasonSection from './ReasonSection'
import ProductInfoHelp from './ProductInfoHelp'
import ConsentSection from './ConsentSection'
import { FormattedMessage, useIntl, defineMessages } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'
import { setAnalyticCustomError } from '../utils/ga4-analytics'

interface UserFormProps {
  submitForm: any
  isLoading: any
  showCheckboxSection: boolean
  showProductInfoHelp: boolean
  regexZipCode: any
  reasons?: []
  prodInfoTitle?: string
  prodInfoDesc?: []
  prodCodeTitle?: string
  prodCodeDesc?: []
  privacyPolicyText?: []
  acceptTermPrivacyText?: []
  telephonePlaceholder: string
  emailPlaceholder: string
  datePickerCountry: string
  datePickerPlaceholder: string,
  isTelephoneRequired: boolean
}

const UserForm: StorefrontFunctionComponent<UserFormProps> = ({
  submitForm,
  isLoading,
  showCheckboxSection = true,
  showProductInfoHelp = true,
  regexZipCode,
  reasons = [],
  prodInfoTitle,
  prodInfoDesc,
  prodCodeTitle,
  prodCodeDesc,
  privacyPolicyText,
  acceptTermPrivacyText,
  telephonePlaceholder,
  emailPlaceholder,
  datePickerCountry,
  datePickerPlaceholder,
  isTelephoneRequired
}) => {
  const intl = useIntl()
  const { push } = usePixel()

  const {
    handleChange,
    handleChangeSelect,
    handleSubmit,
    handleChangeCheckboxes,
    handleChangePurchaseDate,
    handleChangeEndWarrantyExtensionDate,
    values,
    errors,
    isSubmitting,
  } = useForm(submitForm, validate, regexZipCode, reasons, isTelephoneRequired)

  const resetInput = (value: string) => {
    errors[value] && delete errors[value]
  }

  useEffect(() => {
    if (!isLoading.fetchResponse) {
      push({
        event: 'errorMessage',
        data: intl.formatMessage(messages.errorFetchLabel),
      })
    }
  }, [isLoading])

  //GA4FUNREQ58
  useEffect(() => {
    setAnalyticCustomError(errors, push)
  }, [errors])

  return (
    <>
      <form onSubmit={handleSubmit} className={style.form} noValidate>
        <div className={style.formWrapper}>
          <ReasonSection
            handleChangeSelect={handleChangeSelect}
            errors={errors}
            resetInput={resetInput}
            reasons={reasons}
          />
          <PersonalDataSection
            errors={errors}
            resetInput={resetInput}
            handleChange={handleChange}
            values={values}
            telephonePlaceholder={telephonePlaceholder}
            emailPlaceholder={emailPlaceholder}
            isTelephoneRequired={isTelephoneRequired}
          />
          <ProductInfo
            errors={errors}
            resetInput={resetInput}
            handleChange={handleChange}
            handleChangeSelect={handleChangeSelect}
            handleChangePurchaseDate={handleChangePurchaseDate}
            handleChangeEndWarrantyExtensionDate={
              handleChangeEndWarrantyExtensionDate
            }
            values={values}
            prodInfoTitle={prodInfoTitle}
            prodInfoDesc={prodInfoDesc}
            datePickerCountry={datePickerCountry}
            datePickerPlaceholder={datePickerPlaceholder}
          />
        </div>
        {showProductInfoHelp && (
          <ProductInfoHelp
            prodCodeTitle={prodCodeTitle}
            prodCodeDesc={prodCodeDesc}
          />
        )}
        {showCheckboxSection && (
          <ConsentSection
            values={values}
            handleChangeCheckboxes={handleChangeCheckboxes}
            privacyPolicyText={privacyPolicyText}
            acceptTermPrivacyText={acceptTermPrivacyText}
          />
        )}
        {/* INVIA */}
        <div className={style.submitButtonWrapper}>
          {Object.keys(errors).length != 0 && isSubmitting ? (
            <p className={style.errorLabel}>
              <FormattedMessage id="store/contact-us-form.errorFieldRequired" />
            </p>
          ) : null}
          {!isLoading.fetchResponse && (
            <p className={style.errorLabel}>
              <FormattedMessage id="store/contact-us-form.errorFetchLabel" />
            </p>
          )}
          {isLoading.fetchLoading && Object.keys(errors).length == 0 ? (
            <div className={style.loaderFormContainer}>
              <div className={style.loaderForm}></div>
            </div>
          ) : (
            <button className={style.submitButton} type="submit">
              <FormattedMessage id="store/contact-us-form.submitButtonLabel" />
            </button>
          )}
        </div>
      </form>
    </>
  )
}

UserForm.schema = {
  title: 'Free Checkup Form Labels',
  description: 'Theese are the checkup form labels',
  type: 'object',
  properties: {},
}

export default UserForm

const messages = defineMessages({
  errorFetchLabel: {
    defaultMessage: 'Something went wrong, please retry',
    id: 'store/contact-us-form.errorFetchLabel',
  },
})
