import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRuntime } from "vtex.render-runtime";
import { useIntl, defineMessages } from "react-intl";
import { Input, Checkbox, Button } from "vtex.styleguide";
import style from "./ProductCategoryAdviceForm.css";
import {postCategoryAdviceForm, putNewOptinForUser, getSessionData, putNewUser, getIdUser} from "./utils/categoryAdviceUtils"
import { usePixel } from "vtex.pixel-manager";

interface WindowGTM extends Window { dataLayer: any[]; }

interface ProductCategoryAdviceFormProps {
  linkPrivacy: string;
  privacyLabel: string;
  campaign:string;
  //  concentCategoryAdviceLabel: string;
  textButton: string;
  concentOptinLabel: string;
  alreadyRegisteredForNewsletterUserLabel: string;
  alreadyRegisteredUserLabel: string;
  successLabel: string;
}
const messages = defineMessages({
  nameLabel: {
    defaultMessage: "",
    id: "store/category-advice-form.name-label",
  },
  surnameLabel: {
    defaultMessage: "",
    id: "store/category-advice-form.surname-label",
  },
  emailLabel: {
    defaultMessage: "",
    id: "store/category-advice-form.email-label",
  },
  namePlaceholder: {
    defaultMessage: "",
    id: "store/category-advice-form.name-placeholder",
  },
  surnamePlaceholder: {
    defaultMessage: "",
    id: "store/category-advice-form.surname-placeholder",
  },
  emailPlaceholder: {
    defaultMessage: "",
    id: "store/category-advice-form.email-placeholder",
  },
  sendLabel: {
    defaultMessage: "",
    id: "store/category-advice-form.send-label",
  },
  ObligatoryFieldError: {
    defaultMessage: "",
    id: "store/category-advice-form.obligatory-field-error",
  },
  errorMessage: {
    defaultMessage: "",
    id: "store/category-advice-form.error-message",
  },
  successUserCreated: {
    defaultMessage: "",
    id: "store/category-advice-form.success-user-created",
  },
  successSendEmail: {
    defaultMessage: "",
    id: "store/category-advice-form.success-send-email",
  },
  invalidMail: {
    defaultMessage: "",
    id: "store/category-advice-form.invalid-mail",
  },
  title: {
    defaultMessage: "",
    id: "store/category-advice-form.title",
  },
  description: {
    defaultMessage: "",
    id: "store/category-advice-form.description",
  },
});



const ProductCategoryAdviceForm: StorefrontFunctionComponent<
  ProductCategoryAdviceFormProps
> = ({
  linkPrivacy,
  campaign,
  //  concentCategoryAdviceLabel,
  concentOptinLabel,
  // alreadyRegisteredForNewsletterUserLabel,
  alreadyRegisteredUserLabel,
  textButton,
}: // successLabel,
ProductCategoryAdviceFormProps) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
  const { push } = usePixel();

  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [isLogged, setIsLogged] = useState(true);
  const [category, setCategory] = useState("");
  const [loadingOptin, setLoadingOptin] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [surnameError, setSurnameError] = useState(false);
  //  const [privacyEroor, setPrivacyEroor] = useState(false);
  const [emailEmptyError, setEmailEmptyError] = useState(false);
  // const [isPrivacy, setIsPrivacy] = useState(false);
  const [successAdvice, setSuccessAdvice] = useState(false);
  const [successUser, setSuccessUser] = useState(false);
  const [isOptin, setIsOptin] = useState(false);
  const [didBlurEmail, setDidBlurEmail] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [isalreadyRegister, setAlreadyRegister] = useState(false);
  const [showCategoryAdviceForm, setShowCategoryAdviceForm] = useState(false);

  const intl = useIntl();

  //const campaign = "form_PLP_catadvice";
  const { route } = useRuntime();

  const vtexCategories: Array<string> = [
    "lave-linge",
    "seche-linge",
    "lave-linge-sechant",
    "refrigerateurs",
    "froid-multi-portes",
    "congelateurs",
    "fours",
    "plaques-de-cuisson",
    "micro-ondes",
    "hottes",
    "lave-vaisselle",
  ];
  const salesforceCategories: Array<string> = [
    "laundry",
    "dryer",
    "laundry",
    "fridge",
    "fridge",
    "fridge",
    "oven",
    "hobs",
    "mwo",
    "hood",
    "dish",
  ];
  const getCategory = (category: any) => {
    const indexOfVtexCategory = vtexCategories.indexOf(category);
    const salesforceCategory = salesforceCategories[indexOfVtexCategory];
    setCategory(salesforceCategory);
    return salesforceCategory;
  };

  useEffect(() => {
    getSessionData().then((res) => {
      setIsLogged(res.isAuthenticated.value === "true");
      if (res.email) {
        setEmailValue(res.email.value);
        setNameValue(res.firstName.value);
        setSurnameValue(res.lastName.value);
      }
    });
  }, [loadingOptin]);

  useEffect(() => {
    const productCat = route.params.category;
    const productSubCat =
      route.params.subcategory == undefined
        ? route.params.category
        : route.params.subcategory;
    const vtexCategory = vtexCategories.includes(productSubCat as string);
    const productCategory: any = vtexCategory ? productSubCat : productCat;
    getCategory(productCategory);
    if ( vtexCategory) {
      setShowCategoryAdviceForm(true);
    }
  }, []);

  useEffect(() => {
    fetch("/api/sessions?items=*")
      .then((response: any) => response.json())
      .then((res: any) => {
        if (
          res.namespaces.profile == undefined ||
          res.namespaces.profile.isAuthenticated.value == "false"
        ) {
          setIsLogged(false);
        } else {
          setIsLogged(true);
        }
      });
  }, []);

  const handleValidation = () => {
    if (nameValue === "") {
      setNameError(true);
    }
    if (surnameValue === "") {
      setSurnameError(true);
    }
    if (emailValue === "") {
      setEmailEmptyError(true);
    }
    //  if (!isPrivacy) {
    //    setPrivacyEroor(true);
    //  }
  };

  const Optin = async (
    email: string,
    name: string,
    surname: string,
    optin: boolean,
    category: string
  ) => {
    setAlreadyRegister(false);
    getIdUser(email).then(async (User: any) => {
      if (User.length > 0) {
        fetch("/api/sessions?items=*")
          .then((response: Response) => response.json())
          .then((res: any) => {
            if (
              res.namespaces.profile == undefined ||
              res.namespaces.profile.isAuthenticated.value == "false"
            ) {
              setIsLogged(false);
              if (optin) {
                setAlreadyRegister(true);
                setLoadingOptin(false);
                setNameValue("");
                setSurnameValue("");
                setEmailValue("");
                // setIsPrivacy(false);
                setIsOptin(false);
              }
            } else if (!User[0].isNewsletterOptIn && optin) {
              putNewOptinForUser();
              setSuccessUser(true);
              setNameValue("");
              setSurnameValue("");
              setEmailValue("");
              // setIsPrivacy(false);
              setIsOptin(false);
              setLoadingOptin(false);
              const event = new CustomEvent("message:success", {
                detail: {
                  success: true,
                  message: intl.formatMessage(messages.successUserCreated),
                },
              });

              document.dispatchEvent(event);

              //GA4FUNREQ61
              push({ event: "ga4-optin" });
            }
          });
        postCategoryAdviceForm(email, name, surname, category).then(
          (response) => {
            if (response.status == 200) {
              setSuccessAdvice(true);
            } else {
              setIsError(true);
            }
          }
        );
      } else {
        await putNewUser(campaign?.toUpperCase() ?? "", optin, email, name, surname).then(
          (repsonse: any) => {
            
            setAlreadyRegister(false);
            setLoadingOptin(false);
            if (repsonse.Message == undefined) {
              setSuccessUser(true);
              setLoadingOptin(false);
              setNameValue("");
              setSurnameValue("");
              setEmailValue("");
              // setIsPrivacy(false);
              setIsOptin(false);

              const event = new CustomEvent("message:success", {
                detail: {
                  success: true,
                  message: intl.formatMessage(messages.successUserCreated),
                },
              });

              document.dispatchEvent(event);

              //GA4FUNREQ61
              push({ event: "ga4-optin" });
            }
          }
        );
        postCategoryAdviceForm(email, name, surname, category).then(
          (response: any) => {
            if (response.status == 200) {
              setSuccessAdvice(true);
            } else {
              setIsError(true);
            }
          }
        );
      }

      push({event: "needAdviceBox", text: 'email when available'})
      
      dataLayer.push({
        event: "leadGeneration",
        eventCategory: "Lead Generation",
        eventAction: "Optin granted",
        eventLabel: "Lead from registration",
        email: email
      })
    });
  };
  const isFormValid = 
  // isLogged ? isPrivacy : 
    !nameError &&
      !emailEmptyError &&
      !surnameError &&
      !emailError &&
      emailValue !== ""&&
      nameValue !== ""&&
      surnameValue !== ""

      //  isPrivacy;
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setSuccessAdvice(false);
    setSuccessUser(false);
    setIsError(false);
    handleValidation();
    e.preventDefault();
    if (isFormValid) {
      setLoadingOptin(true);
      getIdUser(emailValue).then(async (User: any) => {
        if (!(User.length > 0 && !isLogged && isOptin)) {
          setNameValue("");
          setSurnameValue("");
          setEmailValue("");
          // setIsPrivacy(false);
          setIsOptin(false);
          setLoadingOptin(false);
        }
      });
      ////////

      // const categoryEN =
      //   category === "climatiseurs"
      //     ? "air-conditioning"
      //     : category === "cuisson"
      //     ? "cooking"
      //     : category === "froid"
      //     ? "refrigeration"
      //     : category === "lavage"
      //     ? "laundry"
      //     : category === "lave-vaisselle"
      //     ? "dishwashing"
      //     : "Empty";

      // console.log(categoryEN,successAdvice);

      // category === "empty"
      //   ? null
      //   : postCategoryAdviceForm(
      //       emailValue,
      //       nameValue,
      //       surnameValue,
      //       categoryEN
      //     );
      setLoadingOptin(false);
      e.preventDefault();
      e.stopPropagation();
      await Optin(emailValue, nameValue, surnameValue, isOptin, category);
    }
  };

  const validateEmail = (newEmail: string) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    setEmailError(!emailRegex.test(newEmail.toLowerCase()));
  };
  let emptyFieldError = intl.formatMessage(messages.ObligatoryFieldError);

  let emailErrorMessage = "";
  if ((didBlurEmail && emailError) || emailEmptyError) {
    emailErrorMessage = intl.formatMessage(messages.invalidMail);
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailEmptyError(false);
    setEmailValue(e.target.value);
    validateEmail(e.target.value);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameError(false);
    setNameValue(e.target.value);
  };
  const handleSurnameameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSurnameError(false);
    setSurnameValue(e.target.value);
  };
  //  const handlePrivacyChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     setIsPrivacy(e.target.checked);
  //    setPrivacyEroor(!e.target.checked);
  //  };
  return showCategoryAdviceForm ? (
    <div className={style.containerForm}>
      <h2 className={style.titleForm}>{intl.formatMessage(messages.title)}</h2>
      <h4 className={style.descriptionForm}>
        {intl.formatMessage(messages.description)}</h4>

      <form className={style.formContainer} onSubmit={handleSubmit}>
        <div>
        Veuillez nous indiquer vos nom,prénom et adresse e-mail afin de recevoir nos emails de conseils concernant vos appareils
          <div className={`${style.content} flex-ns justify-between mt4 `}>
            {!isLogged && (
              <div
                className={`${style.input} ${style.inputName} w-100 mr5 mb4`}
              >
                <Input
                  label={intl.formatMessage(messages.nameLabel)}
                  name="name"
                  type="text"
                  value={nameValue}
                  placeholder={intl.formatMessage(messages.namePlaceholder)}
                  onChange={handleNameChange}
                  errorMessage={nameError}
                />
                <span>
                  {nameError ? (
                    <span id="firstNameError" className={style.inputError}>
                      {emptyFieldError}
                    </span>
                  ) : null}
                </span>
              </div>
            )}

            {!isLogged && (
              <div
                className={`${style.input} ${style.inputName} w-100 ml5 mb4`}
              >
                <Input
                  label={intl.formatMessage(messages.surnameLabel)}
                  name="surname"
                  type="text"
                  placeholder={intl.formatMessage(messages.surnamePlaceholder)}
                  value={surnameValue}
                  onChange={handleSurnameameChange}
                  errorMessage={surnameError}
                />
                <span>
                  {surnameError ? (
                    <span id="firstNameError" className={style.inputError}>
                      {emptyFieldError}
                    </span>
                  ) : null}
                </span>
              </div>
            )}
          </div>
          {!isLogged && (
            <div className={`${style.input} ${style.inputEmail} mt4  mb4`}>
              <Input
                label={intl.formatMessage(messages.emailLabel)}
                name="email"
                type="text"
                placeholder={intl.formatMessage(messages.emailPlaceholder)}
                value={emailValue}
                onChange={handleEmailChange}
                onBlur={() => setDidBlurEmail(true)}
                error={didBlurEmail && emailError}
                errorMessage={emailErrorMessage}
              />
            </div>
          )}

<div className={`${style.submit} flex items-center mb4`}>
            <Button
              className={style.avvisamiBtn}
              type="submit"
              variation="primary"
              size="small"
              isLoading={loadingOptin}
              disabled={!isFormValid}
            >
              {textButton}
            </Button>
          </div>
          {/* { <div className={`${style.checkbox}`}>
            <Checkbox
              name="privacy"
              id="privacy"
              checked={isPrivacy}
              type="text"
              value={isPrivacy}
              onChange={handlePrivacyChange}
              label=""
              errorMessage={emptyFieldError}
            />
            <span>{concentCategoryAdviceLabel}</span>
          </div> } */}
          {/* { <span>
            {privacyEroor ? (
              <span id="firstNameError" className={style.inputError}>
                {emptyFieldError}
              </span>
            ) : null}
          </span> } */}
          <>
                Je comprends le contenu de &nbsp;
                  <span className={style.colorEdb112}>
                    <a
                      className={style.link}
                      href={linkPrivacy}
                      target="_blank"
                    >
                      Politique de protection des données personnelles.
                    </a>
                  </span>
                </>
          <div className={style.checkbox}>
            <Checkbox
              name="Optin"
              id="Optin"
              checked={isOptin}
              type="text"
              value={isOptin}
              onChange={(e: any) => {
                setIsOptin(e.target.checked);
              }}
            />
            <span>
              {concentOptinLabel }
            </span>
          </div>

        </div>
        {!successAdvice && !successUser && isError ? (
          <div className={`${style.error} c-danger`}>
            {/* errorMessage */}
            {intl.formatMessage(messages.errorMessage)}
          </div>
        ) : isalreadyRegister && !isLogged ? (
          <>
            <div className={`${style.error} c-danger`}>
              <div className={`${style.success} t-body c-success`}>
                {intl.formatMessage(messages.successSendEmail)}
              </div>
              {/* alreadyRegisteredUserLabel */}
              {alreadyRegisteredUserLabel}
            </div>
          </>
        ) : successAdvice ? (
          successUser ? (
            <>
              {/* successUser true */}
              <div className={`${style.success} t-body c-success`}>
                {/* successSendEmail */}
                {intl.formatMessage(messages.successSendEmail)}
              </div>
              <div className={`${style.success} t-body c-success`}>
                {/* successUserCreated */}
                {intl.formatMessage(messages.successUserCreated)}
              </div>
            </>
          ) : (
            <div className={`${style.success} t-body c-success`}>
              {/* successUser false successSendEmail */}
              {intl.formatMessage(messages.successSendEmail)}
            </div>
          )
        ) : (
          <div></div>
        )}
      </form>
    </div>
  ) : null;
};

//   return generateForm()
// }

ProductCategoryAdviceForm.schema = {
  title: "store/category-advice-form.title",
  description: "store/category-advice-form.description",
  type: "object",
  properties: {
    linkPrivacy: {
      title: "Link to privacy page",
      description: "url privacy page",
      default: "",
      type: "string",
    },
    concentOptinLabel: {
      title: "Label shown for checkbox privacy",
      description: "",
      default:
        "(Optionnel) Je consens au traitement de mes données personnelles pour permettre à Whirlpool France S.A.S. de m'envoyer des bulletins d'information/communications marketing (sous forme électronique et non électronique, y compris par téléphone, courrier traditionnel, e-mail, SMS, MMS, notifications push sur des sites tiers, y compris sur les plateformes Facebook et Google) concernant les produits et services de Whirlpool France S.A.S. même achetés ou enregistrés par vous.",
      type: "string",
    },
    //  concentCategoryAdviceLabel: {
    //    title: "Label shown for checkbox privacy",
    //    description: "",
    //    default: "je veux recevoir la mail de la categorie conseil.",
    //    type: "string",
    //  },
    alreadyRegisteredForNewsletterUserLabel: {
      title:
        "Label to be displayed when the user is already registered to the newsletter",
      description:
        "Label to be displayed when the user is already registered to the newsletter",
      default:
        "Êtes-vous déjà inscrit! vous recevrez l'e-mail de conseil dans l'e-mail enregistré",
      type: "string",
    },
    alreadyRegisteredUserLabel: {
      title:
        "Label to be displayed when the user is already registered to the site",
      description:
        "Label to be displayed when the user is registered to the site but not to the newsletter",
      default:
        "Votre email est déjà enregistré dans nos systèmes. Vous pouvez modifier vos préférences sur la page mon compte, en accédant au site avec vos identifiants. Merci.",
      type: "string",
    },
    successLabel: {
      title:
        "Label to be displayed when the user successfully registers for the newsletter",
      description:
        "Label to be displayed when the user successfully registers for the newsletter",
      default: "Merci de vous être inscrit à notre newsletter !",
      type: "string",
    },
    textButton: {
      title: "text button",
      description: "",
      default: "Valider",
      type: "string",
    },
    campaign: {
      title: "form campaign",
      description: "",
      default: "form_PLP_catadvice",
      type: "string",
    },
  },
};

export default ProductCategoryAdviceForm;
