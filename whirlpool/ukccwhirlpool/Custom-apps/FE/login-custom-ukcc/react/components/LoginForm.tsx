import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
import { Input, InputPassword, Modal } from "vtex.styleguide";
import { index as RichText } from "vtex.rich-text";
import { Routes, useLogin } from "../context/LoginContext";
import style from "../style.css";
import loginFormValidation from "../validations/loginFormValidation";
import RegistrationForm from "./RegistrationForm";
import errorIcon from "../../icons/error-icon.png";
import ValidationTootltip from "./ValidationTootltip";

interface LoginFormProps {
  optinLink: string;
  isExternalLink: boolean;
  isVIP: boolean;
  isAuth: boolean;
  tooltipModalImage: string;
  tooltipModalText: string;
  formTitle?: string;
  formSubtitle?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
}


const LoginForm: StorefrontFunctionComponent<LoginFormProps> = ({
  optinLink,
  isExternalLink,
  isVIP,
  isAuth,
  tooltipModalImage,
  tooltipModalText,
  formTitle,
  formSubtitle,
  emailLabel,
  emailPlaceholder,
}) => {
  /*--- INTL ---*/
  const intl = useIntl();
  const { push } = usePixel();


  // const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [errors, setErrors]: any = useState({});
  const [isTooltipVisible, setTootltipVisible] = useState(false);
  const {
    loginFormValues,
    handleChangeInputLogin,
    loginFormFetch,
    errorMessages,
    upperCaseRegex,
    lowerCaseRegex,
    numberRegex,
    loginFetchResponse,
    isSubmitting,
    setIsSubmitting,
    setRoute,
    setPrevPage,
    isRegistrationModalOpen,
    setIsRegistrationModalOpen,
  } = useLogin();

  /*---ERRORS RESET ---*/
  const resetInput = (value: string) => {
    errors[value] && delete errors[value], setErrors({ ...errors });
  };

  /*--- FORM SUBMITTING ---*/
  const handleSubmitLogin = (e: any) => {
    e.preventDefault();
    setErrors(
      loginFormValidation(
        loginFormValues,
        errorMessages,
        {
          upperCaseRegex,
          lowerCaseRegex,
          numberRegex,
        },
        isVIP,
        isAuth
      )
    );
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length == 0 && isSubmitting) {
      loginFormFetch(isAuth);
    } else if (isSubmitting && Object.keys(errors).length != 0) {
      Object.entries(errors).forEach((error: any) => {
        push({
          event: "ga4-custom_error",
          type: "error message",
          description: error[1],
        });
      });
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting]);

  useEffect(() => {
    if (!loginFetchResponse) {
      push({
        event: "ga4-custom_error",
        type: "error message",
        description: intl.formatMessage({
          id: "store/custom-login.login-form.error-fetch",
        }),
      });
    }
  }, [loginFetchResponse]);

  //GA4FUNREQ60
  const handlePopupEvent = (type: string) => {
    push({ event: "popup", popupId: "newsletter-popup", action: type });
  };

  useEffect(() => {
    if (isRegistrationModalOpen) {
      handlePopupEvent("view");
    }
  }, [isRegistrationModalOpen]);
  function emailErrorMessage() {
    if (isVIP && !isAuth) {
      return errors?.email ? (
        <>
          <img src={errorIcon}className={style.errorIcon} /> {errors?.email}
          {errors.email.includes("registered") && (
            <>
              <span className={style.errorText}> Please contact us using the &nbsp;</span>
              <a href="/support-form" className={style.link}> support form</a>
            </>
          )}
        </>
      ) : "";
    } else {
      return errors?.email;
    }
  }
  return (
    <>
      <div onClick={() => handlePopupEvent("click")}>
        <Modal
          centered
          closeOnEsc={false}
          closeOnOverlayClick={false}
          showCloseIcon={true}
          isOpen={isRegistrationModalOpen}
          showTopBar={false}
          onClose={() => {
            setIsRegistrationModalOpen(false),
              setTimeout(() => {
                handlePopupEvent("close");
              }, 200);
          }}
        >
          <RegistrationForm
            optinLink={optinLink}
            isExternalLink={isExternalLink}
            setIsRegistrationModalOpen={setIsRegistrationModalOpen}
            tooltipModalImage={tooltipModalImage}
            tooltipModalText={tooltipModalText}
          />
        </Modal>
      </div>
      <div className={style.loginFormContainer}>
        <div
          className={`${style.loginFormWrapper} ${isVIP &&
            !isAuth &&
            style.loginFormWrapperVIP}`}
        >
          <span
            className={`${style.loginFormTitle} ${isVIP &&
              !isAuth &&
              style.loginFormTitleVIP}`}
          >
            {formTitle
              ? formTitle
              : intl.formatMessage({
                  id: "store/custom-login.login-form.title",
                })}
          </span>
          <form
            className={style.loginForm}
            onSubmit={(e: any) => handleSubmitLogin(e)}
          >
            <div className={style.inputDiv}>
              <Input
                label={
                  emailLabel
                    ? emailLabel
                    : intl.formatMessage({
                        id: "store/custom-login.login-form.email-label",
                      })
                }
                name="email"
                value={loginFormValues?.email}
                error={errors?.email}
                errorMessage={emailErrorMessage()}
                placeholder={
                  emailPlaceholder
                    ? emailPlaceholder
                    : intl.formatMessage({
                        id:
                          "store/custom-login.login-form.login-form.placeholder.email",
                      })
                }
                onChange={(e: any) => {
                  handleChangeInputLogin(e);
                  resetInput("email");
                }}
              />
              {!loginFetchResponse && (isVIP && !isAuth) && (
                <div>
                  <span className={style.loginFormFetchError}>
                  <img src={errorIcon}className={style.errorIcon} /> 
                    {intl.formatMessage({
                      id: "store/custom-login.login-form.error-fetch",
                    })}
                    <span className={style.errorText}> Please contact us using the &nbsp;</span>
                    <a href="/support-form" className={style.link}>support form</a>
                  </span>
                </div>
              )}
            </div>
            {isVIP && !isAuth && (
              <RichText
                className={style.guestInformationsText}
                text={
                  formSubtitle
                    ? formSubtitle
                    : intl.formatMessage({
                        id: "store/custom-login.login-form.email-text",
                      })
                }
              />
            )}
            {((!isVIP && !isAuth) || isAuth) && (
              <>
                <div className={`${style.passwordInput} ${style.inputDiv}`}>
                  <InputPassword
                    label={intl.formatMessage({
                      id: "store/custom-login.login-form.password-label",
                    })}
                    name="password"
                    value={loginFormValues?.password}
                    error={errors?.password}
                    errorMessage={errors?.password}
                    placeholder={intl.formatMessage({
                      id:
                        "store/custom-login.login-form.login-form.placeholder.password",
                    })}
                    onChange={(e: any) => {
                      handleChangeInputLogin(e);
                      resetInput("password");
                    }}
                    onFocus={() => setTootltipVisible(true)}
                    onBlur={() => setTootltipVisible(false)}
                  />
                  {isTooltipVisible && (
                    <ValidationTootltip values={loginFormValues} />
                  )}
                </div>
                <div
                  className={style.forgotPasswordRouteContainer}
                  onClick={() => {
                    setRoute(Routes.FORGOT), setPrevPage(Routes.LOGIN);
                  }}
                >
                  <span className={style.forgotPasswordRouteRouteText}>
                    {intl.formatMessage({
                      id:
                        "store/custom-login.login-form.forgotPassword-route.text",
                    })}
                  </span>
                </div>
              </>
            )}

            {!loginFetchResponse && ((!isVIP && !isAuth) || isAuth) && (
              <div className={style.loginErrorContainer}>
                <span className={style.loginFormFetchError}>
                  {intl.formatMessage({
                    id: "store/custom-login.login-form.error-fetch",
                  })}
                </span>
              </div>
            )}
            {isSubmitting ? (
              <div className={style.loaderFormContainer}>
                <div className={style.loaderForm}></div>
              </div>
            ) : (
              <div className={style.sumbitButtonContainer}>
                <button className={style.submitButton} type="submit">
                  {intl.formatMessage({
                    id: "store/custom-login.login-form.submit-button",
                  })}
                </button>
              </div>
            )}
          </form>
          {((!isVIP && !isAuth) || isAuth) && (
            <div className={style.registrationRouteContainer}>
              <span className={style.registrationRouteText}>
                {intl.formatMessage({
                  id: "store/custom-login.login-form.registration-route.title",
                })}
              </span>
              <button
                className={style.registrationRouteButton}
                onClick={() => setIsRegistrationModalOpen(true)}
              >
                {intl.formatMessage({
                  id: "store/custom-login.login-form.registration-route.button",
                })}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

LoginForm.schema = {
  title: "Login Form",
  description: "Login form labels",
  type: "object",
  properties: {
    formTitle: {
      title: "Title form",
      type: "string",
      description: "Title form",
      default: "Sign-in with your email",
    },
    emailLabel: {
      title: "Email input label",
      type: "string",
      description: "email input label",
      default: "",
    },
    emailPlaceholder: {
      title: "email input placeholder",
      type: "string",
      description: "email input placeholder",
      default: "",
    },
    formSubtitle: {
      title: "Subtitle form",
      type: "string",
      description: "Subtitle form",
      default:
        "Please use the email registered on the previous Privilege club or the email used on your last purchase on this website. If you’re unsure about it: contact us",
    },
    formError: {
      title: "Form fetch error",
      type: "string",
      description: "Form fetch error",
      default: "",
    },
  },
};

export default LoginForm;
