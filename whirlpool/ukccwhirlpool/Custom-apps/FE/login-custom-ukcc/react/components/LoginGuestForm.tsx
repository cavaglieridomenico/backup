import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { Input } from "vtex.styleguide";
import { Routes, useLogin } from "../context/LoginContext";
import style from "../style.css";
import { index as RichText } from "vtex.rich-text";
import errorIcon from "../../icons/error-icon.png";

interface LoginGuestFormProps {
  isVIP: boolean;
  guestFormTitle?: string;
  companyPasswordLabel?: string;
  companyPasswordPlaceholder?: string;
  guestFormSubtitle?: string;
  guestCtaLabel?: string;
  guestFormError?: string;
}

const LoginGuestForm: StorefrontFunctionComponent<LoginGuestFormProps> = ({isVIP, guestFormTitle, companyPasswordLabel, companyPasswordPlaceholder, guestFormSubtitle, guestCtaLabel, guestFormError}) => {
  /*--- INTL ---*/
  const intl = useIntl();
  const {
    loginGuestFormValues,
    handleChangeInputGuestLogin,
    loginGuestFetchResponse,
    isGuestSubmitting,
    setIsGuestSubmitting,
    fetchResolver,
    route
  } = useLogin();

  /*--- FORM SUBMITTING ---*/
  const handleSubmitLogin = (e: any) => {
    e.preventDefault();
    setIsGuestSubmitting(true);
  };

  useEffect(() => {
    if (isGuestSubmitting) {
      fetchResolver();
    }
  }, [isGuestSubmitting]);

  if (route == Routes.VALIDATION || route == Routes.FORGOT) return null;

  function guestError() {
    return (
      <>
        <img src={errorIcon} className={style.errorIcon} /> 
        {guestFormError
          ? guestFormError
          : intl.formatMessage({
              id: "store/custom-login.login-Guestform.error-fetch",
            })}
      </>
    ); 
  }
  return (
    <>
      <div className={style.secondFormLogin}>
        <div className={style.loginFormContainer}>
          <div
            className={`${style.loginFormWrapper} ${isVIP &&
              style.loginFormWrapperVIP}`}
          >
            <span
              className={`${style.loginFormTitle} ${isVIP &&
                style.loginFormTitleVIP}`}
            >
              {guestFormTitle
                ? guestFormTitle
                : intl.formatMessage({
                    id: "store/custom-login.login-form.titleGuest",
                  })}
            </span>
            <form
              className={style.loginForm}
              onSubmit={(e: any) => handleSubmitLogin(e)}
            >
              <div className={`${style.passwordInput} ${style.inputDiv}`}>
                <Input
                  label={
                    companyPasswordLabel
                      ? companyPasswordLabel
                      : intl.formatMessage({
                          id:
                            "store/custom-login.login-form.companyPassword-label",
                        })
                  }
                  name="companyPassword"
                  value={loginGuestFormValues?.companyPassword}
                  placeholder={
                    companyPasswordPlaceholder
                      ? companyPasswordPlaceholder
                      : intl.formatMessage({
                          id:
                            "store/custom-login.login-form.login-form.placeholder.companyPassword",
                        })
                  }
                  onChange={(e: any) => {
                    handleChangeInputGuestLogin(e);
                  }}
                />
                {loginGuestFetchResponse === false && (
                  <span className={style.loginFormFetchError}>
                    {guestError()}
                  </span>
                )}
                <span className={style.guestInformationsText}>
                  {guestFormSubtitle ? (
                    <RichText text={guestFormSubtitle}></RichText>
                  ) : (
                    intl.formatMessage({
                      id: "store/custom-login.login-form.companyPassword-text",
                    })
                  )}
                </span>
              </div>
              {isGuestSubmitting ? (
                <div className={style.loaderFormContainer}>
                  <div className={style.loaderForm}></div>
                </div>
              ) : (
                <div className={style.sumbitButtonContainer}>
                  <button className={style.submitButton} type="submit">
                    {guestCtaLabel
                      ? guestCtaLabel
                      : intl.formatMessage({
                          id:
                            "store/custom-login.login-form.submit-guestButton",
                        })}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

LoginGuestForm.schema = {
  title: "Login Guest Form",
  description: "Login guest form labels",
  type: "object",
  properties: {
    guestFormTitle: {
      title: "Title guest form",
      type: "string",
      description: "Title guest form",
      default: "Effettua l'accesso utilizzando il tuo access code",
    },
    companyPasswordLabel: {
      title: "Company password input label",
      type: "string",
      description: "Company password input label",
      default: "",
    },
    companyPasswordPlaceholder: {
      title: "Company password input placeholder",
      type: "string",
      description: "Company password input placeholder",
      default: "",
    },
    guestFormSubtitle: {
      title: "Subtitle guest form",
      type: "string",
      description: "Subtitle guest form",
      default: "",
    },
    guestCtaLabel: {
      title: "Guest form CTA label",
      type: "string",
      description: "Guest form CTA label",
      default: "",
    },
    guestFormError: {
      title: "Guest form fetch error",
      type: "string",
      description: "Guest form fetch error",
      default: "",
    },
  },
};

export default LoginGuestForm;