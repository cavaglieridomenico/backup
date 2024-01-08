import React, { useContext, useEffect, useRef, useState } from "react";
import { Checkbox, Input } from "vtex.styleguide";
// import { useContext } from "react";
import { FormattedMessage } from "react-intl";
import style from "./style.css";
// import { CampaignContext } from "./CampaignContext";
import { usePixel } from "vtex.pixel-manager";
import picture from "./assets/pop-up-image.jpg";
import NewsletterContext from "./NewsLetterContext";

interface NewsLetterFormProps {
  title?: string;
  description?: boolean;
  textButton?: string;
  linkPrivacy: string;
  name: boolean;
  surname: boolean;
  nameLabel: string;
  surnameLabel: string;
  emailLabel: string;
  privacyLabel?: string;
  checkboxText?: string;
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

const putNewUser = (userData: any) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
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
  linkPrivacy = "/informacja-o-ochronie-prywatnosci",
  name = true,
  surname = true,
  privacyPolicyTextBeforeLink = "Przeczytałem i zrozumiałem treść ",
  privacyPolicyTextLink = "informacji",
  privacyPolicyTextAfterLink = "dotyczących ochrony danych osobowych oraz:",
}: NewsLetterFormProps) => {
  const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAlreadyRegistred, setAlreadyRegister] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  const [userData, setUserData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    isNewsletterOptIn: true,
    campaign: "",
  });
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
    (!regEx.test(userData.email) && userData.email !== "") ||
    (error && !userData.email)
      ? true
      : false;

  const newsletterContext = useContext(NewsletterContext);

  const { push } = usePixel();

  //GA4FUNREQ60
  const analyticsPopupWrapper: any = useRef(null);
  useEffect(() => {
    if (!analyticsPopupWrapper) return;
    const ga4Data = {
      event: "popup",
      popupId: analyticsPopupWrapper.current.id,
    };
    push({
      event: "newsletterLink",
      text: textButton ?? "Subscribe to our newsletter",
    });
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

    if (!regEx.test(userData.email)) {
      ga4Data.description = errorMessages.invalidEmailMessage;
      push({ ...ga4Data });
    }
    if (!userData.firstName) {
      ga4Data.description = errorMessages.noNameMessage;
      push({ ...ga4Data });
    }
    if (!userData.lastName) {
      ga4Data.description = errorMessages.noSurnameMessage;
      push({ ...ga4Data });
    }
    if (!consent) {
      ga4Data.description = errorMessages.privacyNotAccepted;
      push({ ...ga4Data });
    }
  };

  function checkBoxValidation() {
    const el = document.querySelector(
      ".plwhirlpool-newsletter-popup-custom-0-x-informativa"
    ) as HTMLInputElement;
    const checkboxWrapper = document.querySelector(
      ".plwhirlpool-newsletter-popup-custom-0-x-informativa .vtex-checkbox__box-wrapper"
    ) as HTMLInputElement;
    let privacyCheck = document.getElementById(
      "consent-check"
    ) as HTMLInputElement;

    if (
      (privacyCheck != null && privacyCheck.checked === true) ||
      (error && !consent)
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

  const handleInputChange = (string: string, name: string) => {
    setUserData((prevState: any) => ({ ...prevState, [name]: string }));
  };

  const handleSubmit = (e: any) => {
    if (
      !userData.email ||
      !userData.firstName ||
      !userData.lastName ||
      !consent
    ) {
      setError(true);
      checkBoxValidation();
      e.preventDefault();

      //GA4FUNREQ58
      setAnalyticCustomError();
    } else {
      checkBoxValidation();

      setLoading(true);
      getIdUser(userData.email).then((User: any) => {
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
          putNewUser(userData).then((repsonse: any) => {
            setAlreadyRegister(false);
            setLoading(false);
            if (repsonse.Message == undefined) {
              setSuccess(true);
              if (newsletterContext.automatic)
                push({
                  event: "newsletterAutomaticSubscription",
                  text: textButton,
                });
              else
                push({
                  event: "newsletterSubscription",
                  text: textButton,
                });

              dataLayer.push({
                event: "userRegistration",
              });

              //Duplicate analytic event:
              // dataLayer.push({
              //   event: "personalArea",
              //   eventCategory: "Personal Area",
              //   eventAction: "Start Registration",
              //   eventLabel: "Start Registration from NewsLetter",
              // });

              dataLayer.push({
                event: "leadGeneration",
                eventCategory: "Lead Generation",
                eventAction: "Optin granted",
                eventLabel: "Lead from newsletter",
                email: userData.email,
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
            }
          });
        }
      });
    }

    e.preventDefault();
    e.stopPropagation();
  };

  const customMessage = () => {
    setTimeout(() => {
      var inputEmail: any = document.getElementById("modal-newsletter-email");
      inputEmail.oninvalid = function(e: any) {
        e.target.setCustomValidity("Complétez le champ");
      };
      inputEmail.oninput = function(e: any) {
        e.target.setCustomValidity("");
      };
      var inputName: any = document.getElementById("modal-newsletter-name");
      inputName.oninvalid = function(e: any) {
        e.target.setCustomValidity("Complétez le champ");
      };
      inputName.oninput = function(e: any) {
        e.target.setCustomValidity("");
      };
      var inputSurname: any = document.getElementById(
        "modal-newsletter-surname"
      );
      if (inputSurname) {
        inputSurname.oninvalid = function(e: any) {
          e.target.setCustomValidity("Complétez le champ");
        };
        inputSurname.oninput = function(e: any) {
          e.target.setCustomValidity("");
        };
      }
      var inputSurname: any = document.getElementById("privacy-check");
      if (inputSurname) {
        inputSurname.oninvalid = function(e: any) {
          e.target.setCustomValidity("Cochez cette case pour continuer");
        };
        inputSurname.oninput = function(e: any) {
          e.target.setCustomValidity("");
        };
      }
    }, 500);
  };
  const handleClose = () => {
    //dispatch window event close modal

    document.dispatchEvent(new CustomEvent("closeModal"));
  };
  customMessage();

  const generateForm = () => {
    return (
      <div
        className="analytics-popup-wrapper"
        id="newsletter_popup"
        ref={analyticsPopupWrapper}
      >
        <div className={style.containerForm}>
          <img className={style.picture} alt={"newsletter image"} src={picture} />
          <div className={style.containerFormRight}>
            <h2 className={style.titleForm}>{title}</h2>
            <h4 className={style.descriptionForm}>{description}</h4>
            <form onSubmit={handleSubmit}>
              <div className={style.fieldContainer}>
                <Input
                  label="EMAIL*"
                  placeholder="EMAIL*"
                  value={userData.email}
                  type="email"
                  onChange={(e: any) =>
                    handleInputChange(e.target.value, "email")
                  }
                  required={isRequired}
                  id="modal-newsletter-email"
                />
                {(!regEx.test(userData.email) &&
                  userData.email !== "" &&
                  isRequired && (
                    <span className={style.invalidInput}>
                      Proszę wpisać prawidłowy email
                    </span>
                  )) ||
                  (error && isRequired && (
                    <span className={style.invalidInput}>
                      Proszę wpisać prawidłowy email
                    </span>
                  ))}
              </div>
              {name ? (
                <div className={style.fieldContainer}>
                  <Input
                    label="IMIĘ*"
                    placeholder="IMIĘ*"
                    value={userData.firstName}
                    onChange={(e: any) => {
                      handleInputChange(e.target.value, "firstName");
                      setError(false);
                    }}
                    ref={nameInput}
                    required={
                      (document.activeElement === nameInput.current &&
                        !userData.firstName) ||
                      (error && !userData.firstName)
                        ? true
                        : false
                    }
                    id="modal-newsletter-name"
                  />
                  {(document.activeElement === nameInput.current &&
                    !userData.firstName && (
                      <span className={style.invalidInput}>
                        To pole jest wymagane
                      </span>
                    )) ||
                    (error && !userData.firstName && (
                      <span className={style.invalidInput}>
                        To pole jest wymagane
                      </span>
                    ))}
                </div>
              ) : null}
              {surname ? (
                <div className={style.fieldContainer}>
                  <Input
                    label="NAZWISKO*"
                    placeholder="NAZWISKO*"
                    value={userData.lastName}
                    ref={surnameInput}
                    onChange={(e: any) =>
                      handleInputChange(e.target.value, "lastName")
                    }
                    required={
                      (document.activeElement === surnameInput.current &&
                        !userData.lastName) ||
                      (error && !userData.lastName)
                        ? true
                        : false
                    }
                    id="modal-newsletter-surname"
                  />
                  {(document.activeElement === surnameInput.current &&
                    !userData.lastName && (
                      <span className={style.invalidInput}>
                        To pole jest wymagane
                      </span>
                    )) ||
                    (error && !userData.lastName && (
                      <span className={style.invalidInput}>
                        To pole jest wymagane
                      </span>
                    ))}
                </div>
              ) : null}
              <div className={style.informativa}>
                <p className={style.privacy}>
                  {textBeforeLink}
                  <span className={style.colorEdb112}>
                    <a
                      className={style.link}
                      href={linkPrivacy}
                      target="_blank"
                    >
                      {textLink}
                    </a>
                  </span>
                  {textAfterLink}
                </p>

                <Checkbox
                  checked={consent}
                  id="consent-check"
                  label={
                    "Wyrażam zgodę na przetwarzanie moich danych osobowych w celu umożliwienia Whirlpool Polska Appliances Sp. z o.oprzesyłania mi newslettera/wiadomości marketingowych (w formie elektronicznej i nieelektronicznej, w tym za pośrednictwem telefonu, poczty tradycyjnej, e-mail, SMS, MMS, powiadomień push na stronach osób trzecich, w tym na platformach Facebook i Google) dotyczących produktów i usług Whirlpool Polska Appliances Sp. z o.o również tych już zakupionych lub zarejestrowanych przeze mnie, a także w celu prowadzenia badań rynkowych;"
                  }
                  name="default-checkbox-group"
                  onChange={(e: any) => {
                    setConsent(e.target.checked);
                    checkBoxValidation();
                  }}
                  // required={true}
                  value={consent}
                  ref={policyInput}
                />
                {(document.activeElement === policyInput.current &&
                  consent === false && (
                    <span className={style.invalidInput}>
                      To pole jest wymagane
                    </span>
                  )) ||
                  (error && !consent && (
                    <span className={style.invalidInput}>
                      To pole jest wymagane
                    </span>
                  ))}

                <p className={style.textPrivacy}>
                  Warunki przyznania zniżki znajdują się w Regulaminie Promocji
                  poniżej:{" "}
                </p>
                <p className={style.textPrivacy}>
                  Kod na 50 złotych rabatu otrzymasz mailem po zapisaniu się do
                  newslettera, niemożliwe jest łączenie go z innymi promocjami,
                  można go użyć tylko raz.
                </p>
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
                    <div className={style.errorClass} onClick={handleClose}>
                      <FormattedMessage id="store/emailRegistered" />
                    </div>
                  ) : (
                    <div className={style.successClass} onClick={handleClose}>
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
      </div>
    );
  };

  return generateForm();
};

NewsLetterForm.schema = {
  title: "NewsLetterFrom",
  description: "Newsletter form",
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
      default: " Politique de protection des données à caractère personnel ",
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
