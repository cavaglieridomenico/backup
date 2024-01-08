import React, { useEffect, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
import { Checkbox, Input } from "vtex.styleguide";
import { useLogin } from "../context/LoginContext";
import style from "../style.css";
import { infoToopltip } from "../utils/vectors";
import signUpFormValidation from "../validations/signUpFormValidation";

interface RegistrationFormProps {
  optinLink: string;
  isExternalLink: boolean;
  setIsRegistrationModalOpen: any;
  tooltipModalImage: string;
  companyPassword?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isExternalLink, setIsRegistrationModalOpen }) => {
  /*--- INTL ---*/
  const intl = useIntl();
  const { push } = usePixel();

  const {
    signUpFormValues,
    handleChangeInputSignUp,
    signupFormFetch,
    errorMessages,
    signUpFetchResponse,
    isSignUpSubmitting,
    setIsSignUpSubmitting,
    signUpResponse,
    handleChangeOptinCheckboxSignUp,
    isEPP,
    isFF,
    payloadResponse,
  } = useLogin();

  const [errors, setErrors]: any = useState({});
  const [isTooltipModalOpen, setIsTooltipModalOpen] = useState(false);

  /*---ERRORS RESET ---*/
  const resetInput = (value: string) => {
    errors[value] && delete errors[value], setErrors({ ...errors });
  };

  /*--- FORM SUBMITTING ---*/
  const handleSubmitSignUp = (e: any) => {
    e.preventDefault();
    setErrors(signUpFormValidation(signUpFormValues, errorMessages, isEPP));
    setIsSignUpSubmitting(true);
  };

  // GA4FUNREQ58
  const sendCustomErrors = () => {
    if (!(Object.keys(errors).length === 0 && errors.constructor === Object) && isSignUpSubmitting) {
      let errArray = Object.keys(errors);
      errArray.map((key) => {
        push({
          event: "ga4-custom_error",
          type: "error message",
          description: `${key}: ${errors[key]}`,
        });
      });
    }
  };
  // CHECK ALSO UNDEFINED AS STRING BECAUSE SOMETIMES IT ARRIVES LIKE THAT
  const isGuestAlreadyLogged = window?.sessionStorage?.getItem("sid") && window?.sessionStorage?.getItem("sid") !== "undefined";

  useEffect(() => {
    if (isSignUpSubmitting) {
      sendCustomErrors();
    }
  }, [isSignUpSubmitting]);

  useEffect(() => {
    if (Object.keys(errors).length == 0 && isSignUpSubmitting) {
      signupFormFetch();
    } else if (isSignUpSubmitting && Object.keys(errors).length != 0) {
      Object.entries(errors).forEach((error: any) => {
        push({ event: "errorMessage", data: error[1] });
      });
      setIsSignUpSubmitting(false);
    }
  }, [errors, isSignUpSubmitting]);

  useEffect(() => {
    if (!signUpFetchResponse) {
      push({
        event: "errorMessage",
        data:
          signUpResponse == "409"
            ? intl.formatMessage({
                id: "store/custom-login.signup-form.error-emailUsed",
              })
            : signUpResponse == "403"
            ? intl.formatMessage({
                id: "store/custom-login.signup-form.error-invitationExpired",
              })
            : intl.formatMessage({
                id: "store/custom-login.signup-form.error-fetch",
              }),
      });
    }
  }, [signUpFetchResponse]);

  //Tooltip Icon
  const tooltipIcon = Buffer.from(infoToopltip).toString("base64");

  return (
    <div className={style.registrationFormContainer}>
      <div className={style.registrationFormWrapper}>
        {/* <div
          className={style.backToLoginContainer}
          onClick={() => setRoute(Routes.LOGIN)}
        >
          <IconArrowBack />
          <span
            className={`${style.forgotPasswordRouteRouteText} ${style.backToLoginText}`}
          >
            {intl.formatMessage({id: "store/custom-login.signup-form.backToLogin"})}
          </span>
        </div> */}
        <div className={style.registrationModalTitleContainer}>
          <h2 className={style.registrationModalTitle}>
            {intl.formatMessage({
              id: "store/custom-login.signup-form.registrationModalTitle",
            })}
          </h2>
          <span className={style.registrationModalSubTitle}>
            {intl.formatMessage({
              id: "store/custom-login.signup-form.registrationModalSubTitle",
            })}
          </span>
        </div>
        <form onSubmit={(e: any) => handleSubmitSignUp(e)}>
          <div className={style.inputDiv}>
            <Input
              label={intl.formatMessage({
                id: "store/custom-login.signup-form.name-label",
              })}
              name="name"
              value={signUpFormValues?.name}
              error={errors?.name}
              errorMessage={errors?.name}
              placeholder={intl.formatMessage({
                id: "store/custom-login.login-form.submit-form.placeholder.name",
              })}
              onChange={(e: any) => {
                handleChangeInputSignUp(e);
                resetInput("name");
              }}
            />
          </div>
          <div className={style.inputDiv}>
            <Input
              label={intl.formatMessage({
                id: "store/custom-login.signup-form.surname-label",
              })}
              name="surname"
              value={signUpFormValues?.surname}
              error={errors?.surname}
              errorMessage={errors?.surname}
              placeholder={intl.formatMessage({
                id: "store/custom-login.login-form.submit-form.placeholder.surname",
              })}
              onChange={(e: any) => {
                handleChangeInputSignUp(e);
                resetInput("surname");
              }}
            />
          </div>
          <div className={style.inputDiv}>
            <Input
              label={intl.formatMessage({
                id: "store/custom-login.signup-form.email-label",
              })}
              name="email"
              value={signUpFormValues?.email}
              error={errors?.email}
              disabled={isFF ? true : false}
              errorMessage={errors?.email}
              placeholder={intl.formatMessage({
                id: "store/custom-login.login-form.submit-form.placeholder.email",
              })}
              onChange={(e: any) => {
                handleChangeInputSignUp(e);
                resetInput("email");
              }}
            />
          </div>
          {(!isFF && !isEPP && !isGuestAlreadyLogged) ? 
            <div className={style.inputDiv}>
            <Input
              label={intl.formatMessage({
                id: "store/custom-login.signup-form.companyPassword-label",
              })}
              name="companyPassword"
              value={signUpFormValues?.companyPassword}

              //disabled={isFF ? true : false}

              placeholder={intl.formatMessage({
                id:
                  "store/custom-login.login-form.submit-form.placeholder.companyPassword",
              })}
              onChange={(e: any) => {
                handleChangeInputSignUp(e);
              }}
            />
          </div> : <div></div>
          }
          {isEPP && (
            <div className={style.inputDiv}>
              <Input
                label={
                  <div className={style.clockNumberLabelContainer}>
                    <span>{intl.formatMessage(messages.signUpFormClockNumber)}</span>
                    <div
                      className={style.tooltipContainer}
                      onClick={() => setIsTooltipModalOpen(!isTooltipModalOpen)}
                      onMouseEnter={() => {
                        setIsTooltipModalOpen(true);
                      }}
                      onMouseLeave={() => setIsTooltipModalOpen(false)}
                    >
                      <img src={`data:image/svg+xml;base64,${tooltipIcon}`} className={style.tooltipIcon} alt="tooltip-icon" />
                      {isTooltipModalOpen && (
                        <div className={style.tooltipModal}>
                          <img src="/arquivos/tooltip-registration-EPP.png" alt="tooltip-image" className={style.tooltipModalImage} />
                        </div>
                      )}
                    </div>
                  </div>
                }
                name="id"
                // value={signUpFormValues?.id}
                error={errors?.id}
                errorMessage={errors?.id}
                placeholder={intl.formatMessage(messages.signUpFormPlaceholderClockNumber)}
                onChange={(e: any) => {
                  handleChangeInputSignUp(e);
                  resetInput("id");
                }}
              />
            </div>
          )}
          <div className={style.optinCheckboxDiv}>
            <div className={style.optinContainer}>
              <span className={style.optinLabel}>
                {intl.formatMessage({
                  id: "store/custom-login.signup-form.optin-title-1",
                })}
              </span>
              <a href="/pages/informativa-sulla-privacy" className={style.optinLabelLink} target={isExternalLink ? "_blank" : undefined}>
                {intl.formatMessage({
                  id: "store/custom-login.signup-form.optin-link",
                })}
              </a>
              <span className={style.optinLabel}>
                {intl.formatMessage({
                  id: "store/custom-login.signup-form.optin-title-2",
                })}
              </span>
            </div>
            <Checkbox
              onChange={() => handleChangeOptinCheckboxSignUp()}
              checked={signUpFormValues.optin}
              label={intl.formatMessage({
                id: "store/custom-login.signup-form.optin-checkbox-label",
              })}
            />
          </div>
          {!signUpFetchResponse && (
            <div className={style.loginErrorContainer}>
              <span className={style.loginFormFetchError}>
                {signUpResponse == "409"
                  ? intl.formatMessage({
                      id: "store/custom-login.signup-form.error-emailUsed",
                    })
                  : signUpResponse == "403"
                  ? payloadResponse === "Incorrect employee code" || payloadResponse === "Incorrect surname"
                    ? intl.formatMessage({
                        id: "store/custom-login.signup-form.error-personalDataOrEmployeeCodeWrong",
                      })
                    : payloadResponse === "No VIP Company correctly registered with this accessCode"
                    ? intl.formatMessage({
                        id: "store/custom-login.signup-form.error-VIPaccessCode",
                      })
                    : payloadResponse === "VIP Company Password is wrong or password not present"
                      ? intl.formatMessage({
                        id: 
                          "store/custom-login.signup-form.error-companyPasswordCodeWrong",
                      }) : intl.formatMessage({
                        id:
                          "store/custom-login.signup-form.error-invitationExpired",
                      })
                  : intl.formatMessage({
                      id: "store/custom-login.signup-form.error-fetch",
                    })}
              </span>
            </div>
          )}

          {isSignUpSubmitting ? (
            <div className={style.loaderFormContainer}>
              <div className={style.loaderForm}></div>
            </div>
          ) : (
            <div className={style.sumbitRegistrationButtonContainer}>
              <button className={`${style.submitButton} ${style.submitRegistrationButton}`} type="submit">
                {intl.formatMessage({
                  id: "store/custom-login.login-form.submit-registration-button",
                })}
              </button>
              <button className={`${style.submitButton} ${style.backToLoginButton}`} onClick={() => setIsRegistrationModalOpen(false)}>
                {intl.formatMessage({
                  id: "store/custom-login.signup-form.alreadyHaveAnAccount",
                })}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;

const messages = defineMessages({
  registrationModalTitle: {
    defaultMessage: "Créer un compte",
    id: "store/custom-login.signup-form.registrationModalTitle",
  },
  registrationModalSubTitle: {
    defaultMessage:
      "Depuis le 24 mars 2022, notre site fait peau neuve ! Pour accéder à cette nouvelle version, vous devez impérativement recréer votre compte.",
    id: "store/custom-login.signup-form.registrationModalSubTitle",
  },
  alreadyHaveAnAccount: {
    defaultMessage: "J’ai déjà recréé mon compte, me connecter",
    id: "store/custom-login.signup-form.alreadyHaveAnAccount",
  },
  backToLogin: {
    defaultMessage: "Back",
    id: "store/custom-login.signup-form.backToLogin",
  },
  signUpFormName: {
    defaultMessage: "Name*",
    id: "store/custom-login.signup-form.name-label",
  },
  signUpFormSurname: {
    defaultMessage: "Surname*",
    id: "store/custom-login.signup-form.surname-label",
  },
  signUpFormEmail: {
    defaultMessage: "Email*",
    id: "store/custom-login.signup-form.email-label",
  },
  signUpFormAccessCode: {
    defaultMessage: "Access code*",
    id: "store/custom-login.signup-form.accessCode-label",
  },
  signUpAlreadyUsedEmail: {
    defaultMessage: "Email already used",
    id: "store/custom-login.signup-form.error-emailUsed",
  },
  signUpInvitationExpired: {
    defaultMessage: "Invitation Expired",
    id: "store/custom-login.signup-form.error-invitationExpired",
  },
  VIPinvalidAccessCode: {
    defaultMessage: "Access Denied",
    id: "store/custom-login.signup-form.error-VIPaccessCode",
  },
  signUpError: {
    defaultMessage: "Something went wrong, please try again",
    id: "store/custom-login.signup-form.error-fetch",
  },
  optinLabelTitle1: {
    defaultMessage: "I understand the content of ",
    id: "store/custom-login.signup-form.optin-title-1",
  },
  optinLabelLinkText: {
    defaultMessage: "Personal data protection policy",
    id: "store/custom-login.signup-form.optin-link",
  },
  optinLabelTitle2: {
    defaultMessage: " and:",
    id: "store/custom-login.signup-form.optin-title-2",
  },
  optinCheckboxLabel: {
    defaultMessage:
      "I agree to receive personalized communications and offers from Whirlpool and other Whirlpool Corporation brands, as well as 10% off one of my future purchases. Discount usable within 12 months",
    id: "store/custom-login.signup-form.optin-checkbox-label",
  },
  submitRegistrationButtonText: {
    defaultMessage: "Create my account",
    id: "store/custom-login.login-form.submit-registration-button",
  },
  signUpFormNamePlaceholder: {
    defaultMessage: "Insert your name",
    id: "store/custom-login.login-form.submit-form.placeholder.name",
  },
  signUpFormSurnamePlaceholder: {
    defaultMessage: "Insert your surname",
    id: "store/custom-login.login-form.submit-form.placeholder.surname",
  },
  signUpFormEmailPlaceholder: {
    defaultMessage: "name.firstname@example.com",
    id: "store/custom-login.login-form.submit-form.placeholder.email",
  },
  signUpFormAccessCodePlaceholder: {
    defaultMessage: "Insert your access code",
    id: "store/custom-login.login-form.submit-form.placeholder.accessCode",
  },
  signUpFormcompanyPasswordPlaceholder: {
    defaultMessage: "Insert your access company password",
    id: "store/custom-login.login-form.submit-form.placeholder.companyPassword",
  },
  signUpFormClockNumber: {
    defaultMessage: "Clock number*",
    id: "store/custom-login.signup-form.clockNumber-label",
  },
  signUpFormPlaceholderClockNumber: {
    defaultMessage: "Employee clock number",
    id: "store/custom-login.login-form.submit-form.placeholder.clockNumber",
  },
});
