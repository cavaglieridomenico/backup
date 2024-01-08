import React, { useState, useEffect } from "react";
import style from "../style.css";
import { useLogin } from "../context/LoginContext";
import { Input, Checkbox } from "vtex.styleguide";
import { useIntl, defineMessages } from "react-intl";
import signUpFormValidation from "../validations/signUpFormValidation";
import { usePixel } from "vtex.pixel-manager";

interface RegistrationFormProps {
  optinLink: string;
  isExternalLink: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  optinLink,
  isExternalLink,
}) => {
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
  } = useLogin();

  const [errors, setErrors]: any = useState({});

  /*---ERRORS RESET ---*/
  const resetInput = (value: string) => {
    errors[value] && delete errors[value], setErrors({ ...errors });
  };

  /*--- FORM SUBMITTING ---*/
  const handleSubmitSignUp = (e: any) => {
    e.preventDefault();
    setErrors(signUpFormValidation(signUpFormValues, errorMessages));
    setIsSignUpSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length == 0 && isSignUpSubmitting) {
      signupFormFetch();
    } else if (isSignUpSubmitting && Object.keys(errors).length != 0) {
      Object.entries(errors).forEach((error: any) => {
        push({ event: "errorMessage", data: error[1] });

        //GA4FUNREQ58
        push({
          event: "ga4-custom_error",
          type: "error message",
          description: `${error[0]}: ${error[1]}`,
        });
      });
      setIsSignUpSubmitting(false);
    }
  }, [errors, isSignUpSubmitting]);

  useEffect(() => {
    if (!signUpFetchResponse) {
      const errorMessage =
        signUpResponse == "409"
          ? intl.formatMessage(messages.signUpAlreadyUsedEmail)
          : signUpResponse == "403"
          ? intl.formatMessage(messages.signUpInvitationExpired)
          : intl.formatMessage(messages.signUpError);
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
  }, [signUpFetchResponse]);

  return (
    <div className={style.registrationFormContainer}>
      <div className={style.registrationFormWrapper}>
        <div className={style.registrationModalTitleContainer}>
          <h2 className={style.registrationModalTitle}>
            {intl.formatMessage(messages.registrationModalTitle)}
          </h2>
        </div>
        <form onSubmit={(e: any) => handleSubmitSignUp(e)}>
          <div className={style.inputDiv}>
            <Input
              label={intl.formatMessage(messages.signUpFormName)}
              name="name"
              value={signUpFormValues?.name}
              error={errors?.name}
              errorMessage={errors?.name}
              placeholder={intl.formatMessage(
                messages.signUpFormNamePlaceholder
              )}
              onChange={(e: any) => {
                handleChangeInputSignUp(e);
                resetInput("name");
              }}
            />
          </div>
          <div className={style.inputDiv}>
            <Input
              label={intl.formatMessage(messages.signUpFormSurname)}
              name="surname"
              value={signUpFormValues?.surname}
              error={errors?.surname}
              errorMessage={errors?.surname}
              placeholder={intl.formatMessage(
                messages.signUpFormSurnamePlaceholder
              )}
              onChange={(e: any) => {
                handleChangeInputSignUp(e);
                resetInput("surname");
              }}
            />
          </div>
          <div className={style.inputDiv}>
            <Input
              label={intl.formatMessage(messages.signUpFormEmail)}
              name="email"
              value={signUpFormValues?.email}
              error={errors?.email}
              errorMessage={errors?.email}
              placeholder={intl.formatMessage(
                messages.signUpFormEmailPlaceholder
              )}
              onChange={(e: any) => {
                handleChangeInputSignUp(e);
                resetInput("email");
              }}
            />
          </div>
          <div className={style.optinCheckboxDiv}>
            <div className={style.optinContainer}>
              <span className={style.optinLabel}>
                {intl.formatMessage(messages.optinLabelTitle1)}
              </span>
              <a
                href={optinLink}
                className={style.optinLabelLink}
                target={isExternalLink ? "_blank" : undefined}
              >
                {intl.formatMessage(messages.optinLabelLinkText)}
              </a>
              <span className={style.optinLabel}>
                {intl.formatMessage(messages.optinLabelTitle2)}
              </span>
            </div>
            <Checkbox
              onChange={() => handleChangeOptinCheckboxSignUp()}
              checked={signUpFormValues.optin}
              label={intl.formatMessage(messages.optinCheckboxLabel)}
            />
          </div>
          {!signUpFetchResponse && (
            <div className={style.loginErrorContainer}>
              <span className={style.loginFormFetchError}>
                {signUpResponse == "409"
                  ? intl.formatMessage(messages.signUpAlreadyUsedEmail)
                  : signUpResponse == "403"
                  ? intl.formatMessage(messages.signUpInvitationExpired)
                  : intl.formatMessage(messages.signUpError)}
              </span>
            </div>
          )}

          {isSignUpSubmitting ? (
            <div className={style.loaderFormContainer}>
              <div className={style.loaderForm}></div>
            </div>
          ) : (
            <div className={style.submitRegistrationButtonContainer}>
              <button
                className={`${style.submitButton} ${style.submitRegistrationButton}`}
                type="submit"
              >
                {intl.formatMessage(messages.submitRegistrationButtonText)}
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
});
