import React, { useState, useEffect, useContext } from "react";
import { Input, Checkbox } from "vtex.styleguide";
import { FormattedMessage } from "react-intl";
import style from "./style.css";
import picture from "./assets/pop-up-image.jpg";
import NewsletterContext from "./NewsletterContext";
import { usePixel } from "vtex.pixel-manager";

interface NewsLetterFormProps {
  title?: string;
  description?: boolean;
  textButton?: string;
  linkPrivacy: string;
  name: boolean;
  surname: boolean;
  checkboxText: string;
  privacyPolicyTextBeforeLink: string;
  privacyPolicyTextLink: string;
  privacyPolicyTextAfterLink: string;
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
  description,
  textButton,
  linkPrivacy = "/pages/politique-de-protection-des-donnees-a-caractere-personnel",
  name = true,
  surname = true,
  checkboxText,
  privacyPolicyTextBeforeLink,
  privacyPolicyTextLink,
  privacyPolicyTextAfterLink,
}: NewsLetterFormProps) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAlreadyRegistred, setAlreadyRegister] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  // const campaign = useContext(CampaignContext);
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

  const queryString = window?.location?.search;
  const urlParams = queryString ? new URLSearchParams(queryString) : null;
  const campaignFromUrl = urlParams ? urlParams?.get("campaign") : null;

  const campaignToSend = campaignFromUrl
    ? campaignFromUrl?.toString()?.toUpperCase()?.replace("=", "")
    : "";

  function checkBoxValidation() {
    const el = document?.querySelector(
      ".frwhirlpool-newsletter-popup-custom-0-x-informativa .vtex-checkbox__line-container"
    ) as HTMLInputElement;
    const checkboxWrapper = document?.querySelector(
      ".frwhirlpool-newsletter-popup-custom-0-x-informativa .vtex-checkbox__box-wrapper"
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
    if (!emailValue || !nameValue || !surnameValue || !privacy) {
      setError(true);
      checkBoxValidation();
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
        } else {
          putNewUser(emailValue, campaignToSend, nameValue, surnameValue).then(
            (repsonse: any) => {
              setAlreadyRegister(false);
              setLoading(false);
              if (repsonse.Message == undefined) {
                setSuccess(true);
                if (newsletterContext?.automatic)
                  push({
                    event: "newsletterAutomaticSubscription",
                    text: textButton ?? "subscribe to newsletter",
                  });
                else
                  push({
                    event: "newsletterSubscription",
                    text: textButton ?? "subscribe to newsletter",
                  });

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
                  eventLabel: "Lead from newsletter",
                  email: emailValue,
                });
              }
            }
          );
        }
      });
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const customMessage = () => {
    setTimeout(() => {
      var inputEmail: any = document?.getElementById("modal-newsletter-email");
      inputEmail.oninvalid = function (e: any) {
        e.target.setCustomValidity("Complétez le champ");
      };
      inputEmail.oninput = function (e: any) {
        e.target.setCustomValidity("");
      };
      var inputName: any = document?.getElementById("modal-newsletter-name");
      inputName.oninvalid = function (e: any) {
        e.target.setCustomValidity("Complétez le champ");
      };
      inputName.oninput = function (e: any) {
        e.target.setCustomValidity("");
      };
      var inputSurname: any = document?.getElementById(
        "modal-newsletter-surname"
      );
      inputSurname.oninvalid = function (e: any) {
        e.target.setCustomValidity("Complétez le champ");
      };
      inputSurname.oninput = function (e: any) {
        e.target.setCustomValidity("");
      };
      var inputSurname: any = document?.getElementById("privacy-check");
      inputSurname.oninvalid = function (e: any) {
        e.target.setCustomValidity("Cochez cette case pour continuer");
      };
      inputSurname.oninput = function (e: any) {
        e.target.setCustomValidity("");
      };
    }, 500);
  };
  if (window.document) {
    customMessage();
  }

  const generateForm = () => {
    return (
      <div className={style.containerForm}>
        <img src={picture} />
        <div className={style.containerFormRight}>
          <h2 className={style.titleForm}>{title}</h2>
          <h4 className={style.descriptionForm}>{description}</h4>
          <form onSubmit={handleSubmit}>
            <div className={style.fieldContainer}>
              <Input
                label="EMAIL *"
                placeholder="Email"
                value={emailValue}
                type="email"
                onChange={(e: any) => setEmailValue(e.target.value)}
                required={isRequired}
                id="modal-newsletter-email"
              />
              {(!regEx.test(emailValue) && emailValue !== "" && isRequired && (
                <span className={style.invalidInput}>
                  Adresse email invalide
                </span>
              )) ||
                (error && isRequired && (
                  <span className={style.invalidInput}>
                    Adresse email invalide
                  </span>
                ))}
            </div>
            {name ? (
              <div className={style.fieldContainer}>
                <Input
                  label="PRÉNOM *"
                  placeholder="Prénom"
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
                      Complétez le champ
                    </span>
                  )) ||
                  (error && !nameValue && (
                    <span className={style.invalidInput}>
                      Complétez le champ
                    </span>
                  ))}
              </div>
            ) : null}
            {surname ? (
              <div className={style.fieldContainer}>
                <Input
                  label="NOM *"
                  placeholder="Nom"
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
                      Complétez le champ
                    </span>
                  )) ||
                  (error && !surnameValue && (
                    <span className={style.invalidInput}>
                      Complétez le champ
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
                    Cochez cette case pour continuer
                  </span>
                )) ||
                (error && !privacy && (
                  <span className={style.invalidInput}>
                    Cochez cette case pour continuer
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
                      <FormattedMessage id="store/alreadyRegistered" />
                    </div>
                  </>
                ) : !isLogged ? (
                  <div className={style.errorClass}>
                    <FormattedMessage id="store/emailRegistered" />
                  </div>
                ) : (
                  <div className={style.successClass}>
                    <FormattedMessage id="store/thankyou" />
                  </div>
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
  title: "editor.newletter-form.title",
  description: "editor.newletter-form.description",
  type: "object",
  properties: {
    title: {
      title: "Modal title",
      description: "",
      default: undefined,
      type: "string",
    },
    description: {
      title: "Modal subtitle",
      description: "",
      default: undefined,
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
    labelCheck: {
      title: "Label shown for checkbox privacy",
      description: "",
      default: "",
      type: "string",
    },
    name: {
      title: "Name field",
      description:
        "Boolean able to decide if the filed name should be visible or not",
      default: true,
      type: "boolean",
    },
    surname: {
      title: "Surname field",
      description:
        "Boolean able to decide if the filed surname should be visible or not",
      default: true,
      type: "boolean",
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
  },
};

export default NewsLetterForm;
