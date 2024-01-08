import React, { useState,useEffect } from 'react'
import { usePixel } from 'vtex.pixel-manager'
import { Input, Button, Checkbox, Link } from 'vtex.styleguide'


import style from "./style.css";

type Props = {
  textButton?: string
  textNextStep: string
  textAlreadyRegistered: string
  linkPrivacy:string
}
interface WindowGTM extends Window { dataLayer: any[]; }


const LoginForm: StorefrontFunctionComponent<Props> = ({
  textButton = 'Registrati',
  textNextStep = 'Nel prossimo step ti verrà chiesto di verificare la tua mail',
  textAlreadyRegistered = 'Sei già un utente registrato',
  linkPrivacy ='/pagine/informativa-sulla-privacy'

}) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
  const { push } = usePixel()
  
  const [registerFormVisible, setRegisterFormVisible] = useState(false)
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buttonInForgotPassword, setButtonInForgotPassword] = useState(true)
  const [hooksValue, setHooksValue] = useState(false);

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
              setSuccess(true);
              showForm()
              push({ event: "accountCreation", text: "register" });

              const ga4Data = { 
                registrationArea: "Personal Area",
                type: 'registration'
              }

              dataLayer.push({
                event: 'userRegistration',
              });
              dataLayer.push({
                event: 'personalArea',     
                eventCategory: 'Personal Area',                            
                eventAction: 'Start Registration',                         
                eventLabel: 'Start Registration from Personal Area'
              }) 

              push({ event: "ga4-personalArea", ga4Data })
              
              dataLayer.push({
                event: "emailForSalesforce",
                eventCategory: "Email for Salesforce",
                eventAction: "Email from registration",
                email: emailValue
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
              })
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

  const setHooks = () => {
    setInterval(() => {
      if (!document) return
      if (hooksValue) return;
      let linkToForgotPassword: any = document.getElementsByClassName('vtex-login-2-x-forgotPasswordLink')[0]
      if (linkToForgotPassword) {
        linkToForgotPassword.addEventListener("click", function (e: any) {
          e.preventDefault();
          setButtonInForgotPassword(false)
        })
        setHooksValue(true)
      }
    }, 500)
  }

  useEffect(() => {

    document.onreadystatechange =
      function () {
        if (document.readyState === 'complete') {
          setTimeout(() => {
            let linkToForgotPassword: any = document.getElementsByClassName('vtex-login-2-x-forgotPasswordLink')[0]
            linkToForgotPassword.addEventListener("click", function (e: any) {
              e.preventDefault();
              setButtonInForgotPassword(false)
            })
          }, 100)
        }
      }
  }, []);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
      {setHooks()}
      {!registerFormVisible ? (
        (!success && buttonInForgotPassword)?
          <button onClick={() => hideFirstForm()} className={style.confirmButton}>{textButton}</button> : null
      ) : null
      }
      {registerFormVisible ?
        <div className={style.formContainer}>
          <div className={style.infoContainer}>{textNextStep}</div>
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <div className={style.inputContainer}>
                  <Input
                    label="NOME *"
                    value={nameValue}
                    placeholder="Inserisci il tuo nome"
                    onChange={(e: any) => setNameValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.inputContainer}>
                  <Input
                    label="COGNOME *"
                    value={surnameValue}
                    placeholder="Inserisci il tuo cognome"
                    onChange={(e: any) => setSurnameValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.inputContainer}>
                  <Input
                    label="EMAIL *"
                    placeholder="Ad esempio: esempio@mail.com"
                    value={emailValue}
                    type="email"
                    onChange={(e: any) => setEmailValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.informativa}>
                  <p className={style.privacy}>
                    Ho compreso e prendo atto del contenuto dell'
                    <span className={style.colorEdb112}>
                      <a className={style.link} href={linkPrivacy} target="_blank">
                        informativa sulla privacy
                      </a>
                    </span>
                    e:
                  </p>
                  <Checkbox
                    checked={privacy}
                    id="privacy-check"
                    label="Acconsento al trattamento dei miei dati personali per permettere a Whirlpool Italia Srl di inviarmi newsletter/comunicazioni di marketing (in forma elettronica e non, anche tramite telefono, posta tradizionale, e-mail, SMS, notifiche push su siti di terze parti tra cui sulle piattaforme Facebook e Google) riguardanti prodotti e servizi di Whirlpool Italia Srl, anche da me acquistati o registrati, nonché di svolgere ricerche di mercato. Con la registrazione potrò usufruire di uno sconto del 5% valido sul primo acquisto effettuato entro 12 mesi dalla registrazione. Sconto cumulabile con le altre offerte in essere."
                    name="default-checkbox-group"
                    onChange={(e: any) => {
                      setPrivacy(e.target.checked);
                    }}
                    required={false}
                    value={privacy}
                  />
                </div>
              </div>
              <div className={style.buttonContainer}>
                {!loading ? (
                  !success ? (
                    <Button type='submit' >{textButton}</Button>) :
                    (alreadyRegistered ? <div><span className={style.registered}>{textAlreadyRegistered}</span><Link href='/login?returnUrl=/account'>Torna alla login</Link></div> : null)
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
      description: 'Testo utente registrato',
      default: ''
    }
  },
};

export default LoginForm
