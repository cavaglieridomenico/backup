import React, { useState, useEffect, useRef } from 'react'
import { Input, Button, Checkbox, Link } from 'vtex.styleguide'
import style from './style.css'
import { usePixel } from 'vtex.pixel-manager'

type Props = {
  textButton?: string
  textNextStep: string
  textAlreadyRegistered: string
  linkPrivacy: string
}
interface WindowGTM extends Window {
  dataLayer: any[]
}

const LoginForm: StorefrontFunctionComponent<Props> = ({
  textButton = 'Zarejestruj się',
  textNextStep = 'W następnym kroku poprosimy Cię o weryfikację adresu email',
  textAlreadyRegistered = 'Jesteś już zarejestrowanym użytkownikiem',
  linkPrivacy = '/informacja-o-ochronie-prywatnosci',
}) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || []
  const { push } = usePixel()
  const [registerFormVisible, setRegisterFormVisible] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [nameValue, setNameValue] = useState('')
  const [surnameValue, setSurnameValue] = useState('')
  const [consent, setConsent] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [buttonInForgotPassword, setButtonInForgotPassword] = useState(true)
  const [hooksValue, setHooksValue] = useState(false)

  //GA4FUNREQ58
  const [isNameRequired, setIsNameRequired] = useState(false)
  const [isSurnameRequired, setIsSurnameRequired] = useState(false)
  const [isEmailRequired, setIsEmailRequired] = useState(false)
  const [emailType, setEmailType] = useState('text')
  const regEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  const buttonSubmitContainer: any = useRef(null)

  const putNewUser = (email: string, name?: string, surname?: string) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        firstName: name,
        lastName: surname,
        isNewsletterOptIn: consent,
      }),
    }
    const fetchUrlPatch = '/_v/wrapper/api/user'
    return fetch(fetchUrlPatch, options).then((response) => response.json())
  }
  const getIdUser = (email: string) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const fetchUrl = '/_v/wrapper/api/user/email/userinfo?email=' + email
    return fetch(fetchUrl, options).then((response) => response.json())
  }
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
      ga4Data.description = errorMessages.noNameMessage
      push({ ...ga4Data })
      setTimeout(() => buttonSubmitContainer?.current.click())
      return
    }

    if (!surnameValue) {
      setIsSurnameRequired(true)
      ga4Data.description = errorMessages.noSurnameMessage
      push({ ...ga4Data })
      setTimeout(() => buttonSubmitContainer?.current.click())
      return
    }

    if (!emailValue) {
      setIsEmailRequired(true)
      ga4Data.description = errorMessages.noEmailMessage
      push({ ...ga4Data })
      setTimeout(() => buttonSubmitContainer?.current.click())
      return
    }

    if (!regEx.test(emailValue)) {
      setEmailType('email')
      ga4Data.description = errorMessages.invalidEmailMessage
      push({ ...ga4Data })
      setTimeout(() => buttonSubmitContainer?.current.click())
      return
    }

    setLoading(true)

    getIdUser(emailValue).then((User: any) => {
      if (User.length > 0) {
        setLoading(false)
        setSuccess(true)
        setAlreadyRegistered(true)
      } else {
        putNewUser(emailValue, nameValue, surnameValue).then(
          (repsonse: any) => {
            setLoading(false)
            if (repsonse.Message == undefined) {
              setSuccess(true)
              showForm()
              push({ event: "accountCreation", text: "register" });

              dataLayer.push({
                event: 'userRegistration',
              })
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
            if (consent == true) {
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
      let linkToForgotPassword: any = document.querySelector(
        'body > div.render-container.render-route-store-login > div > div.vtex-store__template.bg-base > div > div:nth-child(3) > div > div:nth-child(1) > div > div.vtex-login-2-x-contentForm.dn.vtex-login-2-x-contentFormVisible.db.ph4 > div > div > form > div.vtex-login-2-x-formLinkContainer.flex.justify-end.ph0.pv2 > a'
      )
      if (linkToForgotPassword) {
        linkToForgotPassword.addEventListener('click', function (e: any) {
          e.preventDefault()
          setButtonInForgotPassword(false)
        })
        setHooksValue(true)
      }
    }, 500)
  }

  useEffect(() => {
    document.onreadystatechange = function () {
      if (document.readyState === 'complete') {
        setTimeout(() => {
          let linkToForgotPassword: any = document.querySelector(
            'body > div.render-container.render-route-store-login > div > div.vtex-store__template.bg-base > div > div:nth-child(3) > div > div:nth-child(1) > div > div.vtex-login-2-x-contentForm.dn.vtex-login-2-x-contentFormVisible.db.ph4 > div > div > form > div.vtex-login-2-x-formLinkContainer.flex.justify-end.ph0.pv2 > a'
          )
          linkToForgotPassword.addEventListener('click', function (e: any) {
            e.preventDefault()
            setButtonInForgotPassword(false)
          })
        }, 100)
      }
    }
  }, [])

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
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
            <form onSubmit={handleSubmit}>
              <div>
                <div className={style.inputContainer}>
                  <Input
                    label="IMIĘ *"
                    value={nameValue}
                    placeholder="Wpisz swoje imię"
                    onChange={(e: any) => setNameValue(e.target.value)}
                    required={isNameRequired}
                  />
                </div>
                <div className={style.inputContainer}>
                  <Input
                    label="NAZWISKO*"
                    value={surnameValue}
                    placeholder="Wpisz swoje nazwisko"
                    onChange={(e: any) => setSurnameValue(e.target.value)}
                    required={isSurnameRequired}
                  />
                </div>
                <div className={style.inputContainer}>
                  <Input
                    label="EMAIL *"
                    placeholder="Na przykład: przyklad@mail.com"
                    value={emailValue}
                    type={emailType}
                    onChange={(e: any) => setEmailValue(e.target.value)}
                    required={isEmailRequired}
                  />
                </div>
                <div className={style.informativa}>
                  <p className={style.privacy}>
                    Przeczytałem i zrozumiałem treść
                    <span className={style.colorEdb112}>
                      <a
                        className={style.link}
                        href={linkPrivacy}
                        target="_blank"
                      >
                        &nbsp;informacji
                      </a>
                    </span>
                    dotyczących ochrony danych osobowych oraz{' '}
                    <span className={style.colorEdb112}>
                      <a
                        className={style.link}
                        href="/regulamin-sklepu"
                        target="_blank"
                      >
                        {' '}
                        Regulamin sklepu:
                      </a>
                    </span>
                  </p>
                  <Checkbox
                    checked={consent}
                    id="consent-check"
                    label={
                      'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu umożliwienia Whirlpool Polska Appliances Sp. z o.o przesyłania mi newslettera/wiadomości marketingowych (w formie elektronicznej i nieelektronicznej, w tym za pośrednictwem telefonu, poczty tradycyjnej, e-mail, SMS, MMS, powiadomień push na stronach osób trzecich, w tym na platformach Facebook i Google) dotyczących produktów i usług Whirlpool Polska Appliances Sp. z o.o również tych już zakupionych lub zarejestrowanych przeze mnie, a także w celu prowadzenia badań rynkowych;'
                    }
                    name="default-checkbox-group"
                    onChange={(e: any) => {
                      setConsent(e.target.checked)
                    }}
                    required={false}
                    value={consent}
                  />
                  <p>
                    Warunki przyznania zniżki znajdują się w Regulaminie
                    Promocji poniżej:{' '}
                  </p>
                  <p>
                    Kod na 50 złotych rabatu otrzymasz mailem po zapisaniu się
                    do newslettera, niemożliwe jest łączenie go z innymi
                    promocjami, można go użyć tylko raz.
                  </p>
                </div>
              </div>
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
                      <Link href="/login?returnUrl=/account">Zaloguj</Link>
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
  )
}
LoginForm.schema = {
  title: 'Login Form',
  description: 'Login form',
  type: 'object',
  properties: {
    textButton: {
      title: 'CTA',
      type: 'string',
      description: 'Text for the CTA Button',
      default: '',
    },
    textNextStep: {
      title: 'textNextStep',
      type: 'string',
      description: 'Text for next step label',
      default: '',
    },
    linkPrivacy: {
      title: 'Link to privacy page',
      description: 'url privacy page',
      default: '',
      type: 'string',
    },
    textAlreadyRegistered: {
      title: 'textAlreadyRegistered',
      type: 'string',
      description: 'Testo utente registrato',
      default: '',
    },
  },
}

export default LoginForm
