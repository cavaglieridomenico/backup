import React, { useState, useEffect } from 'react'
import { Input, Button, Checkbox, Link } from 'vtex.styleguide'
import { usePixel } from "vtex.pixel-manager";
import style from "./style.css";

type Props = {
  textButton?: string
  textNextStep: string
  textAlreadyRegistered: string
  linkPrivacy:string
}
interface WindowGTM extends Window { dataLayer: any[]; }


const LoginForm: StorefrontFunctionComponent<Props> = ({
  textButton = 'Créer mon compte',
  textNextStep = "À l'étape suivante, il vous sera demandé de vérifier votre e-mail",
  textAlreadyRegistered = 'Vous êtes déjà un utilisateur enregistré',
  linkPrivacy ='/pagine/informativa-sulla-privacy'

}) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
  const { push } = usePixel();
  const [registerFormVisible, setRegisterFormVisible] = useState(false)
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buttonInForgotPassword,setButtonInForgotPassword] = useState(true)

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
              dataLayer.push({
                event: 'userRegistration',
              });
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
    // Push GA event
    push({
      event: "loginSectionRegistration",
      text: textButton ?? "subscribe to newsletter",
      cta_id: "registration_user_button"
    });
    setRegisterFormVisible(true)
  }
  const showForm = () => {
    let form = Array.from(document.querySelectorAll('.vtex-login-2-x-content--beginCreatePass') as NodeListOf<HTMLElement>)[0]
    form.style.display = 'flex'
    setRegisterFormVisible(false)
  }

  const callbackTimeout = (classe:any, functionToCalled:any) =>{
    let element:any = document.getElementsByClassName(classe)[0] //prendi l'elemento
    if(element){ // se l'elemento esiste
      functionToCalled() //esegui la funzione
    }else{ //altrimenti
      setTimeout(()=>{ //aspetta e ritenta
        callbackTimeout(classe,functionToCalled)
      },500)
    }
  }

  const hideIfReset =()=>{
    let linkToForgotPassword:any = document.getElementsByClassName('vtex-login-2-x-forgotPasswordLink')[0]
          linkToForgotPassword.addEventListener("click", function(){
          setButtonInForgotPassword(false)
          linkToForgotPassword.style.display = 'none'
    })
  }
  useEffect(() => {
      callbackTimeout('vtex-login-2-x-forgotPasswordLink', hideIfReset)
  }, [])

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
      {!registerFormVisible ? (
        (!success && buttonInForgotPassword) ?
          <button onClick={() => hideFirstForm()} className={style.confirmButton} id="registration_user_button">{textButton}</button> : null
      ) : null
      }
      {registerFormVisible ?
        <div className={style.formContainer}>
          <div className={style.infoContainer}>{textNextStep}</div>
          <div>
            <form onSubmit={handleSubmit}​>
              <div>
                <div className={style.inputContainer}>
                  <Input
                    label="PRÉNOM *"
                    value={nameValue}
                    placeholder="Insérez votre prénom"
                    onChange={(e: any) => setNameValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.inputContainer}>
                  <Input
                    label="NOM *"
                    value={surnameValue}
                    placeholder="Insérez votre nom"
                    onChange={(e: any) => setSurnameValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.inputContainer}>
                  <Input
                    label="EMAIL *"
                    placeholder="prenom.nom@exemple.fr"
                    value={emailValue}
                    type="email"
                    onChange={(e: any) => setEmailValue(e.target.value)}
                    required={true}
                  />
                </div>
                <div className={style.informativa}>
                  <p className={style.privacy}>
                  Je comprends le contenu de
                    <span className={style.colorEdb112}>
                      <a className={style.link} href={linkPrivacy} target="_blank">
                      &nbsp;Politique de protection des données personnelles
                      </a>
                    </span>
                    et :
                  </p>
                  <Checkbox
                    checked={privacy}
                    id="privacy-check"
                    label="Je consens au traitement de mes données personnelles pour permettre à Whirlpool France S.A.S de m'envoyer des bulletins d'information/communications marketing (sous forme électronique et non électronique, y compris par téléphone, courrier traditionnel, e-mail, SMS, MMS, notifications push sur des sites tiers, y compris sur les plateformes Facebook et Google) concernant les produits et services de Whirlpool France S.A.S même achetés ou enregistrés par vous."
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
                    <Button type='submit' id="registration_user_button">{textButton}​</Button>) :
                    (alreadyRegistered ? <div><span className={style.registered}>{textAlreadyRegistered}</span><Link href='/login?returnUrl=/account'>Retour connexion</Link></div> : null)
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
