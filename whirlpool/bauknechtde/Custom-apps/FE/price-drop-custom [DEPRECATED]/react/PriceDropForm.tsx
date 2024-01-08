import React, { useState, useReducer, useEffect, FormEvent } from 'react'
import { useIntl } from 'react-intl'
import { Input, Checkbox, Button, Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'
import { useMutation } from 'react-apollo'
import AfterSubmitMessages from './components/AfterSubmitMessages'
import PRICE_DROP_MUTATION from './graphql/priceDropMutation.graphql'
import {
  getSessionData,
  getOptinMessageBKDE,
  messages,
  CSS_HANDLES,
} from './utils/utilsFunction'
import FormSkeleton from './components/FormSkeleton'

interface MutationVariables {
  acronym: string
  document: {
    fields: Array<{
      key: string
      value?: string | null
    }>
  }
}

const initialForm = {
  firstName: '',
  surname: '',
  email: '',
}

const reducer = (state: any, target: any) => ({
  ...state,
  [target.name]: target.value,
})

type PriceDropFormProps = {
  campaignName: string
  formTitle: string
  checkboxLabel: string
  submitBtnText: string
}

const PriceDropForm: StorefrontFunctionComponent<PriceDropFormProps> = ({
  campaignName = 'FORM_PDP_PRICEDROP',
  formTitle,
  checkboxLabel,
  submitBtnText,
}) => {
  const productContext = useProduct()
  const handles = useCssHandles(CSS_HANDLES)
  const { formatMessage } = useIntl()
  const [loadingSpinnerButton, setLoadingSpinnerButton] =
    useState<Boolean>(false)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [form, dispatch] = useReducer(reducer, initialForm)
  const [isFormLoading, setFormLoading] = useState<boolean>(true)
  const [optin, setOptin] = useState<Boolean>(false)

  // Handle user creation message
  const [optinMessageToShow, setOptinMessageToShow] = useState<string>()

  // Handle Advice Mail send message
  const [adviseMessageToShow, setAdviseMessageToShow] = useState<string>()

  // Handle form values errors
  const [errors, setErrors] = useState({
    firstName: false,
    surname: false,
    email: false,
  })

  const refId = productContext?.product?.items[0]?.referenceId[0]?.Value
  const lowPrice =
    productContext?.product?.items[0]?.sellers[0]?.commertialOffer?.ListPrice

  const [signUp] = useMutation(PRICE_DROP_MUTATION, {
    onCompleted: (data: any) => {
      !data?.createDocument
        ? setAdviseMessageToShow('errorPriceDropAlert')
        : setAdviseMessageToShow('successPriceDropAlert')
      setLoadingSpinnerButton(false)
    },
    onError: () => {
      setAdviseMessageToShow('errorPriceDropAlert')
      setLoadingSpinnerButton(false)
    },
  })

  // Handle Input onBlur
  const handleBlur = (e: any) => {
    setErrors({
      ...errors,
      [e.target.name]: !e.target.validity.valid || !e.target.value,
    })
    if (e.target.name === 'email') {
      validateEmail(e.target.value)
    }
  }

  // Check if user is loggedIn on Component mounted
  useEffect(() => {
    isAuth()
  }, [])

  // Function to validate email properly
  const validateEmail = (newEmail: string) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // If mail doesn't pass the regex test setError and return false
    if (!emailRegex.test(newEmail.toLowerCase())) {
      setErrors({
        ...errors,
        email: !emailRegex.test(newEmail.toLowerCase()),
      })
      return false
    }
    return true
  }

  // Function to reset form values
  const resetFormFields = () => {
    if (!loggedIn) {
      // Reset form fields
      Object.keys(initialForm).forEach((name) => dispatch({ name, value: '' }))
    }
    setOptin(false)
  }

  // Function to check if user is loggedIn
  const isAuth = async () => {
    const profile = await getSessionData()
    setLoggedIn(profile?.isAuthenticated?.value == 'true')
    if (profile && profile.email)
      dispatch({ name: 'email', value: profile?.email?.value })
    dispatch({ name: 'firstName', value: profile?.firstName?.value })
    dispatch({ name: 'surname', value: profile?.lastName?.value })
    setFormLoading(false)
  }

  // Function to subscribe user to Price Drop Alert
  const insertPriceDropAlert = async () => {
    const variables: MutationVariables = {
      acronym: 'DA',
      document: {
        fields: [
          {
            key: 'email',
            value: form.email,
          },
          {
            key: 'refId',
            value: refId,
          },
          {
            key: 'subscriptionPrice',
            value: lowPrice + '',
          },
        ],
      },
    }
    //callto signup to subscription
    signUp({
      variables,
    })
  }

  //Function to Check if informations insert in thre Form are Valid
  const isFormValid = () => {
    //If some form values are not setted
    if (Object.values(form).some((formValue) => !formValue)) {
      setErrors({
        ...errors,
        firstName: form.firstName ? false : true,
        surname: form.surname ? false : true,
        email: form.email && validateEmail(form.email) ? false : true,
      })
      return false
    }
    // If some errors are already present
    if (Object.values(errors).some((errorBoolean) => errorBoolean)) {
      return false
    }
    // Otherwise form is valid
    return true
  }

  // reset all messages
  const resetMessages = () => {
    setOptinMessageToShow(undefined)
    setAdviseMessageToShow(undefined)
  }

  // Handle Optin if user flagged the optIn checkbox
  const handleUserOptIn = async () => {
    // Set OptinMessage basing on what getOptinMessage utils function return
    setOptinMessageToShow(
      await getOptinMessageBKDE(
        form.email,
        form.firstName,
        form.surname,
        campaignName
      )
    )
  }

  // Handle Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    //reset all previous messages
    resetMessages()

    //is not logged in and is form is invalid error message all required field must be filled
    if (!loggedIn && !isFormValid()) {
      return
    }

    //start spinner submit
    setLoadingSpinnerButton(true)

    // If optIn handle it (register user email)
    if (optin) await handleUserOptIn()

    //optin or not, have to subscribe to PDA
    await insertPriceDropAlert()

    //reset form only if not loggedin,
    //else remove data took by logged user and need to reopen the modal to retake them

    resetFormFields()
  }

  return (
    <div
      className={`${handles.container} flex flex-column items-center justify-center ph6`}
    >
      {isFormLoading ? (
        <div className={`flex justify-center items-center`}>
          <FormSkeleton />
        </div>
      ) : (
        <>
          <h2 className={`${handles.container__title}`}>
            {formTitle ? formTitle : formatMessage(messages.formTitle)}
          </h2>
          <form
            className={`${handles.form__container}`}
            onSubmit={(e: any) => handleSubmit(e)}
          >
            {!loggedIn ? ( //If loggedIn show only the checkbox
              <>
                <div className={`${handles['form__container-inputs']}`}>
                  <div
                    className={`${handles['form__container-name']} flex w-100 mr1`}
                  >
                    <Input
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      placeholder={formatMessage(messages.namePlaceholder)}
                      onChange={(e: any) => dispatch(e.target)}
                      onBlur={handleBlur}
                      errorMessage={
                        errors.firstName && formatMessage(messages.errorEmpty)
                      }
                    />
                  </div>

                  <div
                    className={`${handles['form__container-surname']} flex w-100 ml1`}
                  >
                    <Input
                      name="surname"
                      type="text"
                      value={form.surname}
                      placeholder={formatMessage(messages.surnamePlaceholder)}
                      onChange={(e: any) => dispatch(e.target)}
                      onBlur={handleBlur}
                      errorMessage={
                        errors.surname && formatMessage(messages.errorEmpty)
                      }
                    />
                  </div>
                </div>

                <div className={`${handles['form__container-email']} mb6`}>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    placeholder={formatMessage(messages.emailPlaceholder)}
                    onChange={(e: any) => dispatch(e.target)}
                    onBlur={handleBlur}
                    errorMessage={
                      errors.email && formatMessage(messages.errorMail)
                    }
                  />
                </div>
              </>
            ) : null}

            <div
              className={`${handles['form__container-checkbox']} mt0 mb2 tj`}
            >
              <Checkbox
                checked={optin}
                id="privacy-check"
                label={
                  checkboxLabel
                    ? checkboxLabel
                    : formatMessage(messages.checkboxLabel)
                }
                name="default-checkbox-group"
                onChange={(e: any) => setOptin(e.target.checked)}
                value={optin}
              />
            </div>
            <div
              className={`${handles['form__container-btn']} ${handles['form__button-enabled']} flex justify-center mv5`}
            >
              {!loadingSpinnerButton ? (
                <Button
                  type="submit"
                  className={`${handles['form__button-enabled']}`}
                >
                  {submitBtnText
                    ? submitBtnText
                    : formatMessage(messages.submitBtnText)}
                </Button>
              ) : (
                <Spinner size={32} />
              )}
            </div>
            {adviseMessageToShow && (
              <AfterSubmitMessages
                optinMessage={optinMessageToShow && optinMessageToShow}
                adviseMessage={adviseMessageToShow ? adviseMessageToShow : ''}
              />
            )}
          </form>
        </>
      )}
    </div>
  )
}

PriceDropForm.schema = {
  title: 'Price Drop Form',
  description: 'Component that render the Price Drop Form',
  type: 'object',
  properties: {
    campaignName: {
      title: 'Campaign Name',
      description: 'Campaign name associated with this form',
      type: 'string',
      default: 'FORM_PDP_PRICEDROP',
    },
    formTitle: {
      title: 'Form Title',
      description: 'Title of the form',
      type: 'string',
    },
    checkboxLabel: {
      title: 'Checkbox Label',
      description: 'Label for the Checkbox',
      type: 'string',
    },
    submitBtnText: {
      title: 'Submit Button Text',
      description: 'Text displayed in Submit Button',
      type: 'string',
    },
  },
}

export default PriceDropForm
