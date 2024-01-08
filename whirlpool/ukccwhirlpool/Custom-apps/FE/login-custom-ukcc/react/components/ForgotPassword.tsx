import React, { useEffect, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
import { IconArrowBack } from "vtex.store-icons";
import { Input } from "vtex.styleguide";
import { Routes, useLogin } from "../context/LoginContext";
import style from "../style.css";
import forgotFormValidation from "../validations/forgotFormValidation";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
  /*--- INTL ---*/
  const intl = useIntl();
  const { push } = usePixel();

  const {
    setRoute,
    forgotFormValues,
    errorMessages,
    forgotFetchResponse,
    isForgotSubmitting,
    setIsForgotSubmitting,
    forgotResponse,
    handleChangeInputForgot,
    forgotFormFetch,
  } = useLogin();
  const [errors, setErrors]: any = useState({});

  /*---ERRORS RESET ---*/
  const resetInput = (value: string) => {
    errors[value] && delete errors[value], setErrors({ ...errors });
  };

  /*--- FORM SUBMITTING ---*/
  const handleSubmitForgot = (e: any) => {
    e.preventDefault();
    setErrors(forgotFormValidation(forgotFormValues, errorMessages));
    setIsForgotSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length == 0 && isForgotSubmitting) {
      forgotFormFetch();
    } else if (isForgotSubmitting && Object.keys(errors).length != 0) {
      Object.entries(errors).forEach((error: any) => {
        push({
          event: "ga4-custom_error",
          type: "error message",
          description: error[1],
        });
      });
      setIsForgotSubmitting(false);
    }
  }, [errors, isForgotSubmitting]);

  useEffect(() => {
    if (!forgotFetchResponse) {
      push({
        event: "ga4-custom_error",
        type: "error message",
        description:
          forgotResponse == "404"
            ? intl.formatMessage(messages.emailNotFound)
            : intl.formatMessage(messages.forgotError),
      });
    }
  }, [forgotFetchResponse]);

  return (
    <div className={style.loginFormContainer}>
      <div className={style.loginFormWrapper}>
        <div
          className={style.backToLoginContainer}
          onClick={() => setRoute(Routes.LOGIN)}
        >
          <IconArrowBack />
          <span
            className={`${style.forgotPasswordRouteRouteText} ${style.backToLoginText}`}
          >
            {intl.formatMessage(messages.backToLogin)}
          </span>
        </div>
        <div className={style.setPasswordTitleContainer}>
          <span
            className={`${style.setPasswordTitleText} ${style.setPasswordTitleTextTop}`}
          >
            {intl.formatMessage(messages.forgotPasswordTitle)}
          </span>
        </div>
        <form className={style.forgotPasswordForm} onSubmit={(e: any) => handleSubmitForgot(e)}>
          <div className={style.inputDiv}>
            <Input
              label={intl.formatMessage(messages.emailLabel)}
              name="email"
              value={forgotFormValues?.email}
              error={errors?.email}
              errorMessage={errors?.email}
              placeholder={intl.formatMessage(
                messages.forgotFormEmailPlaceholder
              )}
              onChange={(e: any) => {
                handleChangeInputForgot(e);
                resetInput("email");
              }}
            />
          </div>
          {!forgotFetchResponse && (
            <div className={style.loginErrorContainer}>
              <span className={style.loginFormFetchError}>
                {forgotResponse == "404"
                  ? intl.formatMessage(messages.emailNotFound)
                  : intl.formatMessage(messages.forgotError)}
              </span>
            </div>
          )}
          {isForgotSubmitting ? (
            <div className={style.loaderFormContainer}>
              <div className={style.loaderForm}></div>
            </div>
          ) : (
            <div className={style.sumbitButtonContainer}>
              <button className={style.submitButton} type="submit">
                {intl.formatMessage(messages.forgotFormButtonText)}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

const messages = defineMessages({
  backToLogin: {
    defaultMessage: "Back",
    id: "store/custom-login.forgot-form.backToLogin",
  },
  forgotPasswordTitle: {
    defaultMessage:
      "Enter the email address associated with your customer account to reset your new password",
    id: "store/custom-login.forgot-form.title",
  },
  emailLabel: {
    defaultMessage: "Email*",
    id: "store/custom-login.forgot-form.email-label",
  },
  forgotFormEmailPlaceholder: {
    defaultMessage: "name.firstname@example.com",
    id: "store/custom-login.forgot-form.placeholder.email",
  },
  forgotFormButtonText: {
    defaultMessage: "Send",
    id: "store/custom-login.forgot-form.button-label",
  },
  emailNotFound: {
    defaultMessage: "Email not found",
    id: "store/custom-login.forgot-form.error-emailNotFound",
  },
  forgotError: {
    defaultMessage: "Something went wrong, please try again",
    id: "store/custom-login.forgot-form.error-fetch",
  },
});
