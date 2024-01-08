import React, { useState, useEffect, useReducer, FormEvent } from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from 'react-apollo'
import { Button, Input, Checkbox, Spinner } from 'vtex.styleguide'
//@ts-ignore
import { useProduct, Seller } from 'vtex.product-context'
import BACK_IN_STOCK_MUTATION from './graphql/addToAvailabilitySubscriberMutation.graphql'
import { getDefaultSeller } from './utils/sellers'
import { useCssHandles } from 'vtex.css-handles'
import {
  messages,
  getSessionData,
  putNewUser,
  getIdUser,
  putNewOptinForUser,
} from './utils/utilsFunctions'
import { usePixel } from "vtex.pixel-manager";

const CSS_HANDLES = [
  'container',
  'container__title',
  'form',
  'form__content',
  'form__input',
  'form__input-error',
  'form__checkbox',
  'form__button-submit',
  'form__text',
  'form__text-success',
  'form__text-error',
] as const

interface MutationVariables {
  acronym: string
  document: {
    fields: Array<{
      key: string
      value?: string | null
    }>
  }
}

interface AvailabilitySubscriberProps {
  title: string
  textButton: string
  textCheckboxNotify: string
  textCheckboxOptin: string
  campaign: string
  /* Product's availability */
  available?: boolean
  /* SKU id to subscribe to */
  skuId?: string
  successTextNewsletter?: string
  successTextBackInStock?: string
}

const isAvailable = (commertialOffer?: Seller['commertialOffer']) => {
  return (
    commertialOffer &&
    (Number.isNaN(+commertialOffer.AvailableQuantity) ||
      commertialOffer.AvailableQuantity > 0)
  )
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

/**
 * Availability Subscriber Component.
 * A form where users can sign up to be alerted
 * when a product becomes available again
 */
const AvailabilitySubscriber: StorefrontFunctionComponent<
  AvailabilitySubscriberProps
> = ({
  title,
  textButton,
  textCheckboxNotify,
  textCheckboxOptin,
  campaign = 'FORM_LP_BACKINSTOCK', // External Campaign
  available,
  skuId,
  successTextNewsletter,
  successTextBackInStock,
}: AvailabilitySubscriberProps) => {
  const { push } = usePixel();
  
  const handles = useCssHandles(CSS_HANDLES)
  const { formatMessage } = useIntl()
  const productContext = useProduct()
  // Handle loggedIn user
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // Checkboxes values
  const [isNotify, setIsNotify] = useState(false)
  const [isOptin, setIsOptin] = useState(false)
  // Handle loading for check optIn
  const [loadingOptin, setLoadingOptin] = useState(false)
  const [statusNewsletter, setStatusNewsletter] = useState('')
  const [statusBackInStock, setStatusBackInStock] = useState('')
  // Form values
  const [form, dispatch] = useReducer(reducer, initialForm)
  const [errors, setErrors] = useState({
    firstName: false,
    surname: false,
    email: false,
    notify: false,
  })

  useEffect(() => {
    // Check if user is logged
    isAuth()
  }, [])

  // Function to get user session
  const isAuth = async () => {
    const profile = await getSessionData()
    setIsLoggedIn(profile?.isAuthenticated?.value === 'true')
    if (profile?.email) {
      dispatch({ name: 'email', value: profile?.email?.value })
    }
  }

  const [signUp, { loading }] = useMutation(BACK_IN_STOCK_MUTATION, {
    onCompleted: (data: any) => {
      !data?.createDocument
        ? setStatusBackInStock('ERROR')
        : setStatusBackInStock('SUCCESS')
    },
    onError: () => {
      setStatusBackInStock('ERROR')
    },
  })

  const subscribeBackInStock = async () => {
    // Subscribe mutation variables
    const variables: MutationVariables = {
      acronym: 'BS',
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
        ],
      },
    }

    signUp({ variables })
  }

  const seller = getDefaultSeller(productContext?.selectedItem?.sellers)

  available = available ?? isAvailable(seller?.commertialOffer)
  skuId = skuId ?? productContext?.selectedItem?.itemId
  const refId = productContext?.selectedItem?.referenceId[0]?.Value

  // Render component only if the product is out of stock
  if (available || !skuId) {
    return null
  }

  // Function to reset after submit messages
  const resetMessages = () => {
    setStatusBackInStock('')
    setStatusNewsletter('')
  }

  const isValidForm = () => {
    // NOT loggedIn user
    if (!isLoggedIn) {
      //If some form values are not setted by user
      if (Object.values(form).some(formValue => !formValue) || !isNotify) {
        setErrors({
          ...errors,
          firstName: form.firstName ? false : true,
          surname: form.surname ? false : true,
          email: form.email ? false : true,
          notify: isNotify ? false : true,
        })
        return false
      }
    } else {
      // loggedIn user
      if (!isNotify) {
        // Back In Stock checkbox not checked
        setErrors({
          ...errors,
          notify: isNotify ? false : true,
        })
        return false
      }
    }
    // If there are already some errors
    if (Object.values(errors).some(errorBoolean => errorBoolean)) {
      return false
    }
    // Otherwise form is valid
    return true
  }

  // Handle optIn checkbox
  const handleUserOptIn = async () => {
    const users = await getIdUser(form.email)
    // USER EXISTS AND ISN'T REGISTERED TO NEWSLETTER
    if (users?.length && !users[0]?.isNewsletterOptIn) {
      // USER IS LOGGED --> PUT THE OPTIN
      if (isLoggedIn) {
        const newOptin = await putNewOptinForUser()
        if (newOptin.status == 200)
        {
          setStatusNewsletter('SUCCESS')
        }
        else setStatusNewsletter('ERROR')
      } else {
        // USER NOT LOGGED --> LOGIN ERROR
        setStatusNewsletter('LOGIN_ERROR')
      }
    } else if (users?.length && users[0]?.isNewsletterOptIn) {
      // USER EXISTS AND IS ALREADY REGISTERED TO NEWSLETTER -> ERROR
      setStatusNewsletter('REGISTERED_ERROR')
    } else {
      // USER DOESN'T EXIST
      const newUser = await putNewUser(
        campaign,
        isOptin,
        form.email,
        form.firstName,
        form.surname
      )
      if (newUser.status === 200)
      {
        setStatusNewsletter('SUCCESS')
      }
      else setStatusNewsletter('ERROR')
    }
  }

  const handleNewsletterMessage = () => {
    switch (statusNewsletter) {
      case 'REGISTERED_ERROR':
        return formatMessage(messages.errorAlreadyRegistered)
      case 'LOGIN_ERROR':
        return formatMessage(messages.errorMustBeLogged)
      default:
        return formatMessage(messages.errorNewsletterMessage)
    }
  }

  // Handle input fields blur
  const handleBlur = (e: any) => {
    setErrors({
      ...errors,
      [e.target.name]: !e.target.validity.valid || !e.target.value,
    })
  }

  const handleNotifycheckbox = (e: any) => {
    setIsNotify(e.target.checked)
    setErrors({ ...errors, notify: e.target.checked ? false : true })
  }

  //Handle click on submit button
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    resetMessages()
    // If form is not valid exit
    if (!isValidForm()) return
    // If optIn checked, handle newsletter subscription
    if (isOptin) {
      setLoadingOptin(true)
      await handleUserOptIn()
      setLoadingOptin(false)
    }
    
    push({event: "availabilitySubscribe", text: 'avvisami quando disponibile', type: 'email when available'})
    
    // Mutation BackinStock
    await subscribeBackInStock()
  }

  return (
    <div className={handles.container}>
      {/* TITLE */}
      <div
        className={`${handles.container__title} t-body flex justify-center mb3`}
      >
        {title || formatMessage(messages.formTitle)}
      </div>
      {/* BACK IN STOCK FORM */}
      <form className={`${handles.form} mb4`} onSubmit={handleSubmit}>
        {!isLoggedIn ? (
          <>
            {/* NAME AND SURNAME INPUTS */}
            <div
              className={`${handles.form__content} flex-ns justify-between mt4 `}
            >
              <div className={`${handles.form__input} w-100 mr5 mb4`}>
                <Input
                  name="firstName"
                  type="text"
                  placeholder={formatMessage(messages.namePlaceholder)}
                  value={form.firstName}
                  onChange={(e: any) => dispatch(e.target)}
                  onBlur={handleBlur}
                  errorMessage={
                    errors.firstName && formatMessage(messages.errorRequired)
                  }
                />
              </div>
              <div className={`${handles.form__input} w-100 ml5 mb4`}>
                <Input
                  name="surname"
                  type="text"
                  placeholder={formatMessage(messages.surnamePlaceholder)}
                  value={form.surname}
                  onChange={(e: any) => dispatch(e.target)}
                  onBlur={handleBlur}
                  errorMessage={
                    errors.surname && formatMessage(messages.errorRequired)
                  }
                />
              </div>
            </div>
            {/* EMAIL INPUT */}
            <div className={`${handles.form__input} mt4  mb4`}>
              <Input
                name="email"
                type="email"
                placeholder={formatMessage(messages.emailPlaceholder)}
                value={form.email}
                onChange={(e: any) => dispatch(e.target)}
                onBlur={handleBlur}
                errorMessage={
                  errors.email && formatMessage(messages.invalidMail)
                }
              />
            </div>
          </>
        ) : (
          <></>
        )}
        {/* BACK IN STOCK CHECKBOX */}
        <div className={`${handles.form__checkbox} mb3 flex flex-column tj`}>
          <Checkbox
            name="notify"
            id="notify"
            checked={isNotify}
            type="text"
            value={isNotify}
            onChange={(e: any) => handleNotifycheckbox(e)}
            label={
              textCheckboxNotify || formatMessage(messages.backInStockCheckbox)
            }
          />
          {errors.notify && (
            <span className={`c-danger mt3 mb3`}>
              {formatMessage(messages.errorRequired)}
            </span>
          )}
        </div>

        {/* NEWSLETTER CHECKBOX */}
        <div className={`${handles.form__checkbox} tj`}>
          <Checkbox
            name="Optin"
            id="Optin"
            checked={isOptin}
            type="text"
            value={isOptin}
            onChange={(e: any) => setIsOptin(e.target.checked)}
            label={textCheckboxOptin || formatMessage(messages.optinCheckbox)}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div
          className={`${handles['form__button-submit']} flex items-center justify-center mt4 mb4 b`}
        >
          {loadingOptin || loading ? (
            <Spinner color="#953d1b" />
          ) : (
            <Button type="submit" size="small">
              {textButton || formatMessage(messages.submitButton)}
            </Button>
          )}
        </div>

        {/* AFTER SUBMIT/EMPTY FIELDS MESSAGES */}
        <div className="flex flex-column">
          {/* INPUT FIELDS ERROR MESSAGE */}
          {Object.values(errors).some(errorBoolean => errorBoolean) ? (
            <span
              className={`${handles['form__text-error']} c-danger center mb4 tc`}
            >
              {formatMessage(messages.errorSubmitEmpty)}
            </span>
          ) : (
            <></>
          )}

          {/* BIS MESSAGE */}
          {statusBackInStock &&
            (statusBackInStock === 'SUCCESS' ? (
              <span
                className={`${handles['form__text-success']} center mb4 tc`}
              >
                {successTextBackInStock ??
                  formatMessage(messages.successNotifyMessage)}
              </span>
            ) : (
              <span
                className={`${handles['form__text-error']} c-danger center mb4 tc`}
              >
                {formatMessage(messages.errorNotifyMessage)}
              </span>
            ))}

          {/* NEWSLETTER MESSAGE */}
          {statusNewsletter &&
            (statusNewsletter === 'SUCCESS' ? (
              <span
                className={`${handles['form__text-success']} center mb4 tc`}
              >
                {successTextNewsletter ??
                  formatMessage(messages.successNewsletterMessage)}
              </span>
            ) : (
              <span
                className={`${handles['form__text-error']} c-danger center mb4 tc`}
              >
                {handleNewsletterMessage()}
              </span>
            ))}
        </div>
      </form>
    </div>
  )
}

AvailabilitySubscriber.schema = {
  title: 'Availability Subscriber Form',
  description:
    'Component that render the Availability Subscriber Form (Back In Stock Form)',
  type: 'object',
  properties: {
    title: {
      title: 'Form title',
      description: '',
      default: 'Voglio sapere quando questo prodotto sarà disponibile',
      type: 'string',
    },
    textButton: {
      title: 'Button text',
      description: 'Label shown on the submit button',
      default: 'Avvisami quando disponibile',
      type: 'string',
    },
    textCheckboxNotify: {
      title: 'Notify Checkbox Text',
      description:
        'Text shown in the first checkbox, the one related to the Availability subscription',
      default: '',
      type: 'string',
    },
    textCheckboxOptin: {
      title: 'Optin Checkbox Text',
      description:
        'Text shown in the second checkbox, the one related to the Newsletter subscription',
      default: '',
      type: 'string',
    },
    campaign: {
      title: 'External Campaign',
      description:
        'External Campaign name associated with this Availability subscription',
      default: '',
      type: 'string',
      maxLength: 30,
    },
    successTextNewsletter: {
      title: 'Success Text Newsletter',
      description: 'Success text shown after newsletter subscription',
      default: '',
      type: 'string',
    },
    successTextBackInStock: {
      title: 'Success Text Back In Stock',
      description: 'Success text shown after back in stock subscription',
      default: '',
      type: 'string',
    },
  },
}

export default AvailabilitySubscriber
