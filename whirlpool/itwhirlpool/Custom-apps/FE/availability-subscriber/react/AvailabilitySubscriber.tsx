import React, { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "react-apollo";
import { Button, Input, Checkbox } from "vtex.styleguide";
import { useProduct } from "vtex.product-context";
import type { Seller } from "vtex.product-context";
import ADD_TO_AVAILABILITY_SUBSCRIBER_MUTATION from "./graphql/addToAvailabilitySubscriberMutation.graphql";
import styles from "./AvailabilitySubscriber.css";
import { getDefaultSeller } from "./utils/sellers";
import { usePixel } from "vtex.pixel-manager";


interface WindowGTM extends Window { dataLayer: any[]; }

interface MutationVariables {
  acronym: string;
  document: {
    fields: Array<{
      key: string;
      value?: string | null;
    }>;
  };
}

interface AvailabilitySubscriberProps {
  // title: string;
  // description: string;
  /* Product's availability */
  available?: boolean;
  /* SKU id to subscribe to */
  skuId?: string;
  alreadyRegisteredForNewsletterUserLabel: string;
  alreadyRegisteredUserLabel: string;
  firstCheckboxLabel: string;
  secondCheckboxLabel: string;
  successLabel: string;
  // privacyBackinStock:string;
  // privacySubscriptionNewletter:string;
}
//external campaign
const campaign = "FORM_LP_BACKINSTOCK";
const isAvailable = (commertialOffer?: Seller["commertialOffer"]) => {
  return (
    commertialOffer &&
    (Number.isNaN(+commertialOffer.AvailableQuantity) ||
      commertialOffer.AvailableQuantity > 0)
  );
};

const getSessionData = () => {
  return fetch("/api/sessions?items=*")
    .then((res: any) => res.json())
    .then((data) => {
      return data.namespaces.profile;
    });
};
const putNewUser = (
  campaign: string,
  optin: boolean,
  email: string,
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
      campaign: campaign,
      isNewsletterOptIn: optin,
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

/**
 * Availability Subscriber Component.
 * A form where users can sign up to be alerted
 * when a product becomes available again
 */
const AvailabilitySubscriber: StorefrontFunctionComponent<
  AvailabilitySubscriberProps
> = ({
  // title,
  // description,
  available,
  skuId,
  firstCheckboxLabel = "Acconsento al trattamento dei miei dati personali per permettere a Whirlpool di informarmi via mail quando il prodotto torna disponibile sul sito, il prezzo del prodotto scende, e di inviarmi una tabella di comparazione tra i prodotti selezionati.",
  secondCheckboxLabel = "Acconsento al trattamento dei miei dati personali per permettere a Whirlpool Italia Srl di inviarmi newsletter/comunicazioni di marketing (in forma elettronica e non, anche tramite telefono, posta tradizionale, e-mail, SMS, notifiche push su siti di terze parti tra cui sulle piattaforme Facebook e Google) riguardanti prodotti e servizi di Whirlpool Italia Srl, anche da me acquistati o registrati, nonché di svolgere ricerche di mercato.",
  // privacyBackinStock,
  // privacySubscriptionNewletter,
  // labelCheck = "Accetto di ricevere comunicazioni marketing personalizzate da Whirlpool e da altri marchi di Whirlpool Corporation, nonché il 5% di sconto su uno dei miei prossimi acquisti. Sconto utilizzabile entro 12 mesi.",
  //  alreadyRegisteredForNewsletterUserLabel = "Sei già registrato!",
  alreadyRegisteredUserLabel = 'Per modificare il flag della sezione "newsletter", è necessario accedere al tuo account personale.',
}: // successLabel = "La registrazione alla notifica di prodotto è avvenuta con successo.",
AvailabilitySubscriberProps) => {
  const dataLayer = (window as unknown as WindowGTM).dataLayer || [];
  
  const productContext = useProduct();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailEmptyError, setEmailEmptyError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [surnameError, setSurnameError] = useState(false);
  const [privacyEroor, setPrivacyEroor] = useState(false);
  const [didBlurEmail, setDidBlurEmail] = useState(false);
  const [isPrivacy, setIsPrivacy] = useState(false);
  const [isOptin, setIsOptin] = useState(false);
  const [loadingOptin, setLoadingOptin] = useState(false);
  const [successBS, setSuccessBS] = useState(false);
  const [successUser, setSuccessUser] = useState(false);

  const [isAlreadyRegistred, setAlreadyRegister] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const { push } = usePixel();

  // const [didFieldBlur, setDidFieldBlur] = useState(false);
  // const [isFormValid, setFormValid] = useState(false);
  // const [errors, setErrors] = useState<{ [index: string]: any }>({});
  useEffect(() => {
    getSessionData().then((res) => {
      setIsLogged(res.isAuthenticated.value === "true");
      if (res.email) {
        setEmail(res.email?.value);
      }
    });
  }, []);

  const [signUp, { loading, error, data }] = useMutation<
    unknown,
    MutationVariables
  >(ADD_TO_AVAILABILITY_SUBSCRIBER_MUTATION);

  const Optin = async (
    email: string,
    name: string,
    surname: string,
    optin: boolean
  ) => {
    setAlreadyRegister(false);

    getIdUser(email).then(async (User: any) => {
      // is registred user ?
      if (User.length > 0) {
        fetch("/api/sessions?items=*")
          .then((response: any) => response.json())
          .then(async (res: any) => {
            //is logged in user
            if (
              res.namespaces.profile == undefined ||
              res.namespaces.profile.isAuthenticated.value == "false"
            ) {
              setIsLogged(false);
              //did select optin to update optin value ?
              if (optin) {
                setAlreadyRegister(true);
                setLoadingOptin(false);
                setName("");
                setSurname("");
                setEmail("");
                setIsPrivacy(false);
                setIsOptin(false);
              }
              //alredy registred user with optin a false and selected optin checkbox
            } else if (!User[0].isNewsletterOptIn && optin) {
              //update optin for user
              putNewOptinForUser();
              setSuccessUser(true);
              setName("");
              setSurname("");
              setEmail("");
              setIsPrivacy(false);
              setIsOptin(false);
              setLoadingOptin(false);

              const event = new CustomEvent("message:success", {
                detail: {
                  success: true,
                  message: intl.formatMessage({
                    id: "store/availability-subscriber.added-user-message",
                  }),
                },
              });

              document.dispatchEvent(event);

              //GA4FUNREQ61
              push({ event: "ga4-optin" });

              push({event: "availabilitySubscribe", text: 'email when available'})
              
              dataLayer.push({
                event: "leadGeneration",
                eventCategory: "Lead Generation",
                eventAction: "Optin granted",
                eventLabel: "Lead from Back in stock",
                email: email
              })
            }
            // setLoading(false);
          });
      } else if (isOptin) {
        putNewUser(campaign, isOptin, email, name, surname).then(
          (repsonse: any) => {
            setAlreadyRegister(false);
            setLoadingOptin(false);
            if (repsonse.Message == undefined) {
              setSuccessUser(true);
              setLoadingOptin(false);
              setName("");
              setSurname("");
              setEmail("");
              setIsPrivacy(false);
              setIsOptin(false);

              const event = new CustomEvent("message:success", {
                detail: {
                  success: true,
                  message: intl.formatMessage({
                    id: "store/availability-subscriber.added-user-message",
                  }),
                },
              });
              document.dispatchEvent(event);

              //GA4FUNREQ61
              push({ event: "ga4-optin" });
              
              push({event: "availabilitySubscribe", text: 'email when available'})
              
              dataLayer.push({
                event: "leadGeneration",
                eventCategory: "Lead Generation",
                eventAction: "Optin granted",
                eventLabel: "Lead from Back in stock",
                email: email
              })
            }
          }
        );
      }
    });
  };

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

  const intl = useIntl();

  const seller = getDefaultSeller(productContext.selectedItem?.sellers);

  available = available ?? isAvailable(seller?.commertialOffer);
  skuId = skuId ?? productContext.selectedItem?.itemId;
  const refId = productContext.selectedItem?.referenceId[0].Value;

  // Render component only if the product is out of stock
  if (available || !skuId) {
    return null;
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setSuccessBS(false);
    setSuccessUser(false);
    handleValidation();
    e.preventDefault();

    if (isFormValid) {
      setLoadingOptin(true);
      getIdUser(email).then(async () => {
        // is registred user ?
        // if (!(User.length > 0 && !isLogged && isOptin)) {

        const variables: MutationVariables = {
          acronym: "BS",
          document: {
            fields: [
              {
                key: "email",
                value: email,
              },
              {
                key: "refId",
                value: refId,
              },
            ],
          },
        };
        //new user - subscribe to back in stock and create the new user
        const signUpMutationResult = signUp({
          variables,
        });
        if (!(await signUpMutationResult).errors) {
          setName("");
          setSurname("");
          setEmail("");
          setIsPrivacy(false);
          setIsOptin(false);
          setSuccessBS(true);
          setLoadingOptin(false);
        }
        // }
      });

      await Optin(email, name, surname, isOptin);
    }
  };

  const validateEmail = (newEmail: string) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    setEmailError(!emailRegex.test(newEmail.toLowerCase()));
  };
  let emptyFieldError = intl.formatMessage({
    id: "store/availability-subscriber.error-message",
  });

  let emailErrorMessage = "";
  if ((didBlurEmail && emailError) || emailEmptyError) {
    emailErrorMessage = intl.formatMessage({
      id: "store/availability-subscriber.invalid-email",
    });
  }

  const handleValidation = () => {
    if (name === "") {
      setNameError(true);
    }
    if (surname === "") {
      setSurnameError(true);
    }
    if (email === "") {
      setEmailEmptyError(true);
    }
    if (!isPrivacy) {
      setPrivacyEroor(true);
    }
  };
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailEmptyError(false);
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameError(false);
    setName(e.target.value);
  };
  const handleSurnameameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSurnameError(false);
    setSurname(e.target.value);
  };
  const handlePrivacyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsPrivacy(e.target.checked);
    setPrivacyEroor(!e.target.checked);
  };

  const isFormValid = isLogged
    ? isPrivacy
    : !nameError &&
      !emailEmptyError &&
      !surnameError &&
      !emailError &&
      email !== "" &&
      // loading &&
      // loadingOptin &&
      isPrivacy;

  return (
    <div className={styles.subscriberContainer}>
      <div className={`${styles.title} t-body mb3`}>
        {/* "store/availability-subscriber.privacy" */}
        {/* {intl.formatMessage({ id: "store/availability-subscriber.title" })} */}
        {intl.formatMessage({
          id: "store/availability-subscriber.subscribe-label",
        })}
      </div>
      {/* <div className={`${styles.subscribeLabel} t-small fw3`}>
        {intl.formatMessage({
          id: "store/availability-subscriber.subscribe-label",
        })}
        
      </div> */}
      <form className={`${styles.form} mb4`} onSubmit={(e) => handleSubmit(e)}>
        <div>
          <div className={`${styles.content} flex-ns justify-between mt4 `}>
            {!isLogged && (
              <div
                className={`${styles.input} ${styles.inputName} w-100 mr5 mb4`}
              >
                <Input
                  name="name"
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "store/availability-subscriber.name-placeholder",
                  })}
                  value={name}
                  onChange={handleNameChange}
                  errorMessage={nameError}
                />
                <span>
                  {nameError ? (
                    <span id="firstNameError" className={styles.inputError}>
                      {emptyFieldError}
                    </span>
                  ) : null}
                </span>
              </div>
            )}
            {!isLogged && (
              <div
                className={`${styles.input} ${styles.inputName} w-100 ml5 mb4`}
              >
                <Input
                  name="surname"
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "store/availability-subscriber.surname-placeholder",
                  })}
                  value={surname}
                  onChange={handleSurnameameChange}
                  errorMessage={surnameError}
                />
                <span>
                  {surnameError ? (
                    <span id="firstNameError" className={styles.inputError}>
                      {emptyFieldError}
                    </span>
                  ) : null}
                </span>
              </div>
            )}
          </div>
          {!isLogged && (
            <div className={`${styles.input} ${styles.inputEmail} mt4  mb4`}>
              <Input
                name="email"
                type="text"
                placeholder={intl.formatMessage({
                  id: "store/availability-subscriber.email-placeholder",
                })}
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setDidBlurEmail(true)}
                error={didBlurEmail && emailError}
                errorMessage={emailErrorMessage}
                // required={true}
              />
              {/* <span>
                {emailEmptyError ? (
                  <span id="firstNameError" className={styles.inputError}>
                    {emptyFieldError}
                  </span>
                ) : null}
              </span> */}
            </div>
          )}
          <div className={`${styles.checkbox}`}>
            <Checkbox
              name="privacy"
              id="privacy"
              checked={isPrivacy}
              type="text"
              value={isPrivacy}
              onChange={handlePrivacyChange}
              // onChange={handlePrivacyChange}
              // required={true}
              label=""
              errorMessage={surnameError}
            />
            <span>{firstCheckboxLabel}</span>
          </div>
          <span>
            {privacyEroor ? (
              <span id="firstNameError" className={styles.inputError}>
                {emptyFieldError}
              </span>
            ) : null}
          </span>

          <div className={`${styles.checkbox}`}>
            <Checkbox
              name="Optin"
              id="Optin"
              checked={isOptin}
              type="text"
              value={isOptin}
              onChange={(e: any) => {
                setIsOptin(e.target.checked);
              }}
              // onChange={handleOptinChange}
              // required={true}
              // label={labelCheck}
            />
            {/* <span>{labelCheck}</span> */}
            <div className={styles.text}>{secondCheckboxLabel}</div>
          </div>
          <div className={`${styles.submit} flex items-center mb4`}>
            <Button
              className={styles.avvisamiBtn}
              type="submit"
              variation="primary"
              size="small"
              // disabled={!isFormValid}
              // disabled={!isFormValid }

              isLoading={loading || loadingOptin}
            >
              {intl.formatMessage({
                id: "store/availability-subscriber.notifiy-me",
              })}
            </Button>
          </div>
        </div>
        {/* {((!error && data) || success) && isPrivacy && (
          <div className={`${styles.success} t-body c-success`}>
            {intl.formatMessage({
              id: "store/availability-subscriber.added-message",
            })}
          </div>
        )} */}

        {!loading && !successBS && !successUser && data ? (
          error && (
            <div className={`${styles.error} c-danger`}>
              {intl.formatMessage({
                id: "store/availability-subscriber.error-message",
              })}
            </div>
          )
        ) : isAlreadyRegistred && !isLogged ? (
          <>
            <div className={`${styles.success} t-body c-success`}>
              {intl.formatMessage({
                id: "store/availability-subscriber.added-bs-message",
              })}
            </div>
            <div className={`${styles.error} c-danger`}>
              {alreadyRegisteredUserLabel}
            </div>
          </>
        ) : successBS ? (
          successUser ? (
            <div className={`${styles.success} t-body c-success`}>
              {intl.formatMessage({
                id: "store/availability-subscriber.added-user-message",
              })}
            </div>
          ) : (
            <div className={`${styles.success} t-body c-success`}>
              {intl.formatMessage({
                id: "store/availability-subscriber.added-bs-message",
              })}
            </div>
          )
        ) : (
          <div></div>
        )}
      </form>
    </div>
  );
};
AvailabilitySubscriber.schema = {
  title: "Availability Subscriber - back in stock",
  description: "Availability Subscriber form",
  type: "object",
  properties: {
    title: {
      title: "Modal title",
      description: "",
      default: "Questo prodotto non è al momento disponibile",
      type: "string",
    },
    description: {
      title: "Modal subtitle",
      description: "",
      default: "Voglio sapere quando questo prodotto sarà disponibile",
      type: "string",
    },
    nameLabel: {
      title: "Name label",
      description: "",
      default: "Nome",
      type: "string",
    },
    surnameLabel: {
      title: "Surname label",
      description: "",
      default: "Cognome",
      type: "string",
    },
    emailLabel: {
      title: "Email label",
      description: "",
      default: "Email",
      type: "string",
    },
    textButton: {
      title: "Button label",
      description: "Label shown on the submit button",
      default: "",
      type: "string",
    },
    firstCheckboxLabel: {
      title: "Privacy label",
      default:
        "Acconsento al trattamento dei miei dati personali per permettere a Whirlpool di informarmi via mail quando il prodotto torna disponibile sul sito, il prezzo del prodotto scende, e di inviarmi una tabella di comparazione tra i prodotti selezionati.",
      description: "Label shown for the first checkbox",
      type: "string",
      widget: {
        "ui:widget": "textarea",
      },
    },
    secondCheckboxLabel: {
      title: "Label shown for checkbox privacy",
      description: "Label shown for the second checkbox",
      default:
        "Acconsento al trattamento dei miei dati personali per permettere a Whirlpool Italia Srl di inviarmi newsletter/comunicazioni di marketing (in forma elettronica e non, anche tramite telefono, posta tradizionale, e-mail, SMS, notifiche push su siti di terze parti tra cui sulle piattaforme Facebook e Google) riguardanti prodotti e servizi di Whirlpool Italia Srl, anche da me acquistati o registrati, nonché di svolgere ricerche di mercato.",
      type: "string",
      widget: {
        "ui:widget": "textarea",
      },
    },
    alreadyRegisteredForNewsletterUserLabel: {
      title:
        "Label to be displayed when the user is already registered to the newsletter",
      description:
        "Label to be displayed when the user is already registered to the newsletter",
      default: "Sei già registrato!",
      type: "string",
    },
    alreadyRegisteredUserLabel: {
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
        "Label to be displayed when the user registred correctly to the back in stock notification",
      description:
        "Label to be displayed when the user is registered tocorrectly to the back in stock notification",
      default:
        "La registrazione alla notifica di prodotto è avvenuta con successo.",
      type: "string",
    },
  },
};

export default AvailabilitySubscriber;
