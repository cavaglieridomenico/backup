import React, { useState } from 'react'
import { useIntl } from "react-intl";
import { Input, Button, Checkbox, Link } from 'vtex.styleguide';
import { messages, putNewUser, getIdUser } from './utils/utils';
import style from "./style.css";
import { usePixel } from "vtex.pixel-manager";

type Props = {
  textButton?: string
  textNextStep: string
  textAlreadyRegistered: string
  linkPrivacy:string
  textGoBackToLoginButton:string
}
interface WindowGTM extends Window { dataLayer: any[]; }


const LoginForm: StorefrontFunctionComponent<Props> = ({
  textButton = 'Registrieren',
  textNextStep = 'Im nächsten Schritt werden Sie aufgefordert, Ihre E-Mail zu bestätigen',
  textAlreadyRegistered = 'Sie sind bereits registriert',
  linkPrivacy ='/seiten/datenschutzerklaerung',
  textGoBackToLoginButton ='Zum Login'

}) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
  const [registerFormVisible, setRegisterFormVisible] = useState(false)
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { push } = usePixel();

  /*--- INTL ---*/
  const intl = useIntl();

  // Handle Form SUbmit
  const handleSubmit = (e: any) => {
    setLoading(true);
    e.preventDefault();
    e.stopPropagation();
    getIdUser(emailValue).then((User: any) => {
      if (User.length > 0) {
        setLoading(false);
        setSuccess(true);
        setAlreadyRegistered(true)
      } else {
        putNewUser(emailValue, privacy, nameValue, surnameValue).then(
          (repsonse: any) => {
            setLoading(false);
            if (repsonse.Message == undefined) {
              const section = window.location.pathname.replace("/", "")
              setSuccess(true);
              showForm()
              push({ event: "accountCreation", text: 'register' });
              dataLayer.push({
                event: 'userRegistration',
              });
              dataLayer.push({
                event: "personalArea",
                eventCategory: 'Personal Area',
                eventAction: 'Start Registration',
                eventLabel: `Start Registration from ${section}`
              });
              dataLayer.push({
                event: "emailForSalesforce",
                eventCategory: "Email for Salesforce",
                eventAction: "Email from registration",
                email: emailValue,
              });
            }
            if (privacy == true) {
              dataLayer.push({
                event: 'optin_granted',
              });
              dataLayer.push({
                event: "leadGeneration",
                eventCategory: "Lead Generation",
                eventAction: "Optin granted",
                eventLabel: "Lead from registration",
                email: emailValue
              });
            }
          }
        );
      }
    });
  };
  const hideFirstForm = () => {
    let gotToRegistration = Array.from(document.getElementsByClassName('vtex-login-2-x-content--emailAndPassword') as HTMLCollectionOf<HTMLElement>)[0]
    let formLink = Array.from(document.getElementsByClassName('vtex-login-2-x-dontHaveAccount') as HTMLCollectionOf<HTMLElement>)[0]
    gotToRegistration.style.display = 'none'
    formLink.click()
    setRegisterFormVisible(true)
  }
  const showForm = () => {
    let form = Array.from(document.querySelectorAll('.vtex-login-2-x-content--beginCreatePass') as NodeListOf<HTMLElement>)[0]
    form.style.display = 'flex'
    setRegisterFormVisible(false)
  }

  return (
    <div className={`flex justify-center relative w-100`}>
      {!registerFormVisible ? (
        !success ?
          <button onClick={() => hideFirstForm()} className={style.confirmButton}>{textButton}</button> : null
      ) : null
      }
      {registerFormVisible ?
        <div className={style.formContainer}>
          <div className={style.infoContainer}>{textNextStep}</div>
          <div>
            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div>
                {/* NAME */}
                <div className={style.inputContainer}>
                  <Input
                    label={intl.formatMessage(messages.userNameRequired)}
                    value={nameValue}
                    placeholder={intl.formatMessage(messages.userNamePlaceholder)}
                    onChange={(e: any) => setNameValue(e.target.value)}
                    required={true}
                  />
                </div>
                {/* SURNAME */}
                <div className={style.inputContainer}>
                  <Input
                    label={intl.formatMessage(messages.userSurnameRequired)}
                    value={surnameValue}
                    placeholder={intl.formatMessage(messages.userSurnamePlaceholder)}
                    onChange={(e: any) => setSurnameValue(e.target.value)}
                    required={true}
                  />
                </div>
                {/* EMAIL */}
                <div className={style.inputContainer}>
                  <Input
                    label={intl.formatMessage(messages.userEmailRequired)}
                    placeholder={intl.formatMessage(messages.userEmailPlaceholder)}
                    value={emailValue}
                    type="email"
                    onChange={(e: any) => setEmailValue(e.target.value)}
                    required={true}
                  />
                </div>
                {/* PRIVACY SECTION */}
                <div className={style.informativa}>
                  <p className={style.privacy}>
                    {intl.formatMessage(messages.privacyPolicyDescription1)}
                    <span className={style.colorEdb112}>
                      <a className={style.link} href={linkPrivacy} target="_blank">
                        {intl.formatMessage(messages.privacyPolicy)}
                      </a>
                    </span>
                    {intl.formatMessage(messages.privacyPolicyDescription2)}
                  </p>
                  {/* CHECKBOX NEWSLETTER OPTIN */}
                  <div className='mb4'>
                    <p>
                      {intl.formatMessage(messages.privacyPolicyCheckDescription1)}
                    </p>
                    <Checkbox
                      checked={privacy}
                      id="privacy-check-1"
                      label={intl.formatMessage(messages.privacyPolicyCheckLabel1)}
                      name="checkbox-1"
                      onChange={(e: any) => {
                        setPrivacy(e.target.checked);
                      }}
                      required={false}
                      value={privacy}
                    />
                  </div>
                </div>
              </div>
              {/* SUBMIT BUTTON */}
              <div className={style.buttonContainer}>
                {!loading ? (
                  !success ? (
                    <Button type='submit' >{textButton}</Button>
                  ) 
                  :
                    (alreadyRegistered ? 
                      <div>
                        <span className={style.registered}>{textAlreadyRegistered}</span>
                        <Link href='/login?returnUrl=/account'>{textGoBackToLoginButton}</Link>
                      </div> 
                      : 
                      null
                    )
                ) 
                : 
                (
                  <div className={style.loaderForm}></div>
                )}
              </div>
            </form>
          </div>
        </div> 
        : 
        null}
    </div>
  )
}
LoginForm.schema = {
  title: "Login Form",
  description: "Login form",
  type: "object",
  properties: {
    textButton: {
      title: 'CTA',
      type: 'string',
      description: 'Text for the CTA Button',
      default: ''
    },
    textNextStep: {
      title: 'textNextStep',
      type: 'string',
      description: 'Text for next step label',
      default: ''
    },
    linkPrivacy: {
      title: "Link to privacy page",
      description: "url privacy page",
      default: "",
      type: "string",
    },
    textAlreadyRegistered: {
      title: 'textAlreadyRegistered',
      type: 'string',
      description: 'Text for user already registered',
      default: ''
    },
    textGoBackToLoginButton: {
      title: 'textGoBackToLoginButton',
      type: 'string',
      description: 'Text of go back to login Button',
      default: ''
    }
  },
};

export default LoginForm
