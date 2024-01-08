import React, { useState } from "react";
import { useContext } from "react";
import { Input, Checkbox } from "vtex.styleguide";
import { CampaignContext } from "./CampaignContext";
import style from "./style.css";
import picture from "./assets/pop-up-image.jpg";
import { FormattedMessage } from 'react-intl';

interface NewsLetterFormProps {
  title?: string;
  imageTrigger: boolean;
  description?: boolean;
  textButton?: string;
  linkPrivacy: string;
  name: boolean;
  surname: boolean;
  namePlaceholder:string;
  surnamePlaceholder:string;
  emailPlaceholder:string;
  nameLabel: string;
  surnameLabel: string;
  emailLabel: string; 
  privacyLabel?: string;
  labelCheck: string;
  alreadyRegisteredForNewsletterUserLabel: string;
  alreadyRegisteredUserLabel: string;
  successLabel: string;
  promoActive:boolean;
  promotionText: [string]
  privacyPolicyText : [any]

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

const putNewUser = (email: string, campaign: string, name?: string, surname?: string) => {
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
      campaign: campaign
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

const NewsLetterForm: StorefrontFunctionComponent<NewsLetterFormProps> = 
({
  title,
  imageTrigger,
  description,
  namePlaceholder,
  surnamePlaceholder,
  emailPlaceholder,
  nameLabel ,
  surnameLabel,
  emailLabel,
  textButton,
  name,
  surname,
  labelCheck,
  alreadyRegisteredForNewsletterUserLabel,
  alreadyRegisteredUserLabel,
  successLabel,
  promoActive,
  promotionText,
  privacyPolicyText,
  
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
  const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
  const nameInput = React.useRef(null);
  const surnameInput = React.useRef(null)
  const policyInput = React.useRef(null)
  const [error, setError] = useState(false);
  const isRequired = (!regEx.test(emailValue) && emailValue !== "") || (error) && !emailValue ? true : false;

  let parsedText: string = "";

  function checkBoxValidation() {
    const el = document.querySelector(".itwhirlpool-newsletter-popup-custom-0-x-informativa") as HTMLInputElement;
    const checkboxWrapper = document.querySelector(
      ".itwhirlpool-newsletter-popup-custom-0-x-informativa .vtex-checkbox__box-wrapper"
    ) as HTMLInputElement;
    let privacyCheck = document.getElementById("privacy-check") as HTMLInputElement;

    if (privacyCheck != null && privacyCheck.checked === true || (error) && !privacy) {

      if (el != null) {
        el.style.background = "#f2f2f2f2";
        el.style.padding = "0.5rem";
        el.style.outline = "1px solid #f2f2f2f2";
        el.style.borderRadius = "0.25rem";
        checkboxWrapper.style.border = "none"
      }
    } else {
      privacyCheck.checked = false
      el.style.background = "white"
      el.style.padding = "0.5rem";
      el.style.outline = "1px solid red";
      el.style.borderRadius = "0.25rem";
      privacyCheck.style.border = "1px solid red"
      checkboxWrapper.style.border = "1px solid red"
    }
  }

  const campaign = useContext(CampaignContext)

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
          putNewUser(
            emailValue,
            campaign.campaignState,
            nameValue,
            surnameValue
          ).then((repsonse: any) => {
            setAlreadyRegister(false);
            setLoading(false);
            if (repsonse.Message == undefined) {
              setSuccess(true);
              dataLayer.push({
                event: "userRegistration",
              });
              dataLayer.push({
                event: "personalArea",
                eventCategory: "Personal Area",
                eventAction: "Start Registration",
                eventLabel: "Start Registration from NewsLetter",
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
          });
        }
      });
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const generateForm = () => {
    return (
      <div className={style.containerForm}>
        {imageTrigger &&
          <img src={picture} />}
        <div className={imageTrigger ? style.containerFormRight : style.containerNoImage}>

          <h2 className={style.titleForm}>{title}</h2>
          <h4 className={style.descriptionForm}>{description}</h4>
          <form onSubmit={handleSubmit}>
            <div className={style.fieldContainer}>
              <Input
                label={emailLabel}
                placeholder={emailPlaceholder}
                value={emailValue}
                // type="email"
                onChange={(e: any) => setEmailValue(e.target.value)}
                required={isRequired}
              />
              {(!regEx.test(emailValue) && emailValue !== "" && isRequired && (
                <span className={style.invalidInput}><FormattedMessage id="store/newsLetterForm.FieldRequired"/></span>
              )) ||
                (error && isRequired && (
                  <span className={style.invalidInput}>
                    <FormattedMessage id="store/newsLetterForm.FieldRequired"/>
                  </span>
                ))}
            </div>
            {name ? (
              <div className={style.fieldContainer}>
                <Input
                  label={nameLabel}
                  value={nameValue}
                  placeholder={namePlaceholder}
                  onChange={(e: any) => {
                    setNameValue(e.target.value);
                    setError(false);
                  }}
                  ref={nameInput}
                  required={
                    (document.activeElement === nameInput.current &&
                      !nameValue) ||
                      (error && !nameValue)
                      ? true
                      : false
                  }
                // required={true}
                />
                {(document.activeElement === nameInput.current &&
                  !nameValue && (
                    <span className={style.invalidInput}>
                      <FormattedMessage id="store/newsLetterForm.FieldRequired"/>
                    </span>
                  )) ||
                  (error && !nameValue && (
                    <span className={style.invalidInput}>
                      <FormattedMessage id="store/newsLetterForm.FieldRequired"/>
                    </span>
                  ))}
              </div>
            ) : null}
            {surname ? (
              <div className={style.fieldContainer}>
                <Input
                  label={surnameLabel}
                  value={surnameValue}
                  placeholder={surnamePlaceholder}
                  onChange={(e: any) => setSurnameValue(e.target.value)}
                  ref={surnameInput}
                  required={
                    (document.activeElement === surnameInput.current &&
                      !surnameValue) ||
                      (error && !surnameValue)
                      ? true
                      : false
                  }
                />
                {(document.activeElement === surnameInput.current &&
                  !surnameValue && (
                    <span className={style.invalidInput}>
                      <FormattedMessage id="store/newsLetterForm.FieldRequired"/>
                    </span>
                  )) ||
                  (error && !surnameValue && (
                    <span className={style.invalidInput}>
                      <FormattedMessage id="store/newsLetterForm.FieldRequired"/>
                    </span>
                  ))}
              </div>
            ) : null}
            <div className={style.informativa}>
              <p className={style.privacy}>
                {
                  <>
                    {//parsing del testo inserito in privacy, traduce in html se ce n'è all'interno
                      <p>{privacyPolicyText?.map((item:any)=> {
                        parsedText= item?.__editorItemTitle
                          return<div dangerouslySetInnerHTML={{ __html: parsedText}} />
                        })}</p>
                    }
                  </>
                }
              </p>

              <Checkbox
                checked={privacy}
                id="privacy-check"
                label={labelCheck}
                name="default-checkbox-group"
                onChange={(e: any) => {
                  setPrivacy(e.target.checked);
                  checkBoxValidation();
                }}
                // required={true}
                value={privacy}
                ref={policyInput}
              />
              {(document.activeElement === policyInput.current &&
                privacy === false && (
                  <span className={style.invalidInput}>
                   <FormattedMessage id="store/newsLetterForm.checkRequired"/>
                  </span>
                )) ||
                (error && !privacy && (
                  <span className={style.invalidInput}>
                    <FormattedMessage id="store/newsLetterForm.checkRequired"/>
                  </span>
                ))}

                { promoActive &&
                  //se la promozione è attiva come in polonia allora mostra le diciture
                    <>
                      <p>{promotionText?.map((item:any)=> {
                        return (<p>{item.__editorItemTitle}</p>)
                      })}</p>
                    </>
                  }
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
                    {alreadyRegisteredUserLabel}
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
  title: "NewsLetterFrom",
  description: "Newsletter form",
  type: "object",
  properties: {
    imageTrigger: {
      title: "Image on Off",
      description: "",
      default: false,
      type: "boolean",
    },
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
    name: {
      title: "Name on Off",
      description: "",
      default: false,
      type: "boolean",
    },
    nameLabel: {
      title: "Name label",
      description: "",
      default: "NOME *",
      type: "string",
    },
    surName: {
      title: "Surname on Off",
      description: "",
      default: false,
      type: "boolean",
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
    namePlaceholder: {
      title: "name  Placeholder",
      description: "",
      default: "Insert Name *",
      type: "string",
    },
    surnamePlaceholder: {
      title: "Surname Placeholder",
      description: "",
      default: "Insert Surname *",
      type: "string",
    },
    emailPlaceholder: {
      title: "Email Placeholder",
      description: "",
      default: "Insert Email *",
      type: "string",
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
     labelCheck: {
      title: "Label shown for checkbox privacy",
      description: "",
      default:
        "I consent to the processing of my personal data to allow Whirlpool to send me newsletters / marketing communications (in electronic and non-electronic form, including by telephone, traditional mail, e-mail, SMS, MMS, push notifications on third-party sites including on Facebook and Google platforms) regarding Whirlpool products and services, also purchased or registered by me, as well as to carry out market research.",
      type: "string",
    },
    promoActive: {
      title: "Activate Promo",
      description: "",
      default: false,
      type: "boolean",
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
     textButton: {
      title: "Button label",
      description: "Label shown on the submit button",
      default: "",
      type: "string",
    },
    alreadyRegisteredForNewsletterUserLabel: {
      title:
        "Label to be displayed when the user is already registered to the newsletter",
      description:
        "Label to be displayed when the user is already registered to the newsletter",
      default: "You are already registered",
      type: "string",
    },
    alreadyRegisteredUserLabel: {
      title:
        "Label to be displayed when the user is already registered to the site",
      description:
        "Label to be displayed when the user is registered to the site but not to the newsletter",
      default:
        "Your email is already registered in our systems. You can change your preferences on the MyAccount page, by accessing the site with your credentials. Thank you.",
      type: "string",
    },
    successLabel: {
      title:
        "Label to be displayed when the user successfully registers for the newsletter",
      description:
        "Label to be displayed when the user successfully registers for the newsletter",
      default: "Thank you for signing up to our newsletter!",
      type: "string",
    },
  },
};

export default NewsLetterForm;
