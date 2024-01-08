import React, { useState, useEffect, useRef } from 'react'
import { Input, Button, Checkbox, Link } from 'vtex.styleguide'
import { putNewUser, getIdUser } from './utils/utilsFunctions'
import RichText from "vtex.rich-text/index";
import style from './style.css'
import { usePixel } from 'vtex.pixel-manager'
import { canUseDOM, Helmet } from 'vtex.render-runtime'

type Props = {
  textButton?: string
  textNextStep: string
  promoActive: boolean
  promotionText: [string]
  privacyPolicyText: [any]
  textAlreadyRegistered: string
  formNameLabel: string
  formSurnameLabel: string
  formMailLabel: string
  formNamePlaceholder: string
  formSurnamePlaceholder: string
  formMailPlaceholder: string
  goBackToLogin: string
  checkboxes: [CheckboxProps]
  errorProfilingText: string
  metaDescription: string
}
interface WindowGTM extends Window {
  dataLayer: any[]
}

interface CheckboxProps {
  checkboxTitle: string
  checkboxRequired: boolean
  checkboxNewsLetter?: boolean
  checkboxProfiling?: boolean
}

const LoginForm: StorefrontFunctionComponent<Props> = ({
  textButton,
  textNextStep,
  privacyPolicyText,
  promoActive,
  promotionText,
  textAlreadyRegistered,
  formNameLabel,
  formSurnameLabel,
  formMailLabel,
  formNamePlaceholder,
  formSurnamePlaceholder,
  formMailPlaceholder,
  goBackToLogin,
  checkboxes,
  metaDescription,
  errorProfilingText = "To receive tailored messages, you also need to consent to marketing emails."
}) => {
  const dataLayer = (window as unknown as WindowGTM)?.dataLayer || []
  const { push } = usePixel()
  const [registerFormVisible, setRegisterFormVisible] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [surnameValue, setSurnameValue] = useState('')
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [buttonInForgotPassword, setButtonInForgotPassword] = useState(true)
  const [hooksValue, setHooksValue] = useState(false)
  // Handle checkboxes states, se all to false as default
  const [checkboxesState, setCheckboxesState] = useState(
    new Array(checkboxes?.length)?.fill(false)
  )
  // Array to check which checkbox is for newsletter --> it will be used for newsletterOptin
  const wichOneIsNewsletter = checkboxes?.map(
    (item: CheckboxProps) => item?.checkboxNewsLetter
  );

  // If no checked checkboxes at whichOneIsNewsletter index --> newsletterOptIn = false
  const newsletterOptIn = !wichOneIsNewsletter?.some(
    (isNewsletter: boolean | undefined, index: number): boolean =>
      !!isNewsletter && !checkboxesState[index]
  );
  // Array to check which checkbox is for profiling --> it will be used for profilingOptin
  const wichOneIsProfiling = checkboxes?.map(
    (item: CheckboxProps) => item?.checkboxProfiling ?? false
  );
  // If no checked checkboxes at wichOneIsProfiling index --> profilingOptIn = false
  const profilingOptIn = wichOneIsProfiling?.some(
    (isProfiling: boolean, index: number): boolean => isProfiling && checkboxesState[index]
  );

  //GA4FUNREQ58
  const [isNameRequired, setIsNameRequired] = useState(false)
  const [isSurnameRequired, setIsSurnameRequired] = useState(false)
  const [isEmailRequired, setIsEmailRequired] = useState(false)
  const [emailType, setEmailType] = useState('text')
  const regEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  const buttonSubmitContainer: any = useRef(null)

  // Function to handle click on checkbox
  const handleOnChangeCheckbox = (position: number) => {
    // Save in a const the updated value for the clicked checkbox
    const updatedCheckboxesState = checkboxesState?.map((item, index) =>
      index === position ? !item : item
    )
    // Then update the checkboxes state
    setCheckboxesState(updatedCheckboxesState)
  }

  // Temp variable to parse HTML text
  //let parsedText: string = ''

  const handleSubmit = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    //GA4FUNREQ58
    const ga4Data = {
      event: 'ga4-custom_error',
      type: 'error message',
      description: '',
    }

    const errorMessages = {
      noNameMessage: 'Name not entered',
      noSurnameMessage: 'Surname not entered',
      noEmailMessage: 'Email not entered',
      invalidEmailMessage: 'Invalid email format',
    }

    if (!nameValue) {
      setIsNameRequired(true)
      ga4Data.description = errorMessages?.noNameMessage
      push({ ...ga4Data })
      setTimeout(() => buttonSubmitContainer?.current.click())
      return
    }

    if (!surnameValue) {
      setIsSurnameRequired(true)
      ga4Data.description = errorMessages?.noSurnameMessage
      push({ ...ga4Data })
      setTimeout(() => buttonSubmitContainer?.current.click())
      return
    }

    if (!emailValue) {
      setIsEmailRequired(true)
      ga4Data.description = errorMessages?.noEmailMessage
      push({ ...ga4Data })
      setTimeout(() => buttonSubmitContainer?.current.click())
      return
    }

    if (!regEx.test(emailValue)) {
      setEmailType('email')
      ga4Data.description = errorMessages?.invalidEmailMessage
      push({ ...ga4Data })
      setTimeout(() => buttonSubmitContainer?.current.click())
      return
    }
    // IF profOptin true BUT newsletterOptin false ERROR (OTHERWISE NO PROBLEM)
    if(!newsletterOptIn && profilingOptIn) {
      return
    }

    // Set loading as we are going to make some API calls
    setLoading(true)
    // Get User info by email
    getIdUser(emailValue).then((User: any) => {
      if (User.length > 0) {
        setLoading(false)
        setSuccess(true)
        setAlreadyRegistered(true)
      } else {
        putNewUser(emailValue, newsletterOptIn, profilingOptIn, nameValue, surnameValue).then(
          (response: any) => {
            setLoading(false)
            if (response.Message == undefined) {
              setSuccess(true)
              showForm()

              dataLayer.push({
                event: 'userRegistration',
              })
              //*parte non comune
              dataLayer.push({
                event: 'personalArea',
                eventCategory: 'Personal Area',
                eventAction: 'Start Registration',
                eventLabel: 'Start Registration from Personal Area',
              })
              dataLayer.push({
                event: 'emailForSalesforce',
                eventCategory: 'Email for Salesforce',
                eventAction: 'Email from registration',
                email: emailValue,
              })

              //GA4FUNREQ23
              push({
                event: 'ga4-personalArea',
                section: 'Personal Area',
                type: 'registration',
              })
            }
            //*parte comune
            // if (consent == true) {
            if (newsletterOptIn) {
              dataLayer.push({
                event: 'optin_granted',
              })
              dataLayer.push({
                event: 'leadGeneration',
                eventCategory: 'Lead Generation',
                eventAction: 'Optin granted',
                eventLabel: 'Lead from registration',
                email: emailValue,
              })

              //GA4FUNREQ61
              push({
                event: 'ga4-optin',
              })
            }
          }
        )
      }
    })
  }

  const hideFirstForm = () => {
    let gotToRegistration = Array.from(
      document.getElementsByClassName(
        'vtex-login-2-x-content--emailAndPassword'
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    let formLink = Array.from(
      document.getElementsByClassName(
        'vtex-login-2-x-dontHaveAccount'
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    gotToRegistration.style.display = 'none'
    formLink.click()

    dataLayer.push({
      event: 'cta_click',
      eventCategory: 'CTA Click',
      eventAction: 'Personal',
      eventLabel: 'account_registration',

      "link_url": window?.location?.href,
      "link_text": textButton,
      "checkpoint": `1`,
      "area": 'Personal',
      "type": 'register'
    })

    setRegisterFormVisible(true)
  }

  const showForm = () => {
    let form = Array.from(
      document.getElementsByClassName(
        'vtex-login-2-x-content--beginCreatePass'
      ) as HTMLCollectionOf<HTMLElement>
    )[0]
    form.style.display = 'flex'
    setRegisterFormVisible(false)
  }

  const setHooks = () => {
    setInterval(() => {
      if (!document) return
      if (hooksValue) return
      let linkToForgotPassword: any = document.getElementsByClassName(
        'vtex-login-2-x-forgotPasswordLink'
      )[0]
      if (linkToForgotPassword) {
        linkToForgotPassword.addEventListener('click', function (e: any) {
          e.preventDefault()
          setButtonInForgotPassword(false)
        })
        setHooksValue(true)
      }
    }, 500)
  }

  // Component Did Mount
  useEffect(() => {
    document.onreadystatechange = function () {
      if (document.readyState === 'complete') {
        setTimeout(() => {
          let linkToForgotPassword: any = document.getElementsByClassName(
            'vtex-login-2-x-forgotPasswordLink'
          )[0]
          linkToForgotPassword.addEventListener('click', function (e: any) {
            e.preventDefault()
            setButtonInForgotPassword(false)
          })
        }, 100)
      }
    }
  }, [])

  return (
    <>
    {canUseDOM && metaDescription &&
      <Helmet>
        <meta name="description" content={metaDescription} data-react-helmet="true" />
      </Helmet>
    }
    <div className={`flex justify-center relative w-100`}>
      {setHooks()}
      {!registerFormVisible ? (
        !success && buttonInForgotPassword ? (
          <button
            onClick={() => hideFirstForm()}
            className={style.confirmButton}
            id="registration_user_button"
          >
            {textButton}{' '}
          </button>
        ) : null
      ) : null}
      {registerFormVisible ? (
        <div className={style.formContainer}>
          <div className={style.infoContainer}>{textNextStep}</div>
          <div>
            {/* FORM */}
            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div className={style.inputContainer}>
                <Input
                  name="firstName"
                  type="text"
                  label={formNameLabel}
                  placeholder={formNamePlaceholder}
                  value={nameValue}
                  onChange={(e: any) => setNameValue(e.target.value)}
                  required={isNameRequired}
                />
              </div>
              {/* SURNAME */}
              <div className={style.inputContainer}>
                <Input
                  name="surname"
                  type="text"
                  label={formSurnameLabel}
                  placeholder={formSurnamePlaceholder}
                  value={surnameValue}
                  onChange={(e: any) => setSurnameValue(e.target.value)}
                  required={isSurnameRequired}
                />
              </div>
              {/* EMAIL */}
              <div className={style.inputContainer}>
                <Input
                  name="email"
                  type={emailType}
                  label={formMailLabel}
                  value={emailValue}
                  placeholder={formMailPlaceholder}
                  onChange={(e: any) => setEmailValue(e.target.value)}
                  required={isEmailRequired}
                />
              </div>

              {/* <div className={style.informativa}>
                <p className={style.privacy}>
                  <p>
                    {privacyPolicyText?.map((item: any) => {
                      parsedText = item?.__editorItemTitle
                      return (
                        <div dangerouslySetInnerHTML={{ __html: parsedText }} />
                      )
                    })}
                  </p>
                </p> */}

              {/* PRIVACY SECTION */}
              <div className={style.informativa}>
                {/* PRIVACY TEXTS BEFORE CHECKBOXES */}
                {privacyPolicyText?.map((item: any, i: number) => (
                  <div /*className={style.container__text-privacy}*/ key={`policy${i}`} >
                    <RichText text={item?.__editorItemTitle} />
                  </div>
                ))}

                {/* CHECKBOXES CONTAINER */}
                <div
                  className={`flex flex-column justify-center items-center tj mb4`}
                >
                  {checkboxes?.map((item: CheckboxProps, index: number) => (
                    <Checkbox
                      id={`custom-checkbox-${index}`}
                      name={item?.checkboxTitle}
                      value={item?.checkboxTitle}
                      label={item?.checkboxTitle}
                      checked={checkboxesState[index]}
                      required={item?.checkboxRequired}
                      onChange={() => handleOnChangeCheckbox(index)}
                    />
                  ))}
                </div>
                {/* If promo is active (like in WH PL) show dedicated text */}
                {promoActive && (
                  <p>
                    {promotionText?.map((item: any) => {
                      return <p>{item?.__editorItemTitle}</p>
                    })}
                  </p>
                )}
              </div>
              {/* ERROR PROFILING */}
              {profilingOptIn && !newsletterOptIn ?
                <div className={`flex flex-column justify-center items-center`}>
                  <p className='c-danger t-small'>
                    {errorProfilingText}
                  </p>
                </div>
                :
                <></>
              }
              {/* SUBMIT BUTTON */}
              <div className={style.buttonContainer}>
                {!loading ? (
                  !success ? (
                    <Button
                      type="submit"
                      id="registration_user_button"
                      ref={buttonSubmitContainer}
                    >
                      {textButton}
                    </Button>
                  ) : alreadyRegistered ? (
                    <div>
                      <span className={style.registered}>
                        {textAlreadyRegistered}
                      </span>
                      <Link href="/login?returnUrl=/account">
                        {goBackToLogin}
                      </Link>
                    </div>
                  ) : null
                ) : (
                  <div className={style.loaderForm}></div>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
    </>
  )
}

LoginForm.schema = {
  title: 'editor.LoginForm.title',
  description: 'editor.LoginForm.description',
  type: 'object',

  properties: {
    textButton: {
      title: 'CTA',
      type: 'string',
      description: 'Text for the CTA Button',
      default: 'Register',
    },
    textNextStep: {
      title: 'Registration page title',
      type: 'string',
      description: '',
      default: 'In the next step you will be asked to verify your email',
    },
    textAlreadyRegistered: {
      title: 'Already user registered Message',
      type: 'string',
      description: 'User Already Registered',
      default: 'User Already Registered',
    },
    goBackToLogin: {
      title: 'Already user registered go back string',
      type: 'string',
      description: 'Go back to login string',
      default: 'Go back to Login',
    },
    privacyPolicyText: {
      type: 'array',
      title: 'Privacy Text',
      items: {
        title: 'Text of promotion',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text of promotion',
            type: 'string',
          },
        },
      },
    },
    promoActive: {
      title: 'Activate Promo',
      description: '',
      default: false,
      type: 'boolean',
    },
    promotionText: {
      type: 'array',
      title: 'Promotion Text',
      items: {
        title: 'Text of promotion',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text of promotion',
            type: 'string',
          },
        },
      },
    },
    checkboxes: {
      type: 'array',
      title: 'Checkboxes to print',
      items: {
        properties: {
          checkboxTitle: {
            title: 'checkbox Title',
            type: 'string',
          },
          checkboxRequired: {
            title: 'is Required',
            type: 'boolean',
          },
          checkboxNewsLetter: {
            title: 'is Newsletter',
            type: 'boolean',
          },
          checkboxProfiling: {
            title: 'is Profiling',
            type: 'boolean',
          },
        },
      },
    },
    errorProfilingText: {
      type: 'string',
      title: 'Error profiling optin',
      description: 'Error message to show when trying to submit for profiling optin but newsletter optin not checked',
      default: 'To receive tailored messages, you also need to consent to marketing emails.'
    },
    formNameLabel: {
      title: 'Name Label',
      type: 'string',
      description: 'Name Label',
      default: 'NAME *',
    },
    formSurnameLabel: {
      title: 'Surname Label',
      type: 'string',
      description: 'Surname Label Text',
      default: 'LAST NAME *',
    },
    formMailLabel: {
      title: 'E-mail Label',
      type: 'string',
      description: 'E-mail Label',
      default: 'EMAIL *',
    },
    formNamePlaceholder: {
      title: 'Name Placeholder',
      type: 'string',
      description: 'Name placeholder',
      default: 'Insert your Name',
    },
    formSurnamePlaceholder: {
      title: 'Surname Placeholder',
      type: 'string',
      description: 'Surname placeholder Text',
      default: 'Insert your Surname',
    },
    formMailPlaceholder: {
      title: 'E-mail Placeholder',
      type: 'string',
      description: 'E-mail placeholder',
      default: 'Insert your E-mail es: xxxx@xxx.xx',
    },
    metaDescription: {
      title: 'Meta description',
      type: 'string',
      description: 'Meta tag description',
      default: '',
    },
  },
}

export default LoginForm
