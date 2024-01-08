import React, { useState, useEffect, useContext, useRef } from "react";
import { Input, Checkbox } from "vtex.styleguide";
import style from "./style.css";
import { usePixel } from "vtex.pixel-manager";
import NewsletterContext from "./NewsLetterContext";

interface NewsLetterFormProps {
  title?: string;
  descriptionFirst?: string;
  descriptionSecond?: string;
  descriptionThird?: string;
  textButton?: string;
  linkPrivacy: string;
  name: boolean;
  surname: boolean;
  checkboxText: string;
  privacyPolicyTextBeforeLink: string;
  privacyPolicyTextLink: string;
  privacyPolicyTextAfterLink: string;
  successLabel: string;
  alreadyRegisteredText: string;
  alreadyRegisteredForNewsletterUserLabel: string;
  campaignForAutomaticPopup: string;
}

interface WindowGTM extends Window {
  dataLayer: any[];
}

const putNewOptinForUser = () => {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isNewsletterOptIn: true,
    }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/user/newsletteroptin";
  return fetch(fetchUrlPatch, options).then((response) => response.json());
};

const putNewUser = (
  email: string,
  campaign: string,
  name?: string,
  surname?: string
) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      firstName: name,
      lastName: surname,
      isNewsletterOptIn: true,
      campaign: campaign,
    }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/user?userId=true";
  return fetch(fetchUrlPatch, options).then((response) => response.json());
};

//Function to update CRM_User after user newsletter registration
const updateCrmUser = (email: string, name?: string, surname?: string) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      firstName: name,
      lastName: surname,
      isNewsletterOptIn: true,
    }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/crm/createUpdateCrmUser";
  return fetch(fetchUrlPatch, options).then((response) => response.json());
};

const getIdUser = (email: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const fetchUrl = "/_v/wrapper/api/user/email/userinfo?email=" + email;
  return fetch(fetchUrl, options).then((response) => response.json());
};

const NewsLetterForm: StorefrontFunctionComponent<NewsLetterFormProps> = ({
  title,
  descriptionFirst,
  descriptionSecond,
  descriptionThird,
  textButton,
  linkPrivacy = "/pagine/informativa-sulla-privacy",
  name = true,
  surname = true,
  checkboxText,
  privacyPolicyTextBeforeLink,
  privacyPolicyTextLink,
  privacyPolicyTextAfterLink,
  successLabel,
  alreadyRegisteredText,
  alreadyRegisteredForNewsletterUserLabel,
  campaignForAutomaticPopup = "FORM_HP_PROMO_5%DISC",
}: NewsLetterFormProps) => {
  const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAlreadyRegistred, setAlreadyRegister] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  const [textBeforeLink, setTextBefore] = useState("");
  const [textLink, setText] = useState("");
  const [textAfterLink, setTextAfter] = useState("");
  const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
  const nameInput = React.useRef(null);
  const surnameInput = React.useRef(null);
  const policyInput = React.useRef(null);
  const [error, setError] = useState(false);
  const isRequired =
    (!regEx.test(emailValue) && emailValue !== "") || (error && !emailValue)
      ? true
      : false;
  const { push } = usePixel();
  const newsletterContext = useContext(NewsletterContext);

  const newsletterUrl = window?.location?.href?.split("?")[1];
  const campaignToSend = newsletterUrl
    ? newsletterUrl
        ?.toString()
        ?.toUpperCase()
        ?.replace("=", "")
    : campaignForAutomaticPopup;

  //GA4FUNREQ60
  const analyticsPopupWrapper: any = useRef(null);
  useEffect(() => {
    if (!analyticsPopupWrapper) return;
    const ga4Data = {
      event: "popup",
      popupId: analyticsPopupWrapper.current.id,
    };
    push({ ...ga4Data, action: "view" });

    return () => {
      push({ ...ga4Data, action: "close" });
    };
  }, [analyticsPopupWrapper]);

  //GA4FUNREQ58
  const setAnalyticCustomError = (): void => {
    const ga4Data = {
      event: "ga4-custom_error",
      type: "error message",
      description: "",
    };

    const errorMessages = {
      invalidEmailMessage: "Invalid email format",
      noNameMessage: "Name not entered",
      noSurnameMessage: "Surname not entered",
      privacyNotAccepted: "Privacy not accepted",
    };

    if (!regEx.test(emailValue)) {
      ga4Data.description = errorMessages.invalidEmailMessage;
      push({ ...ga4Data });
    }
    if (!nameValue) {
      ga4Data.description = errorMessages.noNameMessage;
      push({ ...ga4Data });
    }
    if (!surnameValue) {
      ga4Data.description = errorMessages.noSurnameMessage;
      push({ ...ga4Data });
    }
    if (!privacy) {
      ga4Data.description = errorMessages.privacyNotAccepted;
      push({ ...ga4Data });
    }
  };

  function checkBoxValidation() {
    const el = document?.querySelector(
      ".hotpointit-newsletter-popup-custom-0-x-informativa .vtex-checkbox__line-container"
    ) as HTMLInputElement;
    const checkboxWrapper = document?.querySelector(
      ".hotpointit-newsletter-popup-custom-0-x-informativa .vtex-checkbox__box-wrapper"
    ) as HTMLInputElement;
    let privacyCheck = document?.getElementById(
      "privacy-check"
    ) as HTMLInputElement;

    if (
      (privacyCheck != null && privacyCheck.checked === true) ||
      (error && !privacy)
    ) {
      if (el != null) {
        el.style.background = "#f2f2f2f2";
        el.style.padding = "0.5rem";
        el.style.outline = "1px solid #f2f2f2f2";
        el.style.borderRadius = "0.25rem";
        checkboxWrapper.style.border = "none";
      }
    } else {
      privacyCheck.checked = false;
      el.style.background = "white";
      el.style.padding = "0.5rem";
      el.style.outline = "1px solid red";
      el.style.borderRadius = "0.25rem";
      privacyCheck.style.border = "1px solid red";
      checkboxWrapper.style.border = "1px solid red";
    }
  }

  useEffect(() => {
    setTextBefore(privacyPolicyTextBeforeLink);
    setText(privacyPolicyTextLink);
    setTextAfter(privacyPolicyTextAfterLink);
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!emailValue || !nameValue || !surnameValue || !privacy) {
      setError(true);
      checkBoxValidation();

      //GA4FUNREQ58
      setAnalyticCustomError();
    } else {
      checkBoxValidation();
      setLoading(true);
      getIdUser(emailValue).then((User: any) => {
        if (User.length > 0 && !User[0].isNewsletterOptIn) {
          fetch("/api/sessions?items=*")
            .then((response: any) => response.json())
            .then((res: any) => {
              if (
                res.namespaces.profile == undefined ||
                res.namespaces.profile.isAuthenticated.value == "false"
              ) {
                setIsLogged(false);
              } else {
                putNewOptinForUser();
              }
              setLoading(false);
              setSuccess(true);
            });
        } else if (User.length > 0 && User[0].isNewsletterOptIn) {
          setLoading(false);
          setSuccess(true);
          setAlreadyRegister(true);
          updateCrmUser(emailValue, nameValue, surnameValue);
        } else {
          putNewUser(emailValue, campaignToSend, nameValue, surnameValue).then(
            (repsonse: any) => {
              setAlreadyRegister(false);
              setLoading(false);
              if (repsonse.Message == undefined) {
                setSuccess(true);
                if (newsletterContext.automatic)
                  push({
                    event: "newsletterAutomaticSubscription",
                    text: "subscribe to newsletter",
                  });
                else
                  push({
                    event: "newsletterSubscription",
                    text: "subscribe to newsletter",
                  });

                dataLayer.push({
                  event: "userRegistration",
                });
                dataLayer.push({
                  event: "leadGeneration",
                  eventCategory: "Lead Generation",
                  eventAction: "Optin granted",
                  eventLabel: "Lead from newsletter",
                  email: emailValue,
                });

                //GA4FUNREQ23
                push({
                  event: "ga4-personalArea",
                  section: "Newsletter",
                  type: "registration",
                });

                //GA4FUNREQ53
                push({
                  event: "ga4-form_submission",
                  type: "newsletter",
                });

                //GA4FUNREQ61
                push({
                  event: "ga4-optin",
                });

                updateCrmUser(emailValue, nameValue, surnameValue);
              }
            }
          );
        }
      });
    }
  };

  const customMessage = () => {
    setTimeout(() => {
      var inputEmail: any = document?.getElementById("modal-newsletter-email");
      inputEmail.oninvalid = function(e: any) {
        e.target.setCustomValidity("Completa questo campo");
      };
      inputEmail.oninput = function(e: any) {
        e.target.setCustomValidity("");
      };
      var inputName: any = document?.getElementById("modal-newsletter-name");
      inputName.oninvalid = function(e: any) {
        e.target.setCustomValidity("Completa questo campo");
      };
      inputName.oninput = function(e: any) {
        e.target.setCustomValidity("");
      };
      var inputSurname: any = document?.getElementById(
        "modal-newsletter-surname"
      );
      inputSurname.oninvalid = function(e: any) {
        e.target.setCustomValidity("Completa questo campo");
      };
      inputSurname.oninput = function(e: any) {
        e.target.setCustomValidity("");
      };
      var inputSurname: any = document?.getElementById("privacy-check");
      inputSurname.oninvalid = function(e: any) {
        e.target.setCustomValidity("Cochez cette case pour continuer");
      };
      inputSurname.oninput = function(e: any) {
        e.target.setCustomValidity("");
      };
    }, 500);
  };

  if (window.document) {
    customMessage();
  }

  const generateForm = () => {
    return (
      <div
        className="analytics-popup-wrapper"
        id="newsletter_popup"
        ref={analyticsPopupWrapper}
      >
        <div className={style.containerFormRight}>
          <h2 className={style.titleForm}>{title}</h2>
          <h4 className={style.descriptionForm}>{descriptionFirst}</h4>
          <h4 className={style.descriptionForm}>{descriptionSecond}</h4>
          <h4 className={style.descriptionForm}>{descriptionThird}</h4>
          <form onSubmit={handleSubmit}>
            <div className={style.fieldContainer}>
              <Input
                placeholder="Email"
                value={emailValue}
                type="email"
                onChange={(e: any) => setEmailValue(e.target.value)}
                required={isRequired}
                id="modal-newsletter-email"
              />
              {(!regEx.test(emailValue) && emailValue !== "" && isRequired && (
                <span className={style.invalidInput}>
                  Inserisci un'email valida
                </span>
              )) ||
                (error && isRequired && (
                  <span className={style.invalidInput}>
                    Inserisci un'email valida
                  </span>
                ))}
            </div>
            {name ? (
              <div className={style.fieldContainer}>
                <Input
                  placeholder="Nome"
                  value={nameValue}
                  onChange={(e: any) => setNameValue(e.target.value)}
                  required={
                    (window &&
                      window.document?.activeElement === nameInput.current &&
                      !nameValue) ||
                    (error && !nameValue)
                      ? true
                      : false
                  }
                  id="modal-newsletter-name"
                  ref={nameInput}
                />
                {(window &&
                  window.document?.activeElement === nameInput.current &&
                  !nameValue && (
                    <span className={style.invalidInput}>
                      Questo campo è obbligatorio
                    </span>
                  )) ||
                  (error && !nameValue && (
                    <span className={style.invalidInput}>
                      Questo campo è obbligatorio
                    </span>
                  ))}
              </div>
            ) : null}
            {surname ? (
              <div className={style.fieldContainer}>
                <Input
                  placeholder="Cognome"
                  value={surnameValue}
                  onChange={(e: any) => setSurnameValue(e.target.value)}
                  required={
                    (window &&
                      window.document?.activeElement === surnameInput.current &&
                      !surnameValue) ||
                    (error && !surnameValue)
                      ? true
                      : false
                  }
                  id="modal-newsletter-surname"
                  ref={surnameInput}
                />
                {(window &&
                  window.document?.activeElement === surnameInput.current &&
                  !surnameValue && (
                    <span className={style.invalidInput}>
                      Questo campo è obbligatorio
                    </span>
                  )) ||
                  (error && !surnameValue && (
                    <span className={style.invalidInput}>
                      Questo campo è obbligatorio
                    </span>
                  ))}
              </div>
            ) : null}
            <div className={style.informativa}>
              <p className={style.privacy}>
                {textBeforeLink}
                <span className={style.colorEdb112}>
                  <a className={style.link} href={linkPrivacy} target="_blank">
                    {textLink}
                  </a>
                </span>
                {textAfterLink}
              </p>

              <Checkbox
                checked={privacy}
                id="privacy-check"
                label={checkboxText}
                name="default-checkbox-group"
                onChange={(e: any) => {
                  setPrivacy(e.target.checked);
                  checkBoxValidation();
                }}
                // required={true}
                value={privacy}
                ref={policyInput}
              />
              {(window &&
                window.document?.activeElement === policyInput.current &&
                privacy === false && (
                  <span className={style.invalidInput}>
                    Seleziona questa casella per continuare
                  </span>
                )) ||
                (error && !privacy && (
                  <span className={style.invalidInput}>
                    Seleziona questa casella per continuare
                  </span>
                ))}
            </div>
            <div className={style.submitContainer}>
              {!loading ? (
                !success ? (
                  <Input type="submit" value={textButton} />
                ) : isAlreadyRegistred ? (
                  <>
                    <Input type="submit" value={textButton} />
                    <div style={{ marginBottom: "1rem" }} />
                    <div className={style.errorClass}>
                      {alreadyRegisteredForNewsletterUserLabel}
                    </div>
                  </>
                ) : !isLogged ? (
                  <div className={style.errorClass}>
                    {alreadyRegisteredText}
                  </div>
                ) : (
                  <div className={style.successClass}>{successLabel}</div>
                )
              ) : (
                <div className={style.loaderForm}></div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  return generateForm();
};

NewsLetterForm.schema = {
  title: "NewsLetterForm",
  description: "Component that render the newsletter form",
  type: "object",
  properties: {
    title: {
      title: "Modal title",
      description: "",
      default: undefined,
      type: "string",
    },
    descriptionFirst: {
      title: "Modal subtitle",
      description: "",
      default: undefined,
      type: "string",
    },
    descriptionSecond: {
      title: "Modal subtitle",
      description: "",
      default: undefined,
      type: "string",
    },
    descriptionThird: {
      title: "Modal subtitle",
      description: "",
      default: undefined,
      type: "string",
    },
    nameLabel: {
      title: "Name label",
      description: "",
      default: "NOME *",
      type: "string",
    },
    surnameLabel: {
      title: "Surname label",
      description: "",
      default: "COGNOME *",
      type: "string",
    },
    emailLabel: {
      title: "Email label",
      description: "",
      default: "EMAIL *",
      type: "string",
    },
    textButton: {
      title: "Button label",
      description: "Label shown on the submit button",
      default: "",
      type: "string",
    },
    linkPrivacy: {
      title: "Link to privacy page",
      description: "url privacy page",
      default: "",
      type: "string",
    },
    privacyLabel: {
      title: "Privacy label",
      description:
        "String that accept html format for describe the privacy label",
      default: undefined,
      type: "string",
    },
    labelCheck: {
      title: "Label shown for checkbox privacy",
      description: "",
      default:
        "Acconsento al trattamento dei miei dati personali per permettere a Whirlpool di inviarmi newsletter/comunicazioni di marketing (in forma elettronica e non, anche tramite telefono, posta tradizionale, e-mail, SMS, MMS, notifiche push su siti di terze parti tra cui sulle piattaforme Facebook e Google) riguardanti prodotti e servizi di Whirlpool, anche da me acquistati o registrati, nonché di svolgere ricerche di mercato.",
      type: "string",
    },
    alreadyRegisteredForNewsletterUserLabel: {
      title:
        "Label to be displayed when the user is already registered to the newsletter",
      description:
        "Label to be displayed when the user is already registered to the newsletter",
      default: "Sei già registrato!",
      type: "string",
    },
    alreadyRegisteredText: {
      title:
        "Label to be displayed when the user is already registered to the site",
      description:
        "Label to be displayed when the user is registered to the site but not to the newsletter",
      default:
        "La tua email risulta già registrata nei nostri sistemi. Puoi modificare le tue preferenze all’interno della pagina del MyAccount, accedendo al sito con le tue credenziali. Grazie.",
      type: "string",
    },
    successLabel: {
      title:
        "Label to be displayed when the user successfully registers for the newsletter",
      description:
        "Label to be displayed when the user successfully registers for the newsletter",
      default: "Grazie per esserti iscritto alla nostra newsletter!",
      type: "string",
    },
    checkboxText: {
      title: "Checkbox field",
      description: "",
      default:
        "J'accepte de recevoir des communications marketing personnalisées de Whirlpool et d'autres marques de Whirlpool Corporation, ainsi que 5% de réduction sur l'un de mes prochains achats. Remise utilisable dans les 12 prochains mois",
      type: "string",
    },
    privacyPolicyTextBeforeLink: {
      title: "Privacy Policy Text Before Link",
      description: "",
      default: "Je comprends le contenu de",
      type: "string",
    },
    privacyPolicyTextLink: {
      title: "Privacy Policy Text Link",
      description: "",
      default: " Politique de protection des données personnelles ",
      type: "string",
    },
    privacyPolicyTextAfterLink: {
      title: "Privacy Policy Text After Link",
      description: "",
      default: "et: ",
      type: "string",
    },
    campaignForAutomaticPopup: {
      title: "Campaign Name for the Automatic popup",
      description:
        "Set this campaign name only for the automatic popup that is shown on first user site view",
      default: "FORM_HP_PROMO_5%DISC",
      type: "string",
    },
  },
};

export default NewsLetterForm;
