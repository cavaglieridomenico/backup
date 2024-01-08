import React, { useState, useEffect } from "react";
import { useLogin } from "../context/LoginContext";
import style from "../style.css";
import { Input, InputPassword } from "vtex.styleguide";
import { useIntl, defineMessages } from "react-intl";
import loginFormValidation from "../validations/loginFormValidation";
import ValidationTootltip from "./ValidationTootltip";
import { Routes } from "../context/LoginContext";
import { usePixel } from "vtex.pixel-manager";
interface WindowGTM extends Window {
  dataLayer: any[];
}

const LoginForm: React.FC = () => {
  /*--- INTL ---*/
  const intl = useIntl();
  const { push } = usePixel();

  const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];

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

  useEffect(() => {
    if (Object.keys(errors).length == 0 && isSubmitting) {
      loginFormFetch();
    } else if (isSubmitting && Object.keys(errors).length != 0) {
      Object.entries(errors).forEach((error: any) => {
        push({ event: "errorMessage", data: error[1] });

        //GA4FUNREQ58
        push({
          event: "ga4-custom_error",
          type: "error message",
          description: `${error[0]}: ${error[1]}`,
        });
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
      const errorMessage = intl.formatMessage(messages.loginFormErrorfetch);
      push({
        event: "errorMessage",
        data: errorMessage,
      });

      //GA4FUNREQ58
      push({
        event: "ga4-custom_error",
        type: "error message",
        description: errorMessage,
      });
    }
  }, [loginFetchResponse]);

  return (
    <>
      <div className={style.loginFormContainer}>
        <div className={style.loginFormWrapper}>
          <span className={style.loginFormTitle}>
            {intl.formatMessage(messages.loginFormTitle)}
          </span>
          <form onSubmit={(e: any) => handleSubmitLogin(e)}>
            <div className={style.inputDiv}>
              <Input
                label={intl.formatMessage(messages.loginFormEmail)}
                name="email"
                value={loginFormValues?.email}
                error={errors?.email}
                errorMessage={errors?.email}
                placeholder={intl.formatMessage(
                  messages.loginFormEmailPlaceholder
                )}
                onChange={(e: any) => {
                  handleChangeInputLogin(e);
                  resetInput("email");
                }}
              />
            </div>
            <div className={`${style.passwordInput} ${style.inputDiv}`}>
              <InputPassword
                label={intl.formatMessage(messages.loginFormPassword)}
                name="password"
                value={loginFormValues?.password}
                error={errors?.password}
                errorMessage={errors?.password}
                placeholder={intl.formatMessage(
                  messages.loginFormPasswordPlaceholder
                )}
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
                // GA4FUNREQ-CC-05 push forgot_password event
                push({
                  event: "forgot_password",
                });
              }}
            >
              <span className={style.forgotPasswordRouteRouteText}>
                {intl.formatMessage(messages.forgotPasswordRouteText)}
              </span>
            </div>
            {!loginFetchResponse && (
              <div className={style.loginErrorContainer}>
                <span className={style.loginFormFetchError}>
                  {intl.formatMessage(messages.loginFormErrorfetch)}
                </span>
              </div>
            )}
            {isSubmitting ? (
              <div className={style.loaderFormContainer}>
                <div className={style.loaderForm}></div>
              </div>
            ) : (
              <div className={style.submitbuttonContainer}>
                <button
                  className={style.submitButton}
                  type="button"
                  onClick={() => {
                    setRoute(Routes.REGISTRATION), setPrevPage(Routes.LOGIN);
                  }}
                >
                  {intl.formatMessage(messages.linkButtonText)}
                </button>
                <button className={style.submitButton} type="submit">
                  {intl.formatMessage(messages.submitButtonText)}
                </button>
              </div>
            )}
          </form>
          <div className={style.connectionProblemContainer}>
            <span className={style.connectionProblemText}>
              Un problème de connexion ?
            </span>
            <span className={style.connectionProblemText}>
              Contactez nous :{" "}
            </span>
            <a
              href="mailto:consommateurs_VIP@whirlpool.com"
              className={style.connectionProblemLink}
            >
              consommateurs_VIP@whirlpool.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

const messages = defineMessages({
  loginFormTitle: {
    defaultMessage: "Log in with your email address and password",
    id: "store/custom-login.login-form.title",
  },
  loginFormEmail: {
    defaultMessage: "Email*",
    id: "store/custom-login.login-form.email-label",
  },
  loginFormPassword: {
    defaultMessage: "Password*",
    id: "store/custom-login.login-form.password-label",
  },
  loginFormErrorfetch: {
    defaultMessage: "Wrong username and/or password",
    id: "store/custom-login.login-form.error-fetch",
  },
  linkButtonText: {
    defaultMessage: "Créer mon compte",
    id: "store/custom-login.login-form.link-button",
  },
  submitButtonText: {
    defaultMessage: "Submit",
    id: "store/custom-login.login-form.submit-button",
  },
  registrationRouteTitleText: {
    defaultMessage: "Do not have an account yet ? Sign up",
    id: "store/custom-login.login-form.registration-route.title",
  },
  registrationRouteButtonText: {
    defaultMessage: "Create my account",
    id: "store/custom-login.login-form.registration-route.button",
  },
  forgotPasswordRouteText: {
    defaultMessage: "I forgot my password",
    id: "store/custom-login.login-form.forgotPassword-route.text",
  },
  loginFormEmailPlaceholder: {
    defaultMessage: "name.firstname@example.com",
    id: "store/custom-login.login-form.login-form.placeholder.email",
  },
  loginFormPasswordPlaceholder: {
    defaultMessage: "Insert your password",
    id: "store/custom-login.login-form.login-form.placeholder.password",
  },
});
