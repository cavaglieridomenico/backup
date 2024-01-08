// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Input, Button, Checkbox, Link } from 'vtex.styleguide'
import style from "./style.css";
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages
} from 'react-intl'


type Props = {
  textButton?: string
  textNextStep: string
  textAlreadyRegistered: string
  linkPrivacy: string
}
interface WindowGTM extends Window { dataLayer: any[]; }

const messages = defineMessages({
  register: { id: 'store/login-custom-flow.register' },
  insertName: { id: "store/login-custom-flow.insertName" },
  insertsurName: { id: "store/login-custom-flow.insertsurName" },
  example: { id: "store/login-custom-flow.example" },
  agree: { id: "store/login-custom-flow.agree" },
  backToLogin: { id: "store/login-custom-flow.backToLogin" },
  nextStep: { id: "store/login-custom-flow.nextStep" },
  name: { id: "store/login-custom-flow.name" },
  surname: { id: "store/login-custom-flow.surname" },
  email: { id: "store/login-custom-flow.email" },
  andLabel: { id: "store/login-custom-flow.andLabel" },
  privacyLabel: { id: "store/login-custom-flow.privacyLabel" },
  privacyCtaLabel: { id: "store/login-custom-flow.privacyCtaLabel" }
})


const LoginForm: StorefrontFunctionComponent<Props> = ({
  textButton = 'Registrati',
  textNextStep = 'Nel prossimo step ti verrà chiesto di verificare la tua mail',
  textAlreadyRegistered = 'Sei già un utente registrato',
  linkPrivacy = '/pagine/informativa-sulla-privacy'

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
  const [locale, setLocale] = useState("");
  const [privacyLink, setPrivacyLink] = useState("");
  const [agreeText, setAgreeText] = useState("");
  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  const putNewUser = (
    email: string,
    name?: string,
    surname?: string
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
        isNewsletterOptIn: privacy,
      }),
    };
    const fetchUrlPatch = "/v1/user";
    return fetch(fetchUrlPatch, options).then((response) => response.json());
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('returnUrl');
    if (myParam == "/account") {
      updateUrlParameter(window.location.href, "returnUrl", `/${__RUNTIME__.culture.locale.split("-")[0]}/account`)

    }

    if (window.location.href.includes("indesit") ) {
      setPrivacyLink("https://www.indesit.co.uk/Pages/Privacy-Notice");
      setAgreeText("I agree to receive personalized marketing communications relating to Indesit and other brands of Whirlpool Corporation")
    } else {
      setPrivacyLink("https://www.hotpoint.co.uk/Pages/Privacy-Policy");
      setAgreeText("I agree to receive personalized marketing communications relating to Hotpoint and other brands of Whirlpool Corporation")

    }

   
  }, [])
  const getIdUser = (email: string) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const fetchUrl = "/v1/user/id?email=" + email;
    console.log("---------", fetchUrl);
    return fetch(fetchUrl, options).then((response) => {
      response.text().then(function (data) {
        return data;
      })
    });
  };
  const updateUrlParameter = (url, param, value) => {
    window.location.href = window.location.href.replace(/(returnUrl=)[^\&]+/, '$1' + value);
  }
  const handleSubmit = (e: any) => {
    setLoading(true);
    e.preventDefault();
    e.stopPropagation();
    getIdUser(emailValue).then((User: any) => {
      if (User && User.id) {
        setLoading(false);
        setSuccess(true);
        setAlreadyRegistered(true)
      } else {
        putNewUser(emailValue, nameValue, surnameValue).then(
          (repsonse: any) => {
            setLoading(false);
            if (repsonse.Message == undefined) {
              setSuccess(true);
              showForm()
              dataLayer.push({
                event: 'userRegistration',
              });
            }
            if (privacy == true) {
              dataLayer.push({
                event: 'optin_granted',
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
    let form = Array.from(document.getElementsByClassName('vtex-login-2-x-content--emailVerification') as HTMLCollectionOf<HTMLElement>)[0]
    form.style.display = 'flex'
    setRegisterFormVisible(false)
  }

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
      {!registerFormVisible ? (
        !success ?
          <button onClick={() => hideFirstForm()} className={style.confirmButton}> {translateMessage(messages.register)}​ </button> : null
      ) : null
      }
      {registerFormVisible ?
        <div className={style.formContainer}>
          <div className={style.infoContainer}>{translateMessage(messages.nextStep)}</div>
          <div>
            <form onSubmit={handleSubmit}​>
              <div>
                <div className={style.inputContainer}>
                  <Input
                    label={translateMessage(messages.name)}
                    value={nameValue}
                    placeholder={translateMessage(messages.insertName)}
                    onChange={(e: any) => setNameValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.inputContainer}>
                  <Input
                    label={translateMessage(messages.surname)}
                    value={surnameValue}
                    placeholder={translateMessage(messages.insertsurName)}
                    onChange={(e: any) => setSurnameValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.inputContainer}>
                  <Input
                    label={translateMessage(messages.email)}
                    placeholder={translateMessage(messages.example)}
                    value={emailValue}
                    type="email"
                    onChange={(e: any) => setEmailValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.informativa}>
                  {<p className={style.privacy}>
                    I understand and acknowledge the content of the
                    <span className={style.colorEdb112}>
                      <a className={style.link} href={privacyLink} target="_blank">
                        Privacy notice
                      </a>

                    </span>
                    and:
                  </p>}
                  <Checkbox
                    checked={privacy}
                    id="privacy-check"
                    label={agreeText}
                    name="default-checkbox-group"
                    onChange={(e: any) => {
                      setPrivacy(e.target.checked);
                    }}
                    value={privacy}
                  />
                </div>
              </div>
              <div className={style.buttonContainer}>
                {!loading ? (
                  !success ? (
                    <Button type='submit' >{translateMessage(messages.register)}​</Button>) :
                    (alreadyRegistered ? <div><span className={style.registered}>{textAlreadyRegistered}</span><Link href={`/login?returnUrl=/${locale}/account`}>{translateMessage(messages.agree)} </Link></div> : null)
                ) : (
                  <div className={style.loaderForm}​></div>
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
      description: 'Testo utente registrato',
      default: ''
    }
  },
};

export default LoginForm
