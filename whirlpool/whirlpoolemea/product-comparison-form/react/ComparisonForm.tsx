import React, { useState, useEffect, useReducer } from 'react'
import { Input, Checkbox, Button, Spinner } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { ProductComparisonContext } from 'vtex.product-comparison'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { messages, CSS_HANDLES, splitString } from './utils/utils'
import FormSkeleton from './components/FormSkeleton'
import RichText from 'vtex.rich-text/index'
import AfterSubmitMessages from './components/AfterSubmitMessages'
import { handleApi, useComparisonForm } from './hooks/useComparisonForm'

interface CheckboxProps {
  checkboxLabel?: string
  checkboxRequired?: boolean
  checkboxNewsletter?: boolean
  checkboxError?: string
}

interface ComparisonFormProps {
  campaign?: string
  title?: string
  description?: string
  namePlaceholder?: string
  surnamePlaceholder?: string
  emailPlaceholder?: string
  showInputLabels?: boolean
  nameLabel?: string
  surnameLabel?: string
  emailLabel?: string
  errorMessageRequiredField?: string
  errorMessageInvalidMail?: string
  textsBeforeCheckboxes?: string[]
  checkboxes?: CheckboxProps[]
  textsAfterCheckboxes?: string[]
  submitButtonText?: string
  productSpecificationGroupsToHide: string
  successMessageComparisonSubscription?: string
  errorMessageComparisonSubscription?: string
  successMessageNewsletterSubscription?: string
  errorMessageNewsletterRegistered?: string
  errorMessageNewsletterLogin?: string
  errorMessageApiIssue?: string
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
  campaign = 'FORM_LP_PRODUCTCOMPARISON',
  title = 'Product Comparison Form',
  description = 'Subtitle of the comparison form',
  namePlaceholder,
  surnamePlaceholder,
  emailPlaceholder,
  showInputLabels = false,
  nameLabel,
  surnameLabel,
  emailLabel,
  errorMessageRequiredField,
  errorMessageInvalidMail,
  textsBeforeCheckboxes,
  checkboxes,
  textsAfterCheckboxes,
  submitButtonText,
  productSpecificationGroupsToHide,
  successMessageComparisonSubscription,
  errorMessageComparisonSubscription,
  successMessageNewsletterSubscription,
  errorMessageNewsletterRegistered,
  errorMessageNewsletterLogin,
  errorMessageApiIssue,
}) => {
  // handles for style
  const handles = useCssHandles(CSS_HANDLES)
  // formatMessage for FormattedMessages
  const { formatMessage } = useIntl()
  // Handle form values and errors
  const [form, dispatch] = useReducer(reducer, initialForm)
  // Email regEx to validated email
  const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g
  //check form if is valid
  const errors = {
    name: !form.firstName,
    surname: !form.surname,
    email: !regEx.test(form.email),
  }
  const [checkboxesState, setCheckboxesState] = useState<any>(
    new Array(checkboxes?.length)?.fill(false)
  )
  const [showErrors, setShowErrors] = useState<boolean>(false)
  // Array to check which checkbox is for newsletter --> it will be used for newsletterOptin
  const wichOneIsNewsletter = checkboxes?.map(
    (item: CheckboxProps) => item?.checkboxNewsletter
  )
  // If no checked checkboxes at whichOneIsNewsletter index --> optInCheck = false
  const optInCheck = !wichOneIsNewsletter?.some(
    (isNewsletter: boolean | undefined, index: number): boolean =>
      !!isNewsletter && !checkboxesState[index]
  )
  // Array to check if every required checkbox is checked
  const errorCheckboxes = checkboxes
    ? checkboxes?.map(
        ({ checkboxRequired }: CheckboxProps, index: number) =>
          checkboxRequired && !checkboxesState[index]
      )
    : []
  // Handle if user is LoggedIn
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
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

  const { handleSubmit, userSessionApi, statusNewsletter, statusComparison } =
    useComparisonForm({
      form,
      errors,
      errorCheckboxes,
      optInCheck,
      campaign,
      setShowErrors,
      isLoggedIn,
      productsSkuIds,
      productSpecificationGroupsToHideArray,
    })

  // Check if user is logged in
  useEffect(() => {
    handleApi('GET', userSessionApi)
      .then((res) => {
        if (res) {
          let profile = res.namespaces?.profile
          setIsLoggedIn(profile?.isAuthenticated.value === 'true')
          if (profile?.email?.value) {
            dispatch({
              name: 'email',
              value: profile?.email?.value,
            })
            dispatch({
              name: 'firstName',
              value: profile?.firstName?.value,
            })
            dispatch({
              name: 'surname',
              value: profile?.lastName?.value,
            })
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => setIsFormLoading(false))
  }, [])

  // Handle Inputs onBlur
  const handleBlur = (e: any) => {
    ;(errors as any)[e.target.name] =
      !e.target.validity.valid || !e.target.value
  }

  // Handle onChange checkboxes
  const handleOnChangeCheckbox = (position: number) => {
    /* set Value to checkbox in position x */
    const updatedCheckboxesState = checkboxesState.map(
      (item: boolean, index: number) => (index == position ? !item : item)
    )
    //save array with state data in a state
    setCheckboxesState(updatedCheckboxesState)
  }

  return !isFormLoading ? (
    <div
      className={`${handles.container} flex flex-column items-center justify-center`}
    >
      {/* TITLE AND DESCRIPTION */}
      <h2 className={`${handles.text__title} mb0`}>{title}</h2>
      <h4 className={`${handles.text__description} mt4`}>{description}</h4>
      {/* FORM */}
      <form className={handles.container__form} onSubmit={handleSubmit}>
        <div>
          {/* IF !LOGGEDIN USER, SHOW INPUT FIELDS */}
          {!isLoggedIn && (
            <>
              {/* NAME AND SURNAME */}
              <div
                className={`${handles.container__inputs} flex-ns justify-between mt4`}
              >
                <div
                  className={`${handles.container__input} ${handles.container__input_name} w-100 mr5 mb4`}
                >
                  <Input
                    label={
                      showInputLabels &&
                      (nameLabel ?? formatMessage(messages.nameLabel))
                    }
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    placeholder={
                      namePlaceholder ?? formatMessage(messages.namePlaceholder)
                    }
                    onChange={(e: any) => dispatch(e.target)}
                    onBlur={handleBlur}
                    errorMessage={
                      errors.name &&
                      showErrors &&
                      (errorMessageRequiredField ??
                        formatMessage(messages.errorEmptyField))
                    }
                  />
                  <span></span>
                </div>
                <div
                  className={`${handles.container__input} ${handles.container__input_surname} w-100 ml5 mb4`}
                >
                  <Input
                    label={
                      showInputLabels &&
                      (surnameLabel ?? formatMessage(messages.surnameLabel))
                    }
                    name="surname"
                    type="text"
                    placeholder={
                      surnamePlaceholder ??
                      formatMessage(messages.surnamePlaceholder)
                    }
                    value={form.surname}
                    onBlur={handleBlur}
                    onChange={(e: any) => dispatch(e.target)}
                    errorMessage={
                      errors.surname &&
                      showErrors &&
                      (errorMessageRequiredField ??
                        formatMessage(messages.errorEmptyField))
                    }
                  />
                  <span></span>
                </div>
              </div>
              {/* EMAIL */}
              <div
                className={`${handles.container__input} ${handles.container__input_email} mt4  mb4`}
              >
                <Input
                  label={
                    showInputLabels &&
                    (emailLabel ?? formatMessage(messages.emailLabel))
                  }
                  name="email"
                  type="email"
                  placeholder={
                    emailPlaceholder ?? formatMessage(messages.emailPlaceholder)
                  }
                  value={form.email}
                  onChange={(e: any) => dispatch(e.target)}
                  onBlur={handleBlur}
                  errorMessage={
                    errors.email &&
                    showErrors &&
                    (!form.email
                      ? errorMessageRequiredField ??
                        formatMessage(messages.errorEmptyField)
                      : errorMessageInvalidMail ??
                        formatMessage(messages.errorInvalidMail))
                  }
                />
              </div>
            </>
          )}
          {/* PRIVACY SECTION */}
          <div className={handles.container__privacy}>
            {/* PRIVACY TEXTS BEFORE CHECKBOXES */}
            {textsBeforeCheckboxes &&
              textsBeforeCheckboxes.map((policyText: any, i: number) => (
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
              {checkboxes &&
                checkboxes.map((item: CheckboxProps, index: number) => (
                  <div
                    className={`${applyModifiers(
                      handles[`container__checkbox`],
                      errorCheckboxes && errorCheckboxes[index] && showErrors
                        ? 'error'
                        : ''
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
                    {errorCheckboxes &&
                      errorCheckboxes[index] &&
                      showErrors && (
                        <div className="c-danger t-small lh-title">
                          {item?.checkboxError}
                        </div>
                      )}
                  </div>
                ))}
            </div>

            {/* PRIVACY TEXTS AFTER CHECKBOXES */}
            {textsAfterCheckboxes &&
              textsAfterCheckboxes.map((policyText: any, i: number) => (
                <div
                  className={handles['container__text-privacy']}
                  key={`second-policy${i}`}
                >
                  <RichText text={policyText.__editorItemTitle} />
                </div>
              ))}
          </div>

          {/* SUBMIT BUTTON or SPINNER LOADER */}
          <div
            className={`${handles.container__button} flex justify-center items-center mb4`}
          >
            {statusNewsletter !== 'LOADING' &&
            statusComparison !== 'LOADING' ? (
              <Button
                className={handles.button__submit}
                type="submit"
                variation="primary"
              >
                {submitButtonText ?? formatMessage(messages?.submitBtnText)}
              </Button>
            ) : (
              <Spinner />
            )}
          </div>
        </div>

        {/* MESSAGES TO SHOW AFTER SUBMIT */}
        <AfterSubmitMessages
          statusComparison={statusComparison}
          statusNewsletter={statusNewsletter}
          successMessageComparisonSubscription={
            successMessageComparisonSubscription
          }
          errorMessageComparisonSubscription={
            errorMessageComparisonSubscription
          }
          successMessageNewsletterSubscription={
            successMessageNewsletterSubscription
          }
          errorMessageNewsletterRegistered={errorMessageNewsletterRegistered}
          errorMessageNewsletterLogin={errorMessageNewsletterLogin}
          errorMessageApiIssue={errorMessageApiIssue}
        />
      </form>
    </div>
  ) : (
    <FormSkeleton />
  )
}

ComparisonForm.schema = {
  title: 'Product Comparison Form',
  description: 'Component for the product comparison form',
  type: 'object',
  properties: {
    campaign: {
      title: 'Campaign',
      description: 'Name of the external campaign related to this form',
      default: 'FORM_LP_PRODUCTCOMPARISON',
      type: 'string',
    },
    title: {
      title: 'Form title',
      description: 'Title of the comparison form',
      default: 'Comparison form title',
      type: 'string',
    },
    description: {
      title: 'Form subtitle',
      description: 'Subtitle of the comparison form',
      default: 'Comparison form subtitle',
      type: 'string',
    },
    namePlaceholder: {
      title: 'Name  Placeholder',
      description: 'Set the text shown in name input placeholder',
      default: 'Name*',
      type: 'string',
    },
    surnamePlaceholder: {
      title: 'Surname Placeholder',
      description: 'Set the text shown in surname input placeholder',
      default: 'Surname*',
      type: 'string',
    },
    emailPlaceholder: {
      title: 'Email Placeholder',
      description: 'Set the text shown in email input placeholder',
      default: 'E-mail*',
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
      default: 'Name*',
      required: ['showInputLabels'],
    },
    surnameLabel: {
      title: 'Surname Label',
      description: 'Set the text shown in surname input label',
      type: 'string',
      default: 'Surname*',
      required: ['showInputLabels'],
    },
    emailLabel: {
      title: 'Email Label',
      description: 'Set the text shown in email input label',
      type: 'string',
      default: 'E-mail*',
      required: ['showInputLabels'],
    },
    errorMessageRequiredField: {
      title: 'Error Message Required Field',
      description: 'Error message to shown on required fields',
      default: 'This field is required',
      type: 'string',
    },
    errorMessageInvalidMail: {
      title: 'Error Message Invalid Mail',
      description: 'Error message to shown on invalid email format',
      default: 'Insert a valid e-mail',
      type: 'string',
    },
    textsBeforeCheckboxes: {
      type: 'array',
      title: 'Texts before checkboxes',
      items: {
        title: 'Text before checkboxes',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text to show in markdown language',
            type: 'string',
            default:
              '* I agree to the Terms of Use and acknowledge the Privacy Notice [click here](https://www.google.com)',
            widget: {
              'ui:widget': 'textarea',
            },
          },
        },
      },
    },
    checkboxes: {
      type: 'array',
      title: 'Checkboxes to show',
      description: 'Set checkboxes to show in the form',
      items: {
        properties: {
          checkboxLabel: {
            title: 'Checkbox Label',
            description: 'Set the text shown right to the checkbox',
            type: 'string',
            widget: {
              'ui:widget': 'textarea',
            },
          },
          checkboxRequired: {
            title: 'Checkbox Required',
            description:
              'Set true if this checkbox is required in order to submit form successfully',
            type: 'boolean',
          },
          checkboxNewsletter: {
            title: 'Checkbox Newsletter',
            description:
              'Set true if this checkbox is related to the Newsletter Optin (necessary to subscribe user to Newsletter)',
            type: 'boolean',
          },
          checkboxError: {
            title: 'Checkbox Error',
            description:
              'Error message to shown under checkbox (this will be shown only if checkbox is required)',
            type: 'string',
          },
        },
      },
    },
    textsAfterCheckboxes: {
      type: 'array',
      title: 'Texts After Checkboxes',
      description: 'List of texts shown after checkboxes',
      items: {
        title: 'Text after checkboxes',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text to show in markdown language',
            type: 'string',
            default:
              '* I agree to the Terms of Use and acknowledge the Privacy Notice [click here](https://www.google.com)',
            widget: {
              'ui:widget': 'textarea',
            },
          },
        },
      },
    },
    submitButtonText: {
      title: 'Submit Button Text',
      description: 'Text shown in the submit button',
      default: 'Send',
      type: 'string',
    },
    productSpecificationGroupsToHide: {
      title: 'Product Specification To Hide',
      description:
        'List of Product Specification To Hide comma separated, example: SpecificationGroup1,SpecificationGroup2',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    successMessageComparisonSubscription: {
      title: 'Success Message Back in Stock',
      description:
        'Message to display when the user successfully subscribe to Back in Stock',
      default: 'An e-mail will be send to you when the item come back in stock',
      type: 'string',
    },
    errorMessageComparisonSubscription: {
      title: 'Error Message Comparison Subscription',
      description:
        'Message to display when the the subscription to Product Comparison form fail',
      default: 'Something wrong during subscription to product comparison',
      type: 'string',
    },
    successMessageNewsletterSubscription: {
      title: 'Success Message Newsletter',
      default: 'Welcome to our newsletter!',
      description:
        'Message to display when the user successfully subscribe to Newsletter',
      type: 'string',
    },
    errorMessageNewsletterRegistered: {
      title: 'Error Message Newsletter Registered',
      description:
        'Message to display when the user is already registered to newsletter',
      default: 'This e-mail is already registered to newsletter service',
      type: 'string',
    },
    errorMessageNewsletterLogin: {
      title: 'Error Message Newsletter Login',
      description:
        'Message to display when the user already has an account in VTEX, so to update the newsletter optin it needs to be logged in',
      default:
        'To change newsletter preference option of this e-mail you need to be logged with same account',
      type: 'string',
    },
    errorMessageApiIssue: {
      title: 'Error Message API Issue',
      description: 'Message to display when the API call goes wrong',
      default: 'Something wrong server side, please retrys soon',
      type: 'string',
    },
  },
}

export default ComparisonForm
