import React, { useState, useEffect, useReducer, FormEvent } from 'react'
import { Input, Checkbox, Button, Spinner } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { ProductComparisonContext } from 'vtex.product-comparison'
import { useCssHandles } from 'vtex.css-handles'
import {
  messages,
  CSS_HANDLES,
  getSessionData,
  putNewUser,
  getIdUser,
  putNewOptinForUser,
  postProductComparison,
  splitString,
} from './utils/utilsFunctions'
import FormSkeleton from './components/FormSkeleton'
import AfterSubmitMessages from './components/AfterSubmitMessages'

interface ComparisonFormProps {
  title?: string
  subtitle1?: string
  subtitle2?: string
  textButton?: string
  concentOptinLabel?: string
  productSpecificationGroupsToHide: string
  campaign: string
}

// Handle form values with reducer
const initialForm = {
  firstName: '',
  surname: '',
  email: '',
}
const reducer = (state: any, target: any) => ({
  ...state,
  [target.name]: target.value,
})

const ComparisonForm: StorefrontFunctionComponent<ComparisonFormProps> = ({
  title = 'Confronta i prodotti',
  subtitle1 = 'Scopri le caratteristiche dei diversi modelli',
  subtitle2 = 'Compila i campi  per ricevere il confronto dei prodotti selezionati',
  textButton = 'Invia',
  concentOptinLabel = 'Acconsento al trattamento dei miei dati personali per permettere a Whirlpool Italia Srl di inviarmi newsletter/comunicazioni di marketing (in forma elettronica e non, anche tramite telefono, posta tradizionale, e-mail, SMS, notifiche push su siti di terze parti tra cui sulle piattaforme Facebook e Google) riguardanti prodotti e servizi di Whirlpool Italia Srl, anche da me acquistati o registrati, nonché di svolgere ricerche di mercato.',
  productSpecificationGroupsToHide = 'CommercialCode,Other,CategoryDataCluster_usage,EnergyLogo,Dimensioni_usage,Performance_usage,Caratteristiche_usage,Model,RatingGroupAttrLogo_image,CategoryDataCluster,RatingGroupAttrLogo,Endeca,Document,Programmi_usage,Dettagli del Prodotto,Modello,Documenti_Sintesi,Documenti,allSpecifications,Tecnologia e innovazione,Singleton,Specifica prodotto,ClasseEnergeticaUrl,ClasseEnergetica,SchedaProdotto,SchedaTecnica,UtilizzoManutenzione,Servizi Aggiuntivi,QrCode',
  campaign = 'FORM_LP_PRODUCTCOMPARISON',
}) => {
  // handles for style
  const handles = useCssHandles(CSS_HANDLES)
  // formatMessage for FormattedMessages
  const { formatMessage } = useIntl()
  // Handle form values and errors
  const [form, dispatch] = useReducer(reducer, initialForm)
  const [errors, setErrors] = useState({
    firstName: false,
    surname: false,
    email: false,
  })
  // Handle if user is LoggedIn
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  // Handle Optin
  const [isOptin, setIsOptin] = useState<boolean>(false)
  // Handle user creation
  const [optInMessage, setOptinMessage] = useState<string>("")
  // Handle Comparison Mail
  const [comparisonMessage, setComparisonMessage] = useState<string>("")
  // Handle fetch loading
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingOptin, setLoadingOptin] = useState<boolean>(false)
  // Handle Form loading on Component mounted
  const [isFormLoading, setIsFormLoading] = useState<boolean>(true)
  // Handle products info to send for the Comparison Mail API call
  const productSpecificationGroupsToHideArray = splitString(
    productSpecificationGroupsToHide
  )
  const { useProductComparisonState } = ProductComparisonContext
  const comparisonData = useProductComparisonState()
  const productsSkuIds: string[] = []
  const productsIds: string[] = []
  comparisonData.products.map((product: any) => {
    if (product && product.productId && product.skuId) {
      productsIds.push(product.productId)
      productsSkuIds.push(product.skuId)
    }
  })

  //Check if user is logged in
  useEffect(() => {
    getSessionData().then((res) => {
      setIsLoggedIn(res?.isAuthenticated?.value === 'true')
      if (res?.email?.value)
        dispatch({ name: 'email', value: res?.email?.value })
      setIsFormLoading(false)
    })
  }, [])

  // Check if Form is valid after click on submit and if not
  // Set errors correctly
  const isFormValid = () => {
    //If some form values are not setted
    if (Object.values(form).some((formValue) => !formValue)) {
      setErrors({
        ...errors,
        firstName: form.firstName ? false : true,
        surname: form.surname ? false : true,
        email: form.email ? false : true,
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

  // Function to reset UserCreation and ComparisonMail messages
  const resetMessages = () => {
    setOptinMessage("")
    setComparisonMessage("")
  }

  // Function to reset form values
  const resetFormValues = () => {
    // Reset initialFOrm values only if !loggedIn user
    if (!isLoggedIn)
      Object.keys(initialForm).forEach((name) => dispatch({ name, value: '' }))
    setIsOptin(false)
  }

  // Handle input onBlur
  const handleBlur = (e: any) => {
    setErrors({
      ...errors,
      [e.target.name]: !e.target.validity.valid || !e.target.value,
    })
  }

  // Handle Optin if user flagged the optIn checkbox
  const handleUserOptIn = () => {
    setLoadingOptin(true)
    // Get User data from email
    // const userData = await getIdUser(form.email);
    getIdUser(form.email)
      .then((userData) => {
        // If User isLoggedIn
        if (isLoggedIn) {
          if (!userData[0]?.isNewsletterOptIn) {
            // Update isNewsletterOptin to loggedIn user
            putNewOptinForUser()
              .then(() => {
                setOptinMessage('successOptinUserLogged')
                setLoadingOptin(false)
              })
              .catch(() => {
                setOptinMessage('errorOptin')
                setLoadingOptin(false)
              })
          } else {
            // User already registered to newsletter
            setOptinMessage('errorOptinUserAlreadyRegistered')
            setLoadingOptin(false)
          }
        } else {
          // Otherwise if User isn't loggedIn
          // If user is already registered
          if (userData?.length > 0 && !userData[0]?.isNewsletterOptIn) {
            setOptinMessage('errorOptinUserMustLogged')
            setLoadingOptin(false)
          } else if (userData?.length > 0 && userData[0]?.isNewsletterOptIn) {
            // If user already registered and isNewsletter optin == true do nothing
            setOptinMessage('errorOptinUserAlreadyRegistered')
            setLoadingOptin(false)
          } else {
            // New user
            putNewUser(
              form.email,
              campaign,
              isOptin,
              form.firstName,
              form.surname
            )
              .then(() => {
                setOptinMessage('successOptin')
                setLoadingOptin(false)
              })
              .catch(() => {
                setOptinMessage('errorOptin')
                setLoadingOptin(false)
              })
          }
        }
      })
      .catch(() => {
        setOptinMessage('errorOptin')
        setLoadingOptin(false)
      })
  }

  // Handle Product Comparison API call
  const handleProductComparison = () => {
    setLoading(true)
    postProductComparison(
      form.firstName,
      form.surname,
      form.email,
      productsSkuIds,
      productSpecificationGroupsToHideArray
    )
      .then(() => {
        // API call went well
        setComparisonMessage('successComparison')
        setLoading(false)
      })
      .catch(() => {
        // API call went wrong
        setComparisonMessage('errorComparison')
        setLoading(false)
      })
  }

  // Handle Form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    debugger
    e.preventDefault()
    e.stopPropagation()
    // Reset messages in order to not have the old messages
    resetMessages()
    console.log("controllo messaggi", optInMessage, comparisonMessage)
    // If Form is not valid return (if loggedIn we can proceed without checks)
    if (!isLoggedIn && !isFormValid()) return
    // If optIn is checked handleUserOptin
    if (isOptin) handleUserOptIn()
    // Now I can proceed with product comparison subscription
    handleProductComparison()
    // Reset form values
    resetFormValues()
  }

  return (
    // Main Container
    <div className={handles.container}>
      {/* Title */}
      <h2 className={handles.text__title}>{title}</h2>
      {/* Subtitle 1 */}
      <h4 className="tc mv1">{subtitle1}</h4>
      {/* Subtitle 2 */}
      {!isLoggedIn && <p className="tc mv1">{subtitle2}</p>}
      {isFormLoading ? (
        /* Form Skeleton */
        <FormSkeleton />
      ) : (
        /* Form */
        <form className={handles.container__form} onSubmit={handleSubmit}>
          <div>
            {/* If user not loggedIn show input fields */}
            {!isLoggedIn && (
              <>
                {/* Name and Surname */}
                <div className={`flex-ns justify-between mt4`}>
                  <div
                    className={`${handles.container__input} ${handles.container__input_name} w-100 mr5 mb4`}
                  >
                    <Input
                      label={formatMessage(messages.nameLabel)}
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      placeholder={formatMessage(messages.namePlaceholder)}
                      onChange={(e: any) => dispatch(e.target)}
                      onBlur={handleBlur}
                      errorMessage={
                        errors.firstName &&
                        formatMessage(messages.errorEmptyField)
                      }
                    />
                  </div>
                  <div
                    className={`${handles.container__input} ${handles.container__input_surname} w-100 ml5 mb4`}
                  >
                    <Input
                      label={formatMessage(messages.surnameLabel)}
                      name="surname"
                      type="text"
                      placeholder={formatMessage(messages.surnamePlaceholder)}
                      value={form.surname}
                      onBlur={handleBlur}
                      onChange={(e: any) => dispatch(e.target)}
                      errorMessage={
                        errors.surname &&
                        formatMessage(messages.errorEmptyField)
                      }
                    />
                  </div>
                </div>
                {/* Email */}
                <div
                  className={`${handles.container__input} ${handles.container__input_email} mt4  mb4`}
                >
                  <Input
                    label={formatMessage(messages.emailLabel)}
                    name="email"
                    type="email"
                    placeholder={formatMessage(messages.emailPlaceholder)}
                    value={form.email}
                    onChange={(e: any) => dispatch(e.target)}
                    onBlur={handleBlur}
                    errorMessage={
                      errors.email && formatMessage(messages.errorInvalidMail)
                    }
                  />
                </div>
              </>
            )}
            {/* Newsletter Optin Checkbox */}
            <div className={`${handles.container__checkbox} tj`}>
              <Checkbox
                name="Optin"
                id="Optin"
                checked={isOptin}
                type="text"
                value={isOptin}
                onChange={(e: any) => {
                  setIsOptin(e.target.checked)
                }}
                label={concentOptinLabel}
              />
            </div>
            {/* Button submit or Spinner loader */}
            <div
              className={`${handles.container__button} flex items-center mb4`}
            >
              {!(loading && loadingOptin) ? (
                <Button
                  className={handles.button__submit}
                  type="submit"
                  variation="primary"
                >
                  {textButton}
                </Button>
              ) : (
                <Spinner color="#fdc100" />
              )}
            </div>
          </div>
          {/* User Messages to show after submit */}
          {comparisonMessage &&
            <AfterSubmitMessages
            optinMessage={optInMessage}
            comparisonMessage={comparisonMessage}
          />}
        </form>
      )}
    </div>
  )
}

ComparisonForm.schema = {
  title: 'Product Comparison Form',
  description: 'Component for the product comparison form',
  type: 'object',
  properties: {
    title: {
      title: 'Form title',
      description: '',
      default: 'Confronta i prodotti',
      type: 'string',
    },
    subtitle1: {
      title: 'Form Subtitle 1',
      description: 'Change text of first subtitle under the form title',
      default: 'Scopri le caratteristiche dei diversi modelli',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    subtitle2: {
      title: 'Form Subtitle 2',
      description: 'Change text of second subtitle under the form title',
      default:
        'Compila i campi  per ricevere il confronto dei prodotti selezionati',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    concentOptinLabel: {
      title: 'checkbox label',
      description: 'Label shown on the checkbox for newsletter optin',
      default:
        'Acconsento al trattamento dei miei dati personali per permettere a Whirlpool Italia Srl di inviarmi newsletter/comunicazioni di marketing (in forma elettronica e non, anche tramite telefono, posta tradizionale, e-mail, SMS, notifiche push su siti di terze parti tra cui sulle piattaforme Facebook e Google) riguardanti prodotti e servizi di Whirlpool Italia Srl, anche da me acquistati o registrati, nonché di svolgere ricerche di mercato.',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    textButton: {
      title: 'Button Text',
      description: 'Text in the submit button',
      default: 'Invia',
      type: 'string',
    },
    productSpecificationGroupsToHide: {
      title: 'Product Specification To Hide',
      description:
        'List of Product Specification To Hide comma separated, example: SpecificationGroup1,SpecificationGroup2',
      type: 'string',
      default:
        'CommercialCode,Other,CategoryDataCluster_usage,EnergyLogo,Dimensioni_usage,Performance_usage,Caratteristiche_usage,Model,RatingGroupAttrLogo_image,CategoryDataCluster,RatingGroupAttrLogo,Endeca,Document,Programmi_usage,Dettagli del Prodotto,Modello,Documenti_Sintesi,Documenti,allSpecifications,Tecnologia e innovazione,Singleton,Specifica prodotto,ClasseEnergeticaUrl,ClasseEnergetica,SchedaProdotto,SchedaTecnica,UtilizzoManutenzione,Servizi Aggiuntivi,QrCode',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    campaign: {
      title: 'Campaign',
      description: 'Name of the campaign related to this form',
      default: 'FORM_LP_PRODUCTCOMPARISON',
      type: 'string',
    },
  },
}

export default ComparisonForm
