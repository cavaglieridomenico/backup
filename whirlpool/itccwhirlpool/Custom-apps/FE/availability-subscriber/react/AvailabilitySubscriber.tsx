import React, { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "react-apollo";
import { Button, Input, Checkbox } from "vtex.styleguide";
import { useProduct } from "vtex.product-context";
import type { Seller } from "vtex.product-context";
import { useRuntime } from "vtex.render-runtime";
import saveBISForm from "./graphql/saveBISForm.graphql";
import styles from "./AvailabilitySubscriber.css";
import { getDefaultSeller } from "./utils/sellers";

interface AvailabilitySubscriberProps {
  /* Product's availability */
  available?: boolean;
  /* SKU id to subscribe to */
  skuId?: string;
  alreadyRegisteredForNewsletterUserLabel: string;
  alreadyRegisteredUserLabel: string;
  labelCheck: string;
  successLabel: string;
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
  culture: any,
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
      locale: culture.locale,
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
  available,
  skuId,
}: // alreadyRegisteredUserLabel = 'Per modificare il flag della sezione "newsletter", è necessario accedere al tuo account personale.',
AvailabilitySubscriberProps) => {
  const { binding, culture } = useRuntime();
  const productContext = useProduct();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [didBlurEmail, setDidBlurEmail] = useState(false);
  const [isPrivacy, setIsPrivacy] = useState(false);
  const [emailEmptyError, setEmailEmptyError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [surnameError, setSurnameError] = useState(false);
  const [privacyEroor, setPrivacyEroor] = useState(false);
  const [isOptin, setIsOptin] = useState(false);
  const [isAlreadyRegistred, setAlreadyRegister] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const tradePolicyCodeEPP = "d2ef55bf-ed56-4961-82bc-6bb753a25e90";
  const tradePolicyCodeFF = "df038a38-b21d-4a04-adbe-592af410dae3";
  const tradePolicyCodeVIP = "53e2c7bb-0de5-4ffe-9008-0e3f0d31a545";

  const getTradePolicyName = (b: any) => {
    let tradePolicy = "";
    switch (b) {
      case "d2ef55bf-ed56-4961-82bc-6bb753a25e90":
        tradePolicy = "EPP";
        break;
      case "df038a38-b21d-4a04-adbe-592af410dae3":
        tradePolicy = "FF";
        break;
      case "53e2c7bb-0de5-4ffe-9008-0e3f0d31a545":
        tradePolicy = "VIP";
        break;
      default:
        tradePolicy = "ECC";
        break;
    }
    return tradePolicy;
  };
  const getTradePolicyNumber = (b: any) => {
    let tradePolicy = "";
    switch (b) {
      //ecc
      case tradePolicyCodeEPP:
        tradePolicy = "1";
        break;
      // FF
      case tradePolicyCodeFF:
        tradePolicy = "2";
        break;
      // VIP
      case tradePolicyCodeVIP:
        tradePolicy = "3";
        break;
      default:
        tradePolicy = "1";
        break;
    }
    return tradePolicy;
  };

  let tradePolicyName = getTradePolicyName(binding?.id);
  let tradePolicyNumber = getTradePolicyNumber(binding?.id);

  console.log("This is the tradePolicyName: %s", tradePolicyName);
  console.log("This is the tradePolicyNumber: %s", tradePolicyNumber);
  /*-----------------------------------------------*/
  useEffect(() => {
    getSessionData().then((res) => {
      setIsLogged(res.isAuthenticated.value === "true");
      if (res.email) {
        console.log("TTTTTres.email?.value", res.email?.value);
        setEmail(res.email?.value);
      }
    });
  }, []);

  const updateSaveBis = () => {
    paymentMutation({
      variables: {
        args: {
          email: email,
          name: name,
          surname: surname,
          skuRefId: refId,
          optin: false,
          campaign: "campaing",
          tradePolicy: tradePolicyNumber,
          locale: culture.locale,
          host: window.location.href.search("epp")
            ? "testepp123.whirlpoolgroup.it"
            : window.location.href.search("ff")
            ? "testff123.whirlpoolgroup.it"
            : "testvip123.whirlpoolgroup.it",
        },
      },
    });
  };

  const [paymentMutation, { loading, error, data }]: any = useMutation(
    saveBISForm,
    {
      // onCompleted() {
      // },
    }
  );

  const intl = useIntl();

  const seller = getDefaultSeller(productContext.selectedItem?.sellers);

  available = available ?? isAvailable(seller?.commertialOffer);
  skuId = skuId ?? productContext.selectedItem?.itemId;

  // Render component only if the product is out of stock
  if (available || !skuId) {
    return null;
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

  const Optin = async (
    email: string,
    name: string,
    surname: string,
    optin: boolean
  ) => {
    setAlreadyRegister(false);
    console.log("TTTTTemail", email);

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
                console.log("sssss", isAlreadyRegistred, !isLogged);

                setAlreadyRegister(true);
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
            }
            // setLoading(false);
          });
      } else if (isOptin) {
        putNewUser(campaign, isOptin, email, culture, name, surname).then(
          (repsonse: any) => {
            setAlreadyRegister(false);
            if (repsonse.Message == undefined) {
              // setLoadingOptin(false);
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
            }
          }
        );
      }
    });
  };

  const refId = productContext.selectedItem?.referenceId[0].Value;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    handleValidation();
    e.preventDefault();

    if (isFormValid) {
      updateSaveBis();
      getIdUser(email).then(async (User: any) => {
        console.log(
          "!(User.length > 0 && isLogged)",
          !(User.length > 0 && isLogged)
        );
      });

      await Optin(email, name, surname, isOptin);
    }

    const event = new CustomEvent("message:success", {
      detail: {
        success: true,
        message: intl.formatMessage({
          id: "store/availability-subscriber.added-message",
        }),
      },
    });

    document.dispatchEvent(event);
  };

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

  const validateEmail = (newEmail: string) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    setEmailError(!emailRegex.test(newEmail.toLowerCase()));
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

  let emptyFieldError = intl.formatMessage({
    id: "store/availability-subscriber.error-message",
  });

  let emailErrorMessage = "";
  if ((didBlurEmail && emailError) || emailEmptyError) {
    emailErrorMessage = intl.formatMessage({
      id: "store/availability-subscriber.invalid-email",
    });
  }

  const isFormValid =
    isLogged && name !== "" && surname !== "" && email !== "" && isPrivacy;

  return (
    <div className={styles.subscriberContainer}>
      <div className={`${styles.title} t-body mb3`}>
        {intl.formatMessage({
          id: "store/availability-subscriber.subscribe-label",
        })}
      </div>
      <form className={`${styles.form} mb4`} onSubmit={(e) => handleSubmit(e)}>
        <div>
          <div className={`${styles.content} flex-ns justify-between mt4 `}>
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
          </div>
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
            />
          </div>
          <div className={`${styles.checkbox}`}>
            <Checkbox
              name="Optin"
              id="Optin"
              checked={isPrivacy}
              type="text"
              value={isPrivacy}
              onChange={handlePrivacyChange}
            />
            <div className={`${styles.optinText}`}>
              {intl.formatMessage({
                id: "store/availability-subscriber.privacy-date",
              })}
            </div>
          </div>
          <span>
            {privacyEroor ? (
              <span id="firstNameError" className={`${styles.inputError} mt0`}>
                {emptyFieldError}
              </span>
            ) : null}
          </span>

          <div className={`${styles.checkbox} ${styles.checkbox2}`}>
            <Checkbox
              name="privacy"
              id="privacy"
              checked={isOptin}
              type="text"
              value={isOptin}
              onChange={(e: any) => {
                setIsOptin(e.target.checked);
              }}
              label=""
              errorMessage={surnameError}
            />
            <span className={`${styles.optinText}`}>
              {intl.formatMessage({
                id: "store/availability-subscriber.privacy-personal-date",
              })}
            </span>
          </div>
          <div className={`${styles.submit} flex items-center mb4`}>
            {!loading && (
              <Button
                className={styles.avvisamiBtn}
                type="submit"
                variation="primary"
                size="small"
              >
                {intl.formatMessage({
                  id: "store/availability-subscriber.notifiy-me",
                })}
              </Button>
            )}
            {loading && (
              <Button
                className={styles.avvisamiBtn}
                type="submit"
                variation="primary"
                size="small"
                isLoading={loading}
              >
                {intl.formatMessage({
                  id: "store/availability-subscriber.notifiy-me",
                })}
              </Button>
            )}
          </div>
        </div>

        {!loading && data ? (
          <div className={`${styles.success} t-body c-success`}>
            {intl.formatMessage({
              id: "store/availability-subscriber.added-bs-message",
            })}
          </div>
        ) : (
          error && (
            <div className={`${styles.error} c-danger`}>
              {intl.formatMessage({
                id: "store/availability-subscriber.query-failed",
              })}
            </div>
          )
        )}
      </form>
    </div>
  );
};

export default AvailabilitySubscriber;
