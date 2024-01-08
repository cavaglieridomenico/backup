import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
import { Input, InputPassword, Modal } from "vtex.styleguide";
import { Routes, useLogin } from "../context/LoginContext";
import style from "../style.css";
import loginFormValidation from "../validations/loginFormValidation";
import RegistrationForm from "./RegistrationForm";
import ValidationTootltip from "./ValidationTootltip";

interface LoginFormProps {
  optinLink: string;
  isExternalLink: boolean;
  tooltipModalImage: string;
}

interface WindowGTM extends Window {
  dataLayer: any[];
}

const LoginForm: React.FC<LoginFormProps> = ({
  optinLink,
  isExternalLink,
  tooltipModalImage,
}) => {
  /*--- INTL ---*/
  const intl = useIntl();
  const { push } = usePixel();

  const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];

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
      loginFormValidation(loginFormValues, errorMessages, {
        upperCaseRegex,
        lowerCaseRegex,
        numberRegex,
      })
    );
    setIsSubmitting(true);
  };

  // GA4FUNREQ60
  const sendPopupAnalytics = (close: boolean) => {
    if (close) {
      push({
        event: "popup",
        action: "close",
        popupId: "registration-popup",
      });
    } else {
      push({
        event: "popup",
        action: "click",
        popupId: "registration-popup",
      });
      push({
        event: "popup",
        action: "view",
        popupId: "registration-popup",
      });
    }
  };

  // GA4FUNREQ58
  const sendCustomErrors = () => {
    if (
      !(Object.keys(errors).length === 0 && errors.constructor === Object) &&
      isSubmitting
    ) {
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

  useEffect(() => {
    if (Object.keys(errors).length == 0 && isSubmitting) {
      loginFormFetch();
    } else if (isSubmitting && Object.keys(errors).length != 0) {
      Object.entries(errors).forEach((error: any) => {
        push({ event: "errorMessage", data: error[1] });
      });
      dataLayer.push({
        event: "personalArea",
        eventCategory: "Personal Area",
        eventAction: "Login",
        eventLabel: "Login: ko",
      });
      setIsSubmitting(false);
    }
  }, [errors, isSubmitting]);

  useEffect(() => {
    if (!loginFetchResponse) {
      push({
        event: "errorMessage",
        data: intl.formatMessage({
          id: "store/custom-login.login-form.error-fetch",
        }),
      });
    }
  }, [loginFetchResponse]);

  useEffect(() => {
    if (isSubmitting) {
      sendCustomErrors();
    }
  }, [isSubmitting]);

  return (
    <>
      <Modal
        centered
        closeOnEsc={false}
        closeOnOverlayClick={false}
        showCloseIcon={true}
        isOpen={isRegistrationModalOpen}
        showTopBar={false}
        onClose={() => {
          setIsRegistrationModalOpen(false);
          sendPopupAnalytics(true);
        }}
      >
        <RegistrationForm
          optinLink={optinLink}
          isExternalLink={isExternalLink}
          setIsRegistrationModalOpen={setIsRegistrationModalOpen}
          tooltipModalImage={tooltipModalImage}
        />
      </Modal>
      <div className={style.loginFormContainer}>
        <div className={style.loginFormWrapper}>
          <span className={style.loginFormTitle}>
            {intl.formatMessage({ id: "store/custom-login.login-form.title" })}
          </span>
          <form className={style.loginForm} onSubmit={(e: any) => handleSubmitLogin(e)}>
            <div className={style.inputDiv}>
              <Input
                label={intl.formatMessage({
                  id: "store/custom-login.login-form.email-label",
                })}
                name="email"
                value={loginFormValues?.email}
                error={errors?.email}
                errorMessage={errors?.email}
                placeholder={intl.formatMessage({
                  id:
                    "store/custom-login.login-form.login-form.placeholder.email",
                })}
                onChange={(e: any) => {
                  handleChangeInputLogin(e);
                  resetInput("email");
                }}
              />
            </div>
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
                dataLayer.push({
                  event: "forgot_password",
                });
              }}
            >
              <span className={style.forgotPasswordRouteRouteText}>
                {intl.formatMessage({
                  id: "store/custom-login.login-form.forgotPassword-route.text",
                })}
              </span>
            </div>
            {!loginFetchResponse && (
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
          <div className={style.registrationRouteContainer}>
            {/* <span className={style.registrationRouteText}>
              {intl.formatMessage({id: "store/custom-login.login-form.registration-route.title"})}
            </span> */}
            <button
              className={style.registrationRouteButton}
              onClick={() => {
                setIsRegistrationModalOpen(true);
                sendPopupAnalytics(false);
              }}
            >
              {intl.formatMessage({
                id: "store/custom-login.login-form.registration-route.button",
              })}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
