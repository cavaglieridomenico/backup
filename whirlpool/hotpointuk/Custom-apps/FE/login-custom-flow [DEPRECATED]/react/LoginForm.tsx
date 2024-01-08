import React, { useState } from 'react'
import { FormattedMessage, useIntl } from "react-intl";
import { Input, Button, Checkbox, Link } from 'vtex.styleguide'
import style from "./style.css";

type Props = {
  textButton?: string
  textNextStep: string
  textAlreadyRegistered: string
  linkPrivacy:string
  textGoBackToLoginButton:string
}
interface WindowGTM extends Window { dataLayer: any[]; }


const LoginForm: StorefrontFunctionComponent<Props> = ({
  textButton = 'Create new account',

}) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
  const [registerFormVisible, setRegisterFormVisible] = useState(false)
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  // const [privacy, setPrivacy] = useState(false);
  const [privacyDandG, setPrivacyDandG] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  let linkPrivacy= "/privacy-policy"

  /*--- INTL ---*/
  const intl = useIntl();

  const putNewUser = (
    email: string,
    name?: string,
    surname?: string,
  ) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        firstName: name,
        lastName: surname,
        isNewsletterOptIn: privacyDandG
      }),
    };
    console.log(options)
    const fetchUrlPatch = "/_v/wrapper/api/user";
    return fetch(fetchUrlPatch, options).then((response) => response.json());
  };
  const getIdUser = (email: string) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const fetchUrl = "/_v/wrapper/api/user/email/userinfo?email=" + email;
    return fetch(fetchUrl, options).then((response) => response.json());
  };
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
        putNewUser(emailValue, nameValue, surnameValue).then(
          (repsonse: any) => {
            setLoading(false);
            if (repsonse.Message == undefined) {
              //const section = window.location.pathname.replace("/", "")
              setSuccess(true);
              showForm()
              dataLayer.push({
                event: 'userRegistration',
              });
              dataLayer.push({
                event: "personalArea",
                eventCategory: 'Personal Area',
                eventAction: 'Start Registration',
                eventLabel: `Start Registration from Personal Area`,
                type: 'registration'
              });
              dataLayer.push({
                event: "emailForSalesforce",
                eventCategory: "Email for Salesforce",
                eventAction: "Email from registration",
                email: emailValue,
              });
            }
            // if (privacy == true) {
            //   dataLayer.push({
            //     event: 'optin_granted',
            //   });
            //   dataLayer.push({
            //     event: "leadGeneration",
            //     eventCategory: "Lead Generation",
            //     eventAction: "Optin granted",
            //     eventLabel: "Lead from registration",
            //     email: emailValue
            //   });
            // }
            if (privacyDandG == true) {
              /*dataLayer.push({
                event: 'optin_granted',   // Change with new event
              });
              dataLayer.push({
                event: "leadGeneration",
                eventCategory: "Lead Generation",
                eventAction: "Optin granted",
                eventLabel: "Lead from registration"
              });*/
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
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
      {!registerFormVisible ? (
        !success ?
          <button onClick={() => hideFirstForm()} className={style.confirmButton}>
            <FormattedMessage id="store/login-custom-flow.newAccount"/>
          </button> : null
      ) : null
      }
      {registerFormVisible ?
        <div className={style.formContainer}>
          <div className={style.infoContainer}><FormattedMessage id="store/login-custom-flow.first-label"/></div>
          <div>
            <form onSubmit={handleSubmit}​>
              <div>
                <div className={style.inputContainer}>
                  <Input
                    //label="NOME *"
                    label={intl.formatMessage({ id: "store/login-custom-flow.user-name-required" })}
                    value={nameValue}
                    //placeholder="Inserisci il tuo nome"
                    placeholder={intl.formatMessage({ id: "store/login-custom-flow.user-name-placeholder" })}
                    onChange={(e: any) => setNameValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.inputContainer}>
                  <Input
                    //label="COGNOME *"
                    label={intl.formatMessage({ id: "store/login-custom-flow.user-surname-required" })}
                    value={surnameValue}
                    //placeholder="Inserisci il tuo cognome"
                    placeholder={intl.formatMessage({ id: "store/login-custom-flow.user-surname-placeholder" })}
                    onChange={(e: any) => setSurnameValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.inputContainer}>
                  <Input
                    //label="EMAIL *"
                    label={intl.formatMessage({ id: "store/login-custom-flow.user-email-required" })}
                    //placeholder="Ad esempio: esempio@mail.com"
                    placeholder={intl.formatMessage({ id: "store/login-custom-flow.user-email-placeholder" })}
                    value={emailValue}
                    type="email"
                    onChange={(e: any) => setEmailValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.informativa}>
                  <div>
                  <p>
                    {intl.formatMessage({ id: "store/login-custom-flow.privacy-policy-description-1" })}
                    <span className={style.colorEdb112}>
                      <a className={style.link} href={linkPrivacy} target="_blank">
                        {intl.formatMessage({ id: "store/login-custom-flow.privacy-policy" })}
                      </a>
                    </span>
                    {intl.formatMessage({ id: "store/login-custom-flow.privacy-policy-description-2" })}
                    </p>
                    <Checkbox
                      checked={privacyDandG}
                      id="privacy-check-1"
                      label={intl.formatMessage({ id: "store/login-custom-flow.privacy-policy-check-label-1" })}
                      name="checkbox-1"
                      onChange={(e: any) => {
                        setPrivacyDandG(e.target.checked);
                      }}
                      required={false}
                      value={privacyDandG}
                    />
                  </div>
                </div>
              </div>
              <div className={style.buttonContainer}>
                {!loading ? (
                  !success ? (
                    <Button type='submit' >{textButton}​</Button>) :
                    (alreadyRegistered ? <div><span className={style.registered}> <FormattedMessage id="store/login-custom-flow.textAlreadyRegistered"/></span><Link href='/login?returnUrl=/account'><FormattedMessage id="store/login-custom-flow.textGoBackToLoginButton"/></Link></div> : null)
                ) : (
                  <div className={style.loaderForm}></div>
                )}
              </div>
            </form>
          </div>
        </div> : null}
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
