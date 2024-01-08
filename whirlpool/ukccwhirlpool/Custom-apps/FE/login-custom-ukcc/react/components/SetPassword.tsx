import React, { useEffect, useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
import { Input, InputPassword } from "vtex.styleguide";
import { useLogin } from "../context/LoginContext";
import style from "../style.css";
import setPasswordFormValidation from "../validations/setPasswordFormValidation";
import ValidationTootltip from "./ValidationTootltip";

interface SetPasswordProps {}


const SetPassword: React.FC<SetPasswordProps> = ({}) => {
  /*--- INTL ---*/
  const intl = useIntl();
  const { push } = usePixel();

  const {
    setPasswordFormValues,
    errorMessages,
    isSetPasswordSubmitting,
    setIsSetPasswordSubmitting,
    setPasswordFormFetch,
    handleChangeInputSetPassword,
    upperCaseRegex,
    lowerCaseRegex,
    numberRegex,
    setPasswordFetchResponse,
    setPasswordResponse,
  } = useLogin();

  const [errors, setErrors]: any = useState({});
  const [isTooltipVisible, setTootltipVisible] = useState(false);
  const [password2, setPassword2] = useState("");

  /*---ERRORS RESET ---*/
  const resetInput = (value: string) => {
    errors[value] && delete errors[value], setErrors({ ...errors });
  };

  /*--- FORM SUBMITTING ---*/
  const handleSubmitSetPassword = (e: any) => {
    e.preventDefault();
    setErrors(
      setPasswordFormValidation(
        setPasswordFormValues,
        errorMessages,
        password2,
        {
          upperCaseRegex,
          lowerCaseRegex,
          numberRegex,
        }
      )
    );
    setIsSetPasswordSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length == 0 && isSetPasswordSubmitting) {
      setPasswordFormFetch();
    } else if (isSetPasswordSubmitting && Object.keys(errors).length != 0) {
      Object.entries(errors).forEach((error: any) => {
        push({
          event: "ga4-custom_error",
          type: "error message",
          description: error[1],
        });
      });
      setIsSetPasswordSubmitting(false);
    }
  }, [errors, isSetPasswordSubmitting]);

  useEffect(() => {
    if (!setPasswordFetchResponse) {
      push({
        event: "errorMessage",
        data:
          setPasswordResponse == "401"
            ? intl.formatMessage(messages.wrongAccessKey)
            : intl.formatMessage(messages.setPasswordError),
      });
    }
  }, [setPasswordFetchResponse]);

  return (
    <div className={style.loginFormContainer}>
      <div className={style.loginFormWrapper}>
        <div className={style.setPasswordTitleContainer}>
          <span
            className={`${style.setPasswordTitleText} ${style.setPasswordTitleTextTop}`}
          >
            {intl.formatMessage(messages.setPasswordTitle1)}
          </span>
          <span className={style.setPasswordTitleText}>
            {intl.formatMessage(messages.setPasswordTitle2)}
          </span>
        </div>
        <form className={style.setPasswordForm} onSubmit={(e: any) => handleSubmitSetPassword(e)}>
          <div className={style.inputDiv}>
            <Input
              label={intl.formatMessage(messages.accessKey)}
              name="accessKey"
              value={setPasswordFormValues?.accessKey}
              error={errors?.accessKey}
              errorMessage={errors?.accessKey}
              placeholder={intl.formatMessage(
                messages.setPasswordFormAccessKeyPlaceholder
              )}
              onChange={(e: any) => {
                handleChangeInputSetPassword(e);
                resetInput("accessKey");
              }}
            />
          </div>
          <div className={`${style.passwordInput} ${style.inputDiv}`}>
            <InputPassword
              label={intl.formatMessage(messages.password)}
              name="password"
              value={setPasswordFormValues?.password}
              error={errors?.password}
              errorMessage={errors?.password}
              placeholder={intl.formatMessage(
                messages.setPasswordFormPasswordPlaceholder
              )}
              onChange={(e: any) => {
                handleChangeInputSetPassword(e);
                resetInput("password");
              }}
              onFocus={() => setTootltipVisible(true)}
              onBlur={() => setTootltipVisible(false)}
            />
            {isTooltipVisible && (
              <ValidationTootltip values={setPasswordFormValues} />
            )}
          </div>
          <div className={`${style.passwordInput} ${style.inputDiv}`}>
            <InputPassword
              label={intl.formatMessage(messages.password2)}
              name="password2"
              value={password2}
              error={errors?.password2}
              errorMessage={errors?.password2}
              placeholder={intl.formatMessage(
                messages.setPasswordFormPassword2Placeholder
              )}
              onChange={(e: any) => {
                setPassword2(e.target.value);
                resetInput("password2");
              }}
            />
          </div>
          {!setPasswordFetchResponse && (
            <div className={style.loginErrorContainer}>
              <span className={style.loginFormFetchError}>
                {setPasswordResponse == "401"
                  ? intl.formatMessage(messages.wrongAccessKey)
                  : intl.formatMessage(messages.setPasswordError)}
              </span>
            </div>
          )}
          {isSetPasswordSubmitting ? (
            <div className={style.loaderFormContainer}>
              <div className={style.loaderForm}></div>
            </div>
          ) : (
            <div className={style.sumbitButtonContainer}>
              <button className={style.submitButton} type="submit">
                {intl.formatMessage(messages.setPasswordButtonText)}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SetPassword;

const messages = defineMessages({
  setPasswordTitle1: {
    defaultMessage: "Validate your email address and create your password",
    id: "store/custom-login.setPassword-form.title1",
  },
  setPasswordTitle2: {
    defaultMessage:
      "Insert the code we sent you by email and create a new password",
    id: "store/custom-login.setPassword-form.title2",
  },
  accessKey: {
    defaultMessage: "Access key*",
    id: "store/custom-login.setPassword-form.accessKey",
  },
  password: {
    defaultMessage: "Password*",
    id: "store/custom-login.setPassword-form.password",
  },
  password2: {
    defaultMessage: "Confirm password*",
    id: "store/custom-login.setPassword-form.password2",
  },
  setPasswordButtonText: {
    defaultMessage: "Log in",
    id: "store/custom-login.setPassword-form.buttonText",
  },
  wrongAccessKey: {
    defaultMessage: "The access key is wrong",
    id: "store/custom-login.setPassword-form.error.accessKey",
  },
  setPasswordError: {
    defaultMessage: "Something went wrong, please try again",
    id: "store/custom-login.setPassword-form.error-fetch",
  },
  setPasswordFormAccessKeyPlaceholder: {
    defaultMessage: "Insert your access key",
    id: "store/custom-login.setPassword-form.placeholder.accessKey",
  },
  setPasswordFormPasswordPlaceholder: {
    defaultMessage: "Insert your password",
    id: "store/custom-login.setPassword-form.placeholder.password",
  },
  setPasswordFormPassword2Placeholder: {
    defaultMessage: "Insert again your password",
    id: "store/custom-login.setPassword-form.placeholder.password2",
  },
});
