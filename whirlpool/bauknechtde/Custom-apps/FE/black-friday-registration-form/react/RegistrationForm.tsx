/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { useState, useReducer, FormEvent } from 'react';
import { Input, Checkbox, Button, Spinner } from 'vtex.styleguide';
// import { useRuntime } from 'vtex.render-runtime';
import { useCssHandles } from 'vtex.css-handles';
import { useIntl } from 'react-intl';
import {
  CSS_HANDLES,
  messages,
  putNewUser,
  RegistrationFormProps,
  WindowGTM,
  UserErrors,
  UserMessage
} from './utils/utilsFunction';

const reducer = (state: any, target: any) => ({
  ...state,
  [target.name]: target.value,
})

const initialForm = {
  name: '',
  surname: '',
  email: '',
}

const RegistrationForm: StorefrontFunctionComponent<RegistrationFormProps> = ({
  campaignName = "FORM_LP_BLACKFRIDAY",
  formTopText,
  namePlaceholder,
  surnamePlaceholder,
  emailPlaceholder,
  submitBtnText,
  privacyText = "Ich verstehe und bestätige den Inhalt der ",
  privacyText2 = ":",
  privacyLink = "/seiten/datenschutzerklaerung",
  privacyLinkText = "Datenschutzerklärung",
  privacyText3 = "Achtung: Felder mit (*) sind Pflichtfelder",
  checkboxLabel,
  emptyFieldErrorRequired,
  wrongEmail
}) => {
  // CSS Handles and Formatted Messages
  const handles = useCssHandles(CSS_HANDLES);
  const { formatMessage } = useIntl();
  // useReducer to handle form data
  const [form, dispatch] = useReducer(reducer, initialForm)
  // States for handling errors form
  const [errors, setErrors] = useState<UserErrors>({
    name: false,
    surname: false,
    email: false,
    checkbox: false,
  });
  // States for handling user messages after submit
  const [userMessage, setUserMessage] = useState<UserMessage>({
    successMessage: false,
    errorApiCall: false,
    errorAlreadyRegistered: false
  })
  // State for handling newsletterOptin checkbox
  const [optInCheck, setOptInCheck] = useState<boolean>(false)
  // State for handling submit loading
  const [loading, setLoading] = useState<boolean>(false)

  const handleBlur = (e: any) => {
    setErrors({
      ...errors,
      [e.target.name]: !e.target.validity.valid || !e.target.value,
    })
    if (e.target.name === "email") {
      validateEmail(e.target.value)
    }
  }

  const handleCheckbox = (e: any) => {
    setOptInCheck(e)
    setErrors({ ...errors, checkbox: !e })
  }

  const isFormValid = () => {
    //If some form values are not setted
    if (Object.values(form).some(formValue => !formValue)) {
      setErrors({
        ...errors,
        name: form.name ? false : true,
        surname: form.surname ? false : true,
        email: form.email && validateEmail(form.email) ? false : true,
        checkbox: optInCheck ? false : true
      })
      return false
    }
    if (!optInCheck) {
      setErrors({
        ...errors,
        checkbox: optInCheck ? false : true
      })
      return false
    }
    // If some errors are already present
    if (Object.values(errors).some(errorBoolean => errorBoolean)) {
      return false
    }
    // Otherwise form is valid
    return true
  }

  const validateEmail = (newEmail: string) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // If mail doesn't pass the regex test setError and return false
    if (!emailRegex.test(newEmail.toLowerCase())) {
      setErrors({
        ...errors,
        email: !emailRegex.test(newEmail.toLowerCase())
      })
      return false;
    }
    return true;
  };

  // reset all messages
  const resetMessages = () => {
    setUserMessage({
      successMessage: false,
      errorApiCall: false,
      errorAlreadyRegistered: false
    })
  }

  // Set campaign to send
  const newsletterUrl = window?.location?.href.split('?')[1]
  const targetCampaign =
    newsletterUrl?.toString()?.toUpperCase()?.replace('=', '') ?? campaignName?.toUpperCase()

  const handleSubscription = () => {

    let dataLayer = ((window as unknown) as WindowGTM).dataLayer || []

    //WHY BYPASSING IF USER IS ALREADY REGISTERED:
    //ON BKDE WE DON'T HAVE ANY DATA ABOUT USER
    //ALL USER DATA ARE SAVED ON CRM SIDE NOT IN VTEX
    //SO EVERYTIME IN EVERYCASE, WE MAKE ALWAYS A NEW SUBSCRIPTION AS A NEW ONE

    putNewUser(
      form.email,
      targetCampaign,
      form.name,
      form.surname
    ).then((response: any) => {
      if (response.toLowerCase() == "ok") {
        setUserMessage({ ...userMessage, successMessage: true })
        setLoading(false);
        dataLayer.push({
          event: "userRegistration",
        });
        dataLayer.push({
          event: "optin_granted",
        });
        dataLayer.push({
          event: "leadGeneration",
          eventCategory: "Lead Generation",
          eventAction: "Optin granted",
          eventLabel: "Lead from Black Friday landing page",
          email: form.email,
        });
        dataLayer.push({
          event: "emailForSalesforce",
          eventCategory: "Email for Salesforce",
          eventAction: "Email from Black Friday landing page",
          email: form.email,
        });
      } else {
        setUserMessage({ ...userMessage, errorApiCall: true })
        setLoading(false);
      }
    });
  }


  const resetForm = () => {
    // Reset form fields
    Object.keys(initialForm).forEach((name) => dispatch({ name, value: "" }));
    setOptInCheck(false)
  }


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    resetMessages()
    if (!isFormValid()) {
      return
    }

    // Submit start
    setLoading(true);
    handleSubscription();
    resetForm();
  }

  return (
    <div className={`${handles['bf__container']} flex flex-column items-center justify-center ph8 pv6`}>
      {/* TEXT BEFORE FORM */}
      <div className={`${handles["form__text-top"]} flex justify-center mb3 pa3`}>
        <p>{formTopText || formatMessage(messages.formTopText)}</p>
      </div>
      {/* FORM */}
      <form className={`${handles['form__container']} flex flex-column w-100`} onSubmit={(e: any) => handleSubmit(e)}>
        <div className={`${handles['form__container-row']} flex`}>
          {/* COL-1 */}
          <div className={`${handles['form__col-1']} flex flex-column justify-start w-100`}>
            {/* INPUT FIELDS */}
            <div className={`${handles['form__containerinputs']} flex justify-between`}>
              {/* NAME */}
              <div className={`${handles['form__container-input']} w-90`}>
                <Input
                  id="name"
                  name="name"
                  placeholder={namePlaceholder || formatMessage(messages.inputNamePlaceholder)}
                  value={form.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(e.target)
                  }
                  errorMessage={errors.name && (emptyFieldErrorRequired || formatMessage(messages.errorRequiredField))}
                  onBlur={handleBlur}
                />
              </div>
              {/* SURNAME */}
              <div className={`${handles['form__container-input']} w-90 ml5`}>
                <Input
                  id="surname"
                  name="surname"
                  placeholder={surnamePlaceholder || formatMessage(messages.inputSurnamePlaceholder)}
                  value={form.surname}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(e.target)
                  }
                  errorMessage={errors.surname && (emptyFieldErrorRequired || formatMessage(messages.errorRequiredField))}
                  onBlur={handleBlur}
                />
              </div>
              {/* EMAIL */}
              <div className={`${handles['form__container-input']} w-90 ml5`}>
                <Input
                  id="email"
                  name="email"
                  placeholder={
                    emailPlaceholder || formatMessage(messages.inputEmailPlaceholder)
                  }
                  type="email"
                  value={form.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(e.target)
                  }
                  errorMessage={errors.email && (wrongEmail || formatMessage(messages.errorEmail))}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            {/* PRIVACY SECTION */}
            <div className={`${handles["form__container-privacy"]} mb3`}>
              {/* PRIVACY TEXT */}
              <div className={`${handles["form__privacy-text"]}`}>
                <p>
                  {privacyText}
                  <a
                    className={`${handles["form__privacy-link"]}`}
                    href={privacyLink}
                    target="_blank">
                    {privacyLinkText}
                  </a>
                  {privacyText2}
                </p>
              </div>
              {/* PRIVACY CHECKBOX */}
              <div className={`${handles['form__checkBoxes']}`}>
                <Checkbox
                  checked={optInCheck}
                  id="optin"
                  name="checkbox"
                  onChange={(e: any) => { handleCheckbox(e.target.checked) }}
                  label={checkboxLabel || formatMessage(messages.checkboxOptinLabel)}
                />
                {errors.checkbox && (
                  <span className={'c-danger t-small mt1 fw6 lh-title'}>
                    {emptyFieldErrorRequired || formatMessage(messages.errorRequiredField)}
                  </span>
                )}
              </div>
              {/* PRIVACY TEXT AFTER CHECKBOX */}
              <div className={`${handles["form__privacy-text"]}`}>
                <p>{privacyText3}</p>
              </div>
            </div>
          </div>
          {/* COL-2 */}
          <div className={`${handles['form__col-2']} flex flex-column justify-start`}>
            <div className={`${handles['form__container-btn']} flex w-100 ml4`}>
              {!loading ?
                <Button type="submit">
                  {submitBtnText || formatMessage(messages.buttonSubmitText)}
                </Button>
                :
                <Spinner color={"#1e1e1e"} />
              }
            </div>
          </div>
        </div>
        {/* USER MESSAGE TO SHOW AFTER SUBMIT */}
        {Object.values(userMessage).some(message => message) &&
          <div className={`${handles["form__container-messages"]} mv4`}>
            {userMessage.errorApiCall &&
              <span className={`${handles["error__span-message"]} c-danger`}>
                {formatMessage(messages.errorApiCallMessage)}
              </span>
            }
            {userMessage.successMessage &&
              <span className={`${handles["success__span-message"]}`}>
                {formatMessage(messages.successMessage)}
              </span>
            }
          </div>
        }
      </form>
    </div>
  )
}

RegistrationForm.schema = {
  title: "Black friday registration form",
  description: "Component that render the registration form",
  type: "object",
  properties: {
    campaignName: {
      title: "Campaign Name",
      description: "Campaign name associated with this form",
      type: "string",
      default: "FORM_LP_BLACKFRIDAY"
    },
    formTopText: {
      title: "Text at the top",
      type: "string",
      default: "Lorem Ipsum dolor...Lorem Ipsum dolor..."
    },
    namePlaceholder: {
      title: "Name Placeholder",
      type: "string",
      default: "Vorname *"
    },
    surnamePlaceholder: {
      title: "Surname Placeholder",
      type: "string",
      default: "Nachname *"
    },
    emailPlaceholder: {
      title: "Email Placeholder",
      type: "string",
      default: "E-mail *"
    },
    privacyText: {
      title: "Text before the privacy Link",
      description: "Add text before the privacy link",
      type: "string",
      widget: {
        'ui:widget': 'textarea',
      },
      default: "Ich verstehe und bestätige den Inhalt der "
    },
    privacyText2: {
      title: "Text after the privacy Link",
      description: "Add text after the privacy text",
      type: "string",
      widget: {
        'ui:widget': 'textarea',
      },
      default: ":"
    },
    privacyLink: {
      title: "Link of the privacy consent",
      description: "Change link to the privacy consent page",
      type: "string",
      default: "/seiten/datenschutzerklaerung"
    },
    privacyLinkText: {
      title: "Text of the Link for privacy consent",
      description: "Text show for the link of privacy consent",
      type: "string",
      default: "Datenschutzerklärung"
    },
    privacyText3: {
      title: "Text After Optin Checkbox",
      description: "Add text after the checkbox for newsletter optin",
      type: "string",
      widget: {
        'ui:widget': 'textarea',
      },
      default: "Achtung: Felder mit (*) sind Pflichtfelder"
    },
    checkboxLabel: {
      title: "Checkbox Label",
      description: "Label for the Checkbox",
      type: "string",
      default: "Ich stimme zu, personalisierte Werbemitteilungen in Bezug auf Bauknecht und andere Marken der Whirlpool Corporation zu erhalten."
    },
    submitBtnText: {
      title: "Submit Button Text",
      description: "Text displayed in Submit Button",
      type: "string",
      default: "Jetzanmelden"
    },
    emptyFieldErrorRequired: {
      title: "Error Empty Field Required",
      description: "Text displayed for error of required field",
      type: "string",
      default: "Pflichtfeld darf nicht leer sein"
    },
    wrongEmail: {
      title: "Error wrong E-mail",
      description: "Text displayed for error of required and correct email",
      type: "string",
      default: "Ungültige mail"
    }
  }
}

export default RegistrationForm
