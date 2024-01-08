import React, { useContext, useEffect, useState } from "react";
import { Checkbox, Input } from "vtex.styleguide";
import style from "../style.css";
//@ts-ignore
import { useIntl } from "react-intl";
import { CampaignContext } from "../CampaignContext";
/* utils */
import verify from "../utils/verify";
/* services */
import classnames from "classnames";
import { usePixel } from "vtex.pixel-manager";
import { index as RichText } from 'vtex.rich-text';
import { getIdUser, putNewUser } from "../service/service";

interface PopupFormProps {
  children: any;
  linkPrivacy?: string;
  linkThankYouPage: any;
  name: boolean;
  surname: boolean;
  popupTitle: string;
  popupDescriptionBold: string;
  popupDescription: string;
  alreadyRegisteredForNewsletterUserLabel: string;
  alreadyRegisteredUserLabel: string;
  emailPlaceholder: string
  namePlaceholder: string;
  surnamePlaceholder: string;
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

/* component */
const PopupForm: StorefrontFunctionComponent<PopupFormProps> = ({
  children,
  linkThankYouPage,
  linkPrivacy,
  name = true,
  surname = true,
  popupTitle,
  popupDescriptionBold,
  popupDescription,
  alreadyRegisteredForNewsletterUserLabel,
  alreadyRegisteredUserLabel,
  emailPlaceholder,
  namePlaceholder,
  surnamePlaceholder,
  promotionText
}) => {
  /*--- INTL ---*/
  const intl = useIntl();

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
  const campaign = useContext(CampaignContext);

  const { push } = usePixel();


  /* Submit API Call */
  const handleSubmit = (e: any) => {
    setLoading(true);
    getIdUser(emailValue).then((User: any) => {
      if (User?.length > 0 && !User[0].isNewsletterOptIn) {
        fetch("/api/sessions?items=*")
          .then((response: any) => response.json())
          .then((res: any) => {
            if (
              res.namespaces.profile == undefined ||
              res.namespaces.profile.isAuthenticated.value == "false"
            ) {
              setIsLogged(false);
            } else {
              putNewUser(emailValue, campaign?.campaignState, nameValue, surnameValue)
            }
            setLoading(false);
            setSuccess(true);
          });
      } else if (User?.length > 0 && User[0].isNewsletterOptIn) {
        setLoading(false);
        setSuccess(true);
        setAlreadyRegister(true);
      } else {
        putNewUser(
          emailValue,
          campaign?.campaignState,
          nameValue,
          surnameValue
        ).then((response: any) => {
          setAlreadyRegister(false);
          setLoading(false);
          if (response.toLowerCase() == "ok") {
            setSuccess(true);
            push({ event: "newsletterSubscription", text: "send" });
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
        });
      }
    });
    e.preventDefault();
    e.stopPropagation();
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
    if (
      !errorEmailFlag &&
      !errorNameFlag &&
      !errorSurnameFlag &&
      !errorCheckboxFlag
    ) {
      handleSubmit(e);
    }
  };

  const generateForm = () => {
    return (
      <>
        <div className={style.containerForm}>
          <>{children}</>
          <div className={style.containerFormRight}>
            <h2 className={style.titleFormNewsletter}>
              {popupTitle
                ? popupTitle
                : intl.formatMessage({
                  id: "store/newsletter-popup-custom.title",
                })}
            </h2>
            <h4
              className={classnames(
                style.descriptionFormNewsletter,
                style.descriptionFormNewsletterPopup
              )}
            >
              {popupDescriptionBold
                ? popupDescriptionBold
                : intl.formatMessage({
                  id: "store/newsletter-popup-custom.descriptionBold",
                })}
            </h4>
            <div className={style.descriptionInfo}>
              <RichText text={popupDescription ? popupDescription : intl.formatMessage({ id: "store/newsletter-popup-custom.description" })} />
              {/* {popupDescription
                ? popupDescription
                :
                intl.formatMessage({
                    id: "store/newsletter-popup-custom.description",
                  })
                  } */}
            </div>
            <form onSubmit={verifyInputsValues}>
              <div
                className={
                  state.inputEmailErrorFlag
                    ? style.fieldContainerErrorNew
                    : style.fieldContainerNew
                }
              >
                <Input
                  // label={intl.formatMessage({
                  //   id: "store/newsletter-popup-custom.emailLabelRequred",
                  // })}
                  placeholder={emailPlaceholder}
                  value={emailValue}
                  type="text"
                  onChange={(e: any) => setEmailValue(e.target.value)}
                // required={isRequired}
                />

                {state.inputEmailErrorFlag && (
                  <div className={style.errorLabelNew}>
                    {intl.formatMessage({
                      id: "store/newsletter-popup-custom.errorEmail",
                    })}
                  </div>
                )}
              </div>
              {name ? (
                <div
                  className={
                    state.inputNameErrorFlag
                      ? style.fieldContainerErrorNew
                      : style.fieldContainerNew
                  }
                >
                  <Input
                    // label={intl.formatMessage({
                    //   id: "store/newsletter-popup-custom.nameLabelRequred",
                    // })}
                    placeholder={namePlaceholder}
                    value={nameValue}
                    onChange={(e: any) => setNameValue(e.target.value)}
                  />
                  {state.inputNameErrorFlag && (
                    <div className={style.errorLabelNew}>
                      {intl.formatMessage({
                        id: "store/newsletter-popup-custom.errorName",
                      })}
                    </div>
                  )}
                </div>
              ) : null}
              {surname ? (
                <div
                  className={
                    state.inputSurnameErrorFlag
                      ? style.fieldContainerErrorNew
                      : style.fieldContainerNew
                  }
                >
                  <Input
                    // label={intl.formatMessage({
                    //   id: "store/newsletter-popup-custom.surnameLabelRequred",
                    // })}
                    placeholder={surnamePlaceholder}
                    value={surnameValue}
                    onChange={(e: any) => setSurnameValue(e.target.value)}
                  />
                  {state.inputSurnameErrorFlag && (
                    <div className={style.errorLabelNew}>
                      {intl.formatMessage({
                        id: "store/newsletter-popup-custom.errorSurname",
                      })}
                    </div>
                  )}
                </div>
              ) : null}
              <div className={style.informativaNew}>
                <p className={style.privacy}>
                  {intl.formatMessage({
                    id: "store/newsletter-popup-custom.mandatoryCheckboxTop",
                  })}
                  <span className={style.colorEdb112}>
                    <a
                      className={style.link}
                      href={linkPrivacy}
                      target="_blank"
                    >
                      {intl.formatMessage({
                        id:
                          "store/newsletter-popup-custom.mandatoryPrivacyLink",
                      })}
                    </a>
                  </span>
                  {intl.formatMessage({
                    id: "store/newsletter-popup-custom.mandatoryCheckboxDown1",
                  })}
                  <br />
                  {/* <p className="mv2">
                    {intl.formatMessage({
                      id:
                        "store/newsletter-popup-custom.mandatoryCheckboxDown2",
                    })}
                  </p> */}
                </p>
                <div className="mt3">
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
                    <div className={style.errorLabelNew}>
                      {intl.formatMessage({
                        id: "store/newsletter-popup-custom.errorCheckbox",
                      })}
                    </div>
                  )}
                  {
                    <p className="mv2 paragraph">
                      {intl.formatMessage({
                        id: "store/newsletter-popup-custom.downCheckbox",
                      })}
                    </p>
                  }
                </div>
              </div>
              <div className={style.submitContainer}>
                {!loading ? (
                  !success ? (
                    <Input
                      type="submit"
                      value={intl.formatMessage({
                        id: "store/newsletter-popup-custom.labelButton",
                      })}
                    />
                  ) : isAlreadyRegistred ? (
                    <>
                      <Input
                        type="submit"
                        value={intl.formatMessage({
                          id: "store/newsletter-popup-custom.labelButton",
                        })}
                      />
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
                    <></>
                  )
                ) : (
                  <div className={style.loaderForm}></div>
                )}
                <div className="mb3"></div>
              </div>
              <p className={style.downTextPopFormNew}>
                <RichText text={promotionText ? promotionText : ""} />
              </p>
            </form>
          </div>
        </div>
      </>
    );
  };
  return generateForm();
};

export default PopupForm;
