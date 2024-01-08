import React, { useContext, useEffect, useState } from "react";
import style from "../style.css";
//@ts-ignore
import { useIntl } from "react-intl";
import { Checkbox, Input } from "vtex.styleguide";
import { index as RichText } from 'vtex.rich-text';
import { CampaignContext } from "../CampaignContext";
/* utils */
import verify from "../utils/verify";
/* services */
import { usePixel } from "vtex.pixel-manager";
import { getIdUser, putNewUser } from "../service/service";

interface LandingPageFormProps {
  linkPrivacy?: string;
  linkThankYouPage?: any;
  name: boolean;
  surname: boolean;
  alreadyRegisteredForNewsletterUserLabel: string;
  alreadyRegisteredUserLabel: string;
  emailPlaceholder: string;
  promotionText: string;
}
interface WindowGTM extends Window {
  dataLayer: any[];
}
interface State {
  inputEmailErrorFlag: boolean;
  inputNameErrorFlag: boolean;
  inputSurnameErrorFlag: boolean;
  inputCheckboxErrorFlag: boolean;
}

const LandingPageForm: StorefrontFunctionComponent<LandingPageFormProps> = ({
  linkThankYouPage,
  linkPrivacy,
  name = true,
  surname = true,
  alreadyRegisteredForNewsletterUserLabel,
  alreadyRegisteredUserLabel,
  emailPlaceholder,
  promotionText
}) => {
  /*--- INTL ---*/
  const intl = useIntl();
  const { push } = usePixel();

  /* component state  */
  const [state, setState] = useState<State>({
    inputEmailErrorFlag: false,
    inputNameErrorFlag: false,
    inputSurnameErrorFlag: false,
    inputCheckboxErrorFlag: false,
  });

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
  // Handle campaign
  const campaign = useContext(CampaignContext);

  const queryString = window?.location?.search;
  const urlParams = queryString ? new URLSearchParams(queryString) : undefined;
  const campaignFromUrl = urlParams ? urlParams.get("campaign") : undefined;

  const campaignToSend = campaignFromUrl
    ? campaignFromUrl
      ?.toString()
      ?.toUpperCase()
      ?.replace("=", "")
    : campaign?.campaignState;

  /* Submit API Call */
  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    getIdUser(emailValue).then((User: any) => {
      if (User?.length > 0 && !User[0]?.isNewsletterOptIn) {
        fetch("/api/sessions?items=*")
          .then((response: any) => response.json())
          .then((res: any) => {
            if (res?.namespaces?.profile == undefined || res?.namespaces?.profile?.isAuthenticated?.value == "false") {
              setIsLogged(false);
            } else {
              putNewUser(emailValue, campaignToSend, nameValue, surnameValue);
            }
            setLoading(false);
            setSuccess(true);
          });
      } else if (User?.length > 0 && User[0]?.isNewsletterOptIn) {
        setLoading(false);
        setSuccess(true);
        setAlreadyRegister(true);
      } else {
        putNewUser(emailValue, campaignToSend, nameValue, surnameValue).then((response: any) => {
          setAlreadyRegister(false);
          setLoading(false);
          if (response.toLowerCase() == "ok") {
            setSuccess(true);
            push({ event: "newsletterSubscription", text: "send" });
            dataLayer.push({
              event: "userRegistration",
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
  };
  /* redirect thank you page */
  useEffect(() => {
    if (success && isLogged && !isAlreadyRegistred) {
      window.location.href = linkThankYouPage;
    }
  }, [isAlreadyRegistred, success, isLogged]);
  /*verify the inputs values */
  const verifyInputsValues = (e: any) => {
    let errorEmailFlag = verify.verifyEmail(emailValue);
    let errorNameFlag = verify.verifyName(nameValue);
    let errorSurnameFlag = verify.verifyName(surnameValue);
    let errorCheckboxFlag = verify.verifyCheck(privacy);
    setState({
      ...state,
      inputEmailErrorFlag: errorEmailFlag,
      inputNameErrorFlag: errorNameFlag,
      inputSurnameErrorFlag: errorSurnameFlag,
      inputCheckboxErrorFlag: errorCheckboxFlag,
    });
    e.preventDefault();
    if (!errorEmailFlag && !errorNameFlag && !errorSurnameFlag && !errorCheckboxFlag) {
      handleSubmit(e);
    } else {
      // setError(true);
      //GA4FUNREQ58
      setAnalyticCustomError();
    }
  };

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

    if (!nameValue) {
      ga4Data.description = errorMessages.noNameMessage;
      push({ ...ga4Data });
    }
    if (!surnameValue) {
      ga4Data.description = errorMessages.noSurnameMessage;
      push({ ...ga4Data });
    }
    if (!regEx.test(emailValue)) {
      ga4Data.description = errorMessages.invalidEmailMessage;
      push({ ...ga4Data });
    }
    if (!privacy) {
      ga4Data.description = errorMessages.privacyNotAccepted;
      push({ ...ga4Data });
    }
  };

  return (
    <div className={style.containerLandingPageForm}>
      <div className={style.intoLandingPageForm}>
        {/* <h4 className={style.descriptionFormNewsletter}>
          {intl.formatMessage({
            id: "store/newsletter-popup-custom.descriptionBold",
          })}
        </h4>
        <div>
          {intl.formatMessage({
            id: "store/newsletter-popup-custom.descriptionLandingPage1",
          })}
        </div>
        <div>
          {intl.formatMessage({
            id: "store/newsletter-popup-custom.descriptionLandingPage2",
          })}
        </div> */}
        <form onSubmit={verifyInputsValues}>
          <div className="pt7">
            <b>
              {intl.formatMessage({
                id: "store/newsletter-popup-custom.LandingPageLabel",
              })}
            </b>
          </div>
          <div className="flex flex-wrap">
            <div className="w-50-l w-100-s pr5-l ">
              {name ? (
                <div className={state.inputNameErrorFlag ? style.fieldContainerError : style.fieldContainer}>
                  <Input
                    label={
                      intl.formatMessage({
                        id: "store/newsletter-popup-custom.nameLabel",
                      })
                    }
                    value={nameValue}
                    onChange={(e: any) => setNameValue(e.target.value)}
                  />
                  {state.inputNameErrorFlag && (
                    <div className={style.errorLabel}>
                      {intl.formatMessage({
                        id: "store/newsletter-popup-custom.errorName",
                      })}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <div className="w-50-l w-100-s pl5-l">
              {surname ? (
                <div className={state.inputSurnameErrorFlag ? style.fieldContainerError : style.fieldContainer}>
                  <Input
                    label={
                      intl.formatMessage({
                        id: "store/newsletter-popup-custom.surnameLabel",
                      })
                    }
                    value={surnameValue}
                    onChange={(e: any) => setSurnameValue(e.target.value)}
                  />
                  {state.inputSurnameErrorFlag && (
                    <div className={style.errorLabel}>
                      {intl.formatMessage({
                        id: "store/newsletter-popup-custom.errorSurname",
                      })}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <div className="w-50-l w-100-s pr5 ">
              <div className={state.inputEmailErrorFlag ? style.fieldContainerError : style.fieldContainer}>
                <Input
                  label={
                    intl.formatMessage({
                      id: "store/newsletter-popup-custom.emailLabel",
                    })
                  }
                  placeholder={emailPlaceholder}
                  value={emailValue}
                  type="text"
                  onChange={(e: any) => setEmailValue(e.target.value)}
                />

                {state.inputEmailErrorFlag && (
                  <div className={style.errorLabel}>
                    {intl.formatMessage({
                      id: "store/newsletter-popup-custom.errorEmail",
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={style.informativa}>
            <p className={style.privacyBold}>
              {intl.formatMessage({
                id: "store/newsletter-popup-custom.CheckboxLabel1",
              })}
            </p>
            <p className={style.privacy}>
              {intl.formatMessage({
                id: "store/newsletter-popup-custom.CheckboxLabel1.1",
              })}
              <span className={style.colorEdb112}>
                <a className={style.link} href={linkPrivacy} target="_blank">
                  {intl.formatMessage({
                    id: "store/newsletter-popup-custom.mandatoryPrivacyLink",
                  })}
                </a>
                :
              </span>
            </p>
            <div className="ml0 pt5">
              {/* <p className="pt5">
                {intl.formatMessage({
                  id: "store/newsletter-popup-custom.CheckboxLabel",
                })}
              </p> */}

              <Checkbox
                checked={privacy}
                id="privacy-check"
                label={intl.formatMessage({
                  id: "store/newsletter-popup-custom.checkboxLabel",
                })}
                name="default-checkbox-group"
                onChange={(e: any) => {
                  setPrivacy(e.target.checked);
                }}
                required={false}
                value={privacy}
              />
              {state.inputCheckboxErrorFlag && (
                <div className={style.errorLabel}>
                  {intl.formatMessage({
                    id: "store/newsletter-popup-custom.errorCheckbox",
                  })}
                </div>
              )}
            </div>
          </div>
          <div className={style.submitContainer}>
            {!loading ? (
              !success ? (
                <div className="flex">
                  <div className={`mr2 ${style.leftButtonNewsLetterPage}`}>
                    <Input
                      type="submit"
                      value={intl.formatMessage({
                        id: "store/newsletter-popup-custom.labelButton",
                      })}
                    />
                  </div>
                </div>
              ) : isAlreadyRegistred ? (
                <>
                  <Input
                    type="submit"
                    value={intl.formatMessage({
                      id: "store/newsletter-popup-custom.labelButton",
                    })}
                  />
                  <div style={{ marginBottom: "1rem" }} />
                  <div className={style.errorClass}>{alreadyRegisteredForNewsletterUserLabel}</div>
                </>
              ) : !isLogged ? (
                <div className={style.errorClass}>{alreadyRegisteredUserLabel}</div>
              ) : (
                <></>
              )
            ) : (
              <div className={style.loaderForm}></div>
            )}
          </div>
          <p className={style.downTextPopFormNew}>
            <RichText text={promotionText ? promotionText : ""} />
          </p>
        </form>
      </div>
    </div>
  );
};

export default LandingPageForm;
