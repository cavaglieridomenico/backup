/**
 * @param {FormProps}
 * @returns A form used for the Back in Stock Alert subscription
 */
import React, { useState, useReducer, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useLogicForm, handleApi } from './hooks/useLogicForm'
import { Input, Checkbox, Button, Spinner } from 'vtex.styleguide'
import RichText from 'vtex.rich-text/index'
import AfterSubmitMessages from './components/AfterSubmitMessages'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { CheckboxProps, FormProps } from './typings/global'
import { CSS_HANDLES, messages } from './utils/utils'
import FormSkeleton from './components/FormSkeleton'
import { getDefaultSeller } from './utils/sellers'
import { useProduct, /*Seller*/ } from 'vtex.product-context'

const reducer = (state: any, target: any) => ({
  ...state,
  [target.name]: target.value,
})

const initialForm = {
  name: '',
  surname: '',
  email: '',
}

const BackInStock: StorefrontFunctionComponent<FormProps> = ({
  title,
  subtitles = [],
  namePlaceholder,
  surnamePlaceholder,
  emailPlaceholder,
  showInputLabels = false,
  nameLabel,
  surnameLabel,
  emailLabel,
  checkboxes = [],
  privacyPolicyTextArray = [],
  privacyPolicyTextArrayAfterCheckboxes = [],
  errorRequiredField,
  errorInvalidMail,
  campaign = 'FORM_LP_BACKINSTOCK',
  submitButtonText,
  successMessageNewsletter = 'Subscription to newsletter done succesfully',
  successMessageSubscriptionToBIS = 'Subscription to back in stock done succesfully',
  errorMessageSubscriptionToBIS = 'Subscription to back in stock failed, retry',
  registeredErrorMessage = 'This email is already registered!',
  shouldLogInErrorMessage = 'This email is already associated to one account, please log in to continue',
  genericApiErrorMessage = 'Something went wrong, try again.',
  available,
  skuId,
}: FormProps) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [isFormLoading, setFormLoading] = useState<boolean>(true)

  // Handles form values
  const [form, dispatch] = useReducer(reducer, initialForm)
  // Handles for style
  const handles = useCssHandles(CSS_HANDLES)
  // Formatted messages
  const { formatMessage } = useIntl()
  // Email regEx to validated email
  const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g
  const [checkboxesState, setCheckboxesState] = useState<any>(
    new Array(checkboxes?.length)?.fill(false)
  )
  const [showErrors, setShowErrors] = useState<boolean>(false)
  // Array to check which checkbox is for newsletter --> it will be used for newsletterOptin
  const wichOneIsNewsletter = checkboxes.map(
    (item: CheckboxProps) => item?.checkboxNewsletter
  )
  // Array to check if every required checkbox is checked
  const errorCheckboxes = checkboxes?.map(
    ({ checkboxRequired }: CheckboxProps, index: number) =>
      checkboxRequired && !checkboxesState[index]
  )
  // If no checked checkboxes at whichOneIsNewsletter index --> optInCheck = false
  const optInCheck = !wichOneIsNewsletter.some(
    (isNewsletter: boolean | undefined, index: number): boolean =>
      !!isNewsletter && !checkboxesState[index]
  )
  //check form if is valid
  const errors = {
    name: !form.name,
    surname: !form.surname,
    email: !regEx.test(form.email),
  }

  const isAvailable = (commertialOffer?: any['commertialOffer']) => {
    return (
      commertialOffer &&
      (Number.isNaN(+commertialOffer.AvailableQuantity) ||
        commertialOffer.AvailableQuantity > 0)
    )
  }


  const productContext = useProduct()
  const seller = getDefaultSeller(productContext?.selectedItem?.sellers)
  available = available ?? isAvailable(seller?.commertialOffer)
  skuId = skuId ?? productContext?.selectedItem?.itemId

  // handleSubmit and status from useNewsletterForm Hook
  const {
    handleSubmit,
    sessionApi,
    loading,
    statusNewsletter,
    statusBackInStock,
  } = useLogicForm({
    form,
    errors,
    errorCheckboxes,
    optInCheck,
    campaign,
    setShowErrors,
    loggedIn,
  })

  // Handle Inputs onBlur
  const handleBlur = (e: any) => {
    (errors as any)[e.target.name] =
      !e.target.validity.valid || !e.target.value
  }

  // set if user is logged and set state with wich one checkboxes are marked as newsletter
  useEffect(() => {
    //user is loggedin?
    isAuth()

  }, [])

  // Handle onChange checkboxes
  const handleOnChangeCheckbox = (position: number) => {
    /* set Value to checkbox in position x */
    const updatedCheckboxesState = checkboxesState.map(
      (item: boolean, index: number) => (index == position ? !item : item)
    )
    //save array with state data in a state
    setCheckboxesState(updatedCheckboxesState)
  }

  // Function to check if user is loggedIn
  const isAuth = async () => {
    const profile = await handleApi('GET', sessionApi)
    setLoggedIn(profile?.namespaces?.profile?.isAuthenticated.value === "true")
    if (profile && profile?.namespaces?.profile?.email?.value) {
      dispatch({ name: 'email', value: profile?.namespaces?.profile?.email?.value })
      dispatch({ name: 'name', value: profile?.namespaces?.profile?.firstName?.value })
      dispatch({ name: 'surname', value: profile?.namespaces?.profile?.lastName?.value })
    }
    setFormLoading(false)
  }

  // Render component only if the product is out of stock
  if (available || !skuId) {
    return <></>
  }

  return (
    <div
      className={`${handles.form__container} flex flex-column items-center justify-center ph6`}
    >
      {isFormLoading ? (
        <div className={`flex justify-center items-center`}>
          <FormSkeleton />
        </div>
      ) : (
        <>
          {/* TITLE */}
          <div className={`${handles.container__title}`}>{title}</div>
          {/* SUBTITLE TEXTS*/}
          {subtitles.map((subtitleText: any, i: number) => (
            <div
              className={`${handles['container__text-subtitle']} tc`}
              key={`subtitle${i}`}
            >
              <RichText text={subtitleText?.__editorItemTitle} />
            </div>
          ))}
          {!loggedIn && ( //If loggedIn show only the checkbox
            <>
              <div className={`${handles['form__container-inputs']}`}>
                <div
                  className={`${applyModifiers(
                    handles['form__container-name'],
                    errors.name && showErrors ? 'error' : ''
                  )} flex w-100 mr1`}
                >
                  <Input
                    id="Name"
                    name="name"
                    type="text"
                    value={form.name}
                    label={showInputLabels && nameLabel}
                    placeholder={
                      namePlaceholder ?? formatMessage(messages.namePlaceholder)
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(e.target)
                    }
                    onBlur={handleBlur}
                    errorMessage={
                      errors.name && showErrors && errorRequiredField
                    }
                  />
                </div>

                <div
                  className={`${applyModifiers(
                    handles['form__container-surname'],
                    errors.surname && showErrors ? 'error' : ''
                  )} flex w-100 ml1`}
                >
                  <Input
                    id="Surname"
                    name="surname"
                    type="text"
                    value={form.surname}
                    label={showInputLabels && surnameLabel}
                    placeholder={
                      surnamePlaceholder ??
                      formatMessage(messages.surnamePlaceholder)
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(e.target)
                    }
                    onBlur={handleBlur}
                    errorMessage={
                      errors.surname && showErrors && errorRequiredField
                    }
                  />
                </div>
              </div>

              <div
                className={`${applyModifiers(
                  handles['form__container-email'],
                  errors.email && showErrors ? 'error' : ''
                )} mb3`}
              >
                <Input
                  id="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  label={showInputLabels && emailLabel}
                  placeholder={
                    emailPlaceholder ?? formatMessage(messages.emailPlaceholder)
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(e.target)
                  }
                  onBlur={handleBlur}
                  errorMessage={
                    errors.email &&
                    showErrors &&
                    (!form.email ? errorRequiredField : errorInvalidMail)
                  }
                />
              </div>
            </>
          )}

          {/* PRIVACY SECTION */}
          <div className={handles.container__privacy}>
            {/* PRIVACY TEXTS BEFORE CHECKBOXES */}
            {privacyPolicyTextArray.map((policyText: any, i: number) => (
              <div
                className={handles['container__text-privacy']}
                key={`policy${i}`}
              >
                <RichText text={policyText.__editorItemTitle} />
              </div>
            ))}

            {/* CHECKBOXES CONTAINER */}
            <div
              id="checkbox-container"
              className={`flex flex-column justify-center items-left tj mb4`}
            >
              {checkboxes?.map((item: CheckboxProps, index: number) => (
                <div
                  className={`${applyModifiers(
                    handles[`form__checkbox`],
                    errorCheckboxes[index] && showErrors ? 'error' : ''
                  )}`}
                  id="checkbox-wrapper"
                  key={`div-checkbox-${index}`}
                >
                  <Checkbox
                    id={`custom-checkbox-${index}`}
                    name={item?.checkboxLabel}
                    label={<RichText text={item?.checkboxLabel} />}
                    value={checkboxesState[index]}
                    checked={checkboxesState[index]}
                    onChange={() => handleOnChangeCheckbox(index)}
                  />
                  {errorCheckboxes[index] && showErrors && (
                    <div className="c-danger t-small lh-title">
                      {item?.checkboxError}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* PRIVACY TEXTS AFTER CHECKBOXES */}
            {privacyPolicyTextArrayAfterCheckboxes.map(
              (policyText: any, i: number) => (
                <div
                  className={handles['container__text-privacy']}
                  key={`second-policy${i}`}
                >
                  <RichText text={policyText.__editorItemTitle} />
                </div>
              )
            )}
          </div>

          {/* SUBMIT BUTTON */}

          <div
            className={`${handles['form__container-btn']} flex justify-center mv5`}
          >
            {statusNewsletter === 'LOADING' || loading ? (
              <Spinner />
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={statusBackInStock === 'SUCCESS'}
              >
                {submitButtonText ?? formatMessage(messages.submitBtn)}
              </Button>
            )}
          </div>

          {statusBackInStock && (
            <AfterSubmitMessages
              statusNewsletter={statusNewsletter}
              statusBackInStock={statusBackInStock}
              userMessages={{
                registeredErrorMessage,
                shouldLogInErrorMessage,
                successMessageNewsletter,
                genericApiErrorMessage,
                errorMessageSubscriptionToBIS,
                successMessageSubscriptionToBIS,
              }}
            />
          )}
        </>
      )}
    </div>
  )

}

BackInStock.schema = {
  title: 'Back In Stock',
  description:
    'Form that allow User to receive alert when Product will back in stock',
  type: 'object',
  properties: {
    title: {
      title: 'Form Title',
      description: 'Set the text shown in the form title',
      default: "I want know when this products it will back in stock",
      type: 'string',
    },
    subtitles: {
      type: 'array',
      title: 'Form Subtitles',
      items: {
        title: 'Set texts of subtitle',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title:
              "Insert text to shown as subtitle (markdown language so it's like setting a RichText)",
            type: 'string',
            default: "Provide your information below and we'll email you when the product is available for purchase.",
            widget: {
              'ui:widget': 'textarea',
            },
          },
        },
      },
    },
    namePlaceholder: {
      title: 'Name  Placeholder',
      description: 'Set the text shown in name input placeholder',
      default: "Name*",
      type: 'string',
    },
    surnamePlaceholder: {
      title: 'Surname Placeholder',
      description: 'Set the text shown in surname input placeholder',
      default: "Surname*",
      type: 'string',
    },
    emailPlaceholder: {
      title: 'Email Placeholder',
      description: 'Set the text shown in email input placeholder',
      default: "E-mail*",
      type: 'string',
    },
    showInputLabels: {
      title: 'Show Input Labels',
      description: 'Choose to show or not labels up to Input fields',
      type: 'boolean',
    },

    nameLabel: {
      title: 'Name  Label',
      description: 'Set the text shown in name input label',
      type: 'string',
      default: "Name*",
      required: ['showInputLabels'],
    },
    surnameLabel: {
      title: 'Surname Label',
      description: 'Set the text shown in surname input label',
      type: 'string',
      default: "Surname*",
      required: ['showInputLabels'],
    },
    emailLabel: {
      title: 'Email Label',
      description: 'Set the text shown in email input label',
      type: 'string',
      default: "E-mail*",
      required: ['showInputLabels'],
    },
    errorRequiredField: {
      title: 'Error Required Field',
      description: 'Error message to shown on required fields',
      default: "This field is required",
      type: 'string',
    },
    errorInvalidMail: {
      title: 'Error Invalid Mail',
      description: 'Error message to shown on invalid email format',
      default: "Insert a valid e-mail",
      type: 'string',
    },
    privacyPolicyTextArray: {
      type: 'array',
      title: 'Privacy Text',
      items: {
        title: 'Text of privacyPolicy ',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text and link of privacy using markdown',
            type: 'string',
            default: "* I agree to the Terms of Use and acknowledge the Privacy Notice [click here](https://www.google.com)",
            widget: {
              'ui:widget': 'textarea',
            },
          },
        },
      },
    },
    checkboxes: {
      type: 'array',
      title: 'Checkboxes to print',
      items: {
        properties: {
          checkboxLabel: {
            title: 'Checkbox Label',
            description: 'Set the text shown right to the checkbox',
            type: 'string',
            default: "* I agree to the Terms of Use and acknowledge the Privacy Notice",
            widget: {
              'ui:widget': 'textarea',
            },
          },
          checkboxRequired: {
            title: 'Checkbox Required',
            description:
              'Set true if this checkbox is required in order to submit correctly',
            type: 'boolean',
          },
          checkboxNewsletter: {
            title: 'Checkbox Newsletter',
            description:
              'Set true if this checkbox is related to the Newsletter Optin (necessary to subscribe User to Newsletter)',
            type: 'boolean',
          },
          checkboxError: {
            title: 'Checkbox Error',
            description:
              'Error message to shown under checkbox (this will be shown only if checkbox is required)',
            default: "This field is required to continue",
            type: 'string',
          },
        },
      },
    },
    privacyPolicyTextArrayAfterCheckboxes: {
      type: 'array',
      title: 'Privacy Text After Checkboxes',
      items: {
        title: 'Text of privacyPolicy ',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text and link of privacy using markdown',
            type: 'string',
            default: "* I agree to the Terms of Use and acknowledge the Privacy Notice [click here](https://www.google.com)",
            widget: {
              'ui:widget': 'textarea',
            },
          },
        },
      },
    },
    campaign: {
      title: 'Campaign value',
      description: 'Set the value of the campaign',
      default: 'FORM_LP_BACKINSTOCK',
      type: 'string',
    },
    submitButtonText: {
      title: 'Submit Button Text',
      default: "Submit",
      description: 'Set the text shown in the submit button',
      type: 'string',
    },
    successMessageSubscriptionToBIS: {
      title: 'Success Message Back in Stock',
      description:
        'Message to display when the user successfully subscribe to Back in Stock',
      default: "An e-mail will be send to you when the item come back in stock",
      type: 'string',
    },
    successMessageNewsletter: {
      title: 'Success Message Newsletter',
      default: "Welcome to our newsletter!",
      description:
        'Message to display when the user successfully subscribe to Newsletter',
      type: 'string',
    },
    registeredErrorMessage: {
      title: 'Registered Error Message Newsletter',
      default: "This e-mail is already registered to newsletter service",
      description:
        'Message to display when the user is already registered to newsletter',
      type: 'string',
    },
    shouldLogInErrorMessage: {
      title: 'Should Login Error Message Newsletter',
      default: "To change newsletter preference option of this e-mail you need to be logged with same account",
      description:
        'Message to display when the user already has an account in VTEX, so to update the newsletter optin it needs to be logged in',
      type: 'string',
    },
    errorMessageSubscriptionToBIS: {
      title: 'Error Message to subscription Back in Stock',
      default: "Something wrong during subscription to back in stock",
      description:
        'Message to display when the the subscription to Back in Stock fail',
      type: 'string',
    },
    genericApiErrorMessage: {
      title: 'Generic API Error Message',
      default: "Something wrong server side, please retrys soon",
      description:
        'Message to display when the API call to subscribe User to newsletter goes wrong',
      type: 'string',
    },
  },
}

export default BackInStock
