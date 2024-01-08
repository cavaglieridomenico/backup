import React, {useEffect} from 'react'
import style from '../styles.css'
import validate from '../validateInfo'
import useForm from '../hook/useForm'
import ProductInfo from './ProductInfo'
import PersonalDataSection from './PersonalDataSection'
import ReasonSection from "./ReasonSection"
import ProductInfoHelp from "./ProductInfoHelp"
import ConsentSection  from "./ConsentSection"
import { FormattedMessage, useIntl, defineMessages } from 'react-intl'
import { usePixel } from "vtex.pixel-manager";

interface UserFormProps {
  submitForm: any
  isLoading: any
  showCheckboxSection: boolean
  showProductInfoHelp: boolean
}

const UserForm: StorefrontFunctionComponent<UserFormProps> = ({
  submitForm,
  isLoading,
  showCheckboxSection = true,
  showProductInfoHelp = true
}) => {
  const intl = useIntl();
  const { push } = usePixel();

  const {
    handleChange,
    handleChangeSelect,
    handleSubmit,
    handleChangeCheckboxes,
    handleChangePurchaseDate,
    handleChangeEndWarrantyExtensionDate,
    values,
    errors,
    isSubmitting
  } = useForm(submitForm, validate)

  const resetInput = (value: string) => {
    errors[value] && delete errors[value]
  }

  useEffect(() => {
    if(!isLoading.fetchResponse){
      push({ event: "errorMessage", data: intl.formatMessage(messages.errorFetchLabel) });
    }
  }, [isLoading])
  

  return (
    <>
    <form onSubmit={handleSubmit} className={style.form} noValidate>
      <div className={style.formWrapper}>
        <ReasonSection
          handleChangeSelect={handleChangeSelect}
          errors={errors}
          resetInput={resetInput}
        />
          <PersonalDataSection 
            errors={errors}
            resetInput={resetInput}
            handleChange={handleChange}
            values={values}
          />
          <ProductInfo 
            errors={errors}
            resetInput={resetInput}
            handleChange={handleChange}
            handleChangeSelect={handleChangeSelect}
            handleChangePurchaseDate={handleChangePurchaseDate}
            handleChangeEndWarrantyExtensionDate={handleChangeEndWarrantyExtensionDate}
            values={values}
          />
      </div>
      {showProductInfoHelp &&
      <ProductInfoHelp />
      }
      {showCheckboxSection &&
        <ConsentSection 
        values={values}
        handleChangeCheckboxes={handleChangeCheckboxes}
      />}
      {/* INVIA */}
      <div className={style.submitButtonWrapper}>
        {Object.keys(errors).length != 0 &&
        isSubmitting ?
          <p className={style.errorLabel}>
            <FormattedMessage
              id="store/contact-us-form.errorFieldRequired"
            />
          </p>
          : null
        }
        {!isLoading.fetchResponse &&
          <p className={style.errorLabel}>
            <FormattedMessage
              id="store/contact-us-form.errorFetchLabel"
            />
          </p>
        }
        {isLoading.fetchLoading && Object.keys(errors).length == 0 ?
          <div className={style.loaderFormContainer}>
            <div className={style.loaderForm}></div>
          </div>
        :
          <button className={style.submitButton} type="submit">
            <FormattedMessage
              id="store/contact-us-form.submitButtonLabel"
            />
          </button>
        }
      </div>
    </form>
    </>
  )
}

UserForm.schema = {
  title: 'Free Checkup Form Labels',
  description: 'Theese are the checkup form labels',
  type: 'object',
  properties: {
  },
}

export default UserForm

const messages = defineMessages({
  errorFetchLabel: {
    defaultMessage: "Quelque chose s'est mal passé, veuillez réessayer",
    id: "store/contact-us-form.errorFetchLabel",
  },
});