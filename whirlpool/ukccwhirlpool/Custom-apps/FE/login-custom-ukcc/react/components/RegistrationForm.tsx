import React, { useState, useEffect } from "react";
import style from "../style.css";
import { useLogin } from "../context/LoginContext";
import { Input, Checkbox } from "vtex.styleguide";
import { useIntl } from "react-intl";
import signUpFormValidation from "../validations/signUpFormValidation";
import { usePixel } from "vtex.pixel-manager";
import { infoToopltip } from "../utils/vectors";
import { useRuntime } from "vtex.render-runtime";
import { index as RichText } from "vtex.rich-text";

interface RegistrationFormProps {
  optinLink: string;
  isExternalLink: boolean;
  setIsRegistrationModalOpen: any;
  tooltipModalImage: string;
  tooltipModalText: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  optinLink,
  isExternalLink,
  setIsRegistrationModalOpen,
  tooltipModalImage,
  tooltipModalText,
}) => {
  /*--- INTL ---*/
  const intl = useIntl();
  const { push } = usePixel();

  const {
    signUpFormValues,
    shouldPrefillEmail,
    handleChangeInputSignUp,
    signupFormFetch,
    errorMessages,
    signUpFetchResponse,
    isSignUpSubmitting,
    setIsSignUpSubmitting,
    signUpResponse,
    handleChangeOptinCheckboxSignUp,
    isEPP,
  } = useLogin();

  const { deviceInfo } = useRuntime();
  console.log(deviceInfo, "deviceInfo");

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

  useEffect(() => {
    if (Object.keys(errors).length == 0 && isSignUpSubmitting) {
      signupFormFetch();
    } else if (isSignUpSubmitting && Object.keys(errors).length != 0) {
      Object.entries(errors).forEach((error: any) => {
        push({
          event: "ga4-custom_error",
          type: "error message",
          description: error[1],
        });
      });
      setIsSignUpSubmitting(false);
    }
  }, [errors, isSignUpSubmitting]);

  const getErrorDescription = () => {
    switch (signUpResponse.responseBody) {
      case "Incorrect surname":
        return intl.formatMessage({
          id: "store/custom-login.signup-form.error-Incorrect-surname",
        });
      case "Employee code already registered":
        return intl.formatMessage({
          id:
            "store/custom-login.signup-form.error-Employee-code-already-registered",
        });
      case "Incorrect employee code":
        return intl.formatMessage({
          id: "store/custom-login.signup-form.error-Incorrect-employee",
        });
      case "No VIP Company correctly registered with this accessCode":
        return intl.formatMessage({
          id: "store/custom-login.signup-form.error-noVipCompany",
        });
      case "FF Invitation expired":
        return intl.formatMessage({
          id: "store/custom-login.signup-form.error-invitationExpired",
        });
      default:
        return intl.formatMessage({
          id: "store/custom-login.signup-form.error-fetch",
        });
    }
  };

  /* push event errorMessage in case of errors from backend */
  useEffect(() => {
    if (!signUpFetchResponse) {
      push({
        event: "ga4-custom_error",
        type: "error message",
        description: getErrorDescription(),
      });
    }
  }, [signUpFetchResponse]);

  //Tooltip Icon
  const tooltipIcon = Buffer.from(infoToopltip).toString("base64");

  const handleMouseHover = (isHovered: boolean) => {
    if (!deviceInfo.isMobile) {
      setIsTooltipModalOpen(isHovered);
    }
  };

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
                id:
                  "store/custom-login.login-form.submit-form.placeholder.name",
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
                id:
                  "store/custom-login.login-form.submit-form.placeholder.surname",
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
              disabled={shouldPrefillEmail ? true : false}
              errorMessage={errors?.email}
              placeholder={intl.formatMessage({
                id:
                  "store/custom-login.login-form.submit-form.placeholder.email",
              })}
              onChange={(e: any) => {
                handleChangeInputSignUp(e);
                resetInput("email");
              }}
            />
          </div>
          {isEPP && (
            <div className={style.inputDiv}>
              <Input
                label={
                  <div className={style.clockNumberLabelContainer}>
                    <span>
                      {intl.formatMessage({
                        id: "store/custom-login.signup-form.clockNumber-label",
                      })}
                    </span>
                    {(tooltipModalImage || tooltipModalText) && (
                      <div
                        className={style.tooltipContainer}
                        onClick={() =>
                          setIsTooltipModalOpen(!isTooltipModalOpen)
                        }
                        onMouseEnter={() => handleMouseHover(true)}
                        onMouseLeave={() => handleMouseHover(false)}
                      >
                        <img
                          src={`data:image/svg+xml;base64,${tooltipIcon}`}
                          className={style.tooltipIcon}
                          alt="tooltip-icon"
                        />
                        {isTooltipModalOpen && (
                          <div className={style.tooltipModal}>
                            {tooltipModalText ? (
                              <span className={style.tooltipModalText}>
                                <RichText text={tooltipModalText} />
                              </span>
                            ) : (
                              <img
                                src={tooltipModalImage}
                                alt="tooltip-image"
                                className={style.tooltipModalImage}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                }
                name="id"
                value={signUpFormValues?.id}
                error={errors?.id}
                errorMessage={errors?.id}
                placeholder={intl.formatMessage({
                  id:
                    "store/custom-login.login-form.submit-form.placeholder.clockNumber",
                })}
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
              <a
                href={optinLink}
                className={style.optinLabelLink}
                target={isExternalLink ? "_blank" : undefined}
              >
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
                {getErrorDescription()}
              </span>
            </div>
          )}

          {isSignUpSubmitting ? (
            <div className={style.loaderFormContainer}>
              <div className={style.loaderForm}></div>
            </div>
          ) : (
            <div className={style.sumbitRegistrationButtonContainer}>
              <button
                className={`${style.submitButton} ${style.submitRegistrationButton}`}
                type="submit"
              >
                {intl.formatMessage({
                  id:
                    "store/custom-login.login-form.submit-registration-button",
                })}
              </button>
              <button
                className={`${style.submitButton} ${style.backToLoginButton}`}
                onClick={() => setIsRegistrationModalOpen(false)}
              >
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
