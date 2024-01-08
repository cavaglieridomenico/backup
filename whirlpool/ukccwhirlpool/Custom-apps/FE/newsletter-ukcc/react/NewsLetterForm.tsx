import React, { useState, useEffect, useContext } from "react";
import style from "./style.css";
import { Input, Checkbox } from "vtex.styleguide";
import { useQuery } from "react-apollo";
import getUserInfos from "./graphql/getUserInfos.graphql";
import newsletterFormValidation from "./validations/newsletterFormValidation";
import { useIntl } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
import { index as RichText } from "vtex.rich-text";
import {
  getUserOptin,
  putNewUser,
  getUserAuthentication,
} from "./api-calls/utils";
import { CampaignContext } from "./CampaignContext";

interface NewsLetterFormProps {
  title?: string;
  description?: string;
  shouldShowName?: boolean;
  shouldShowSurname?: boolean;
  textButton: string;
  privacyCheckboxLabel: string;
}

interface UserValues {
  name: string;
  surname: string;
  email: string;
  isOptin: boolean;
}

interface FormCallStatus {
  submitting: boolean;
  loading: boolean;
  errorMessage: string;
}

const NewsLetterForm: StorefrontFunctionComponent<NewsLetterFormProps> = ({
  title,
  description,
  shouldShowName = true,
  shouldShowSurname = true,
  textButton,
  privacyCheckboxLabel,
}) => {
  const intl = useIntl();
  const { push } = usePixel();
  const [buttonLabel, setButtonLabel] = useState(textButton);

  const pushOptinEvent = () => {
    //GA4FUNREQ23
    push({
      event: "ga4-personalArea",
      section: "Newsletter",
      type: "registration",
    });
    //GA4FUNREQ53
    push({
      event: "ga4-form_submission",
      type: "newsletter",
    });
    //GA4FUNREQ61
    push({
      event: "ga4-optin",
    });
  };
  const pushErrorEvent = () => {
    push({
      event: "errorMessage",
      data: intl.formatMessage({
        id: "store/newsletter-custom-ukcc.callErrorMessage",
      }),
    });
  };

  /*--- USER DATAS QUERY ---*/
  const { loading: infoDataLoading, data } = useQuery(getUserInfos);

  /*--- FORM STATES ---*/
  const [errors, setErrors]: any = useState({});
  const [formCallStatus, setFormCallStatus] = useState<FormCallStatus>({
    submitting: false,
    loading: false,
    errorMessage: "",
  });

  /*--- ERRORS RESET ---*/
  const resetInput = (value: string) => {
    errors[value] && delete errors[value], setErrors({ ...errors });
  };

  /*-- USER VALUES ---*/
  const [userValues, setUserValues] = useState<UserValues>({
    name: "",
    surname: "",
    email: "",
    isOptin: false,
  });

  const [isUserAdded, setIsUserAdded] = useState(false);

  useEffect(() => {
    if (!infoDataLoading && data) {
      setUserValues({
        ...userValues,
        name: data?.loggedInUserInfo?.firstName || "",
        surname: data?.loggedInUserInfo?.lastName || "",
        email: data?.loggedInUserInfo?.email || "",
      });
    }
  }, [infoDataLoading]);

  const campaign = useContext(CampaignContext);

  /*--- FORM SUBMITTING ---*/
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setErrors(newsletterFormValidation(userValues, intl?.messages));
    setFormCallStatus({
      ...formCallStatus,
      submitting: true,
    });
  };

  const hasErrors = Object.keys(errors).length != 0;

  useEffect(() => {
    //Submit with no errors
    if (!hasErrors && formCallStatus.submitting) {
      newsletterFormFetch();
      //Submit with errors
    } else if (formCallStatus.submitting && hasErrors) {
      Object.entries(errors).forEach((error: any) => {
        push({
          event: "ga4-custom_error",
          type: "error message",
          description: error[1],
        });
      });
      setFormCallStatus({ ...formCallStatus, submitting: false });
    }
  }, [errors, formCallStatus.submitting]);

  const newsletterFormFetch = async () => {
    setFormCallStatus({
      ...formCallStatus,
      loading: true,
      errorMessage: "",
    });

    const handleUserAdded = () => {
      setFormCallStatus({
        ...formCallStatus,
        loading: false,
        submitting: false,
      });
      setButtonLabel(
        intl.formatMessage({
          id: "store/newsletter-custom-ukcc.successMessage",
        })
      );
      setIsUserAdded(true);
      pushOptinEvent();
    };

    const handleApiCallError = () => {
      setFormCallStatus({
        ...formCallStatus,
        loading: false,
        submitting: false,
        errorMessage: intl.formatMessage({
          id: "store/newsletter-custom-ukcc.callErrorMessage",
        }),
      });
      pushErrorEvent();
    };

    const userOptinInfo = await getUserOptin(userValues?.email);

    //User without optin
    if (userOptinInfo?.length > 0 && !userOptinInfo?.[0].isNewsletterOptIn) {
      const isUserLogged = await getUserAuthentication();
      if (
        isUserLogged?.namespaces?.profile == undefined ||
        isUserLogged?.namespaces?.profile?.isAuthenticated?.value == "false"
      ) {
        setFormCallStatus({
          ...formCallStatus,
          loading: false,
          submitting: false,
          errorMessage: intl.formatMessage({
            id: "store/newsletter-custom-ukcc.alreadyRegisteredErrorMessage",
          }),
        });
      } else {
        const newUserResponse = await putNewUser(
          userValues,
          campaign?.campaignState
        );
        //API call done - user correctly added
        if (newUserResponse.Message == undefined && !newUserResponse.error) {
          handleUserAdded();
          //API call error
        } else if (newUserResponse.error) {
          handleApiCallError();
        }
      }
    }
    //User with optin and already registered
    else if (
      userOptinInfo?.length > 0 &&
      userOptinInfo?.[0].isNewsletterOptIn
    ) {
      setFormCallStatus({
        ...formCallStatus,
        loading: false,
        submitting: false,
        errorMessage: intl.formatMessage({
          id: "store/newsletter-custom-ukcc.alreadyRegisteredErrorMessage",
        }),
      });
      //No user Infos
    } else {
      const newUserResponse = await putNewUser(
        userValues,
        campaign?.campaignState
      );
      //API call done - user correctly added
      if (newUserResponse.Message == undefined && !newUserResponse.error) {
        handleUserAdded();
        //API call error
      } else if (newUserResponse.error) {
        handleApiCallError();
      }
    }
  };

  return (
    <div className={style.containerForm}>
      {title && <h2 className={style.titleForm}>{title}</h2>}
      {description && <h4 className={style.descriptionForm}>{description}</h4>}
      <form onSubmit={handleSubmit}>
        {/* NAME AND SURNAME */}
        <div className={style.fieldContainer}>
          {shouldShowName ? (
            <Input
              placeholder="First name"
              value={userValues?.name}
              onFocus={() => resetInput("name")}
              onChange={(e: any) => {
                setUserValues({ ...userValues, name: e.target.value });
              }}
              errorMessage={errors.name ? errors["name"] : null}
            />
          ) : null}
          {shouldShowSurname ? (
            <Input
              placeholder="Last name"
              value={userValues?.surname}
              onFocus={() => resetInput("surname")}
              onChange={(e: any) => {
                setUserValues({ ...userValues, surname: e.target.value });
              }}
              errorMessage={errors.surname ? errors["surname"] : null}
            />
          ) : null}
        </div>
        {/* EMAIL */}
        <div className={`${style.fieldContainer} ${style.fieldContainerEmail}`}>
          <Input
            placeholder="firstname.lastname@example.en"
            value={userValues?.email}
            type="email"
            onFocus={() => resetInput("email")}
            onChange={(e: any) => {
              !data?.loggedInUserInfo?.email || location.href.includes("vip")
                ? setUserValues({ ...userValues, email: e.target.value })
                : null;
            }}
            disabled={
              data?.loggedInUserInfo?.email && !location.href.includes("vip")
            }
            errorMessage={errors.email ? errors["email"] : null}
          />
        </div>
        {/* LEGAL AND PRIVACY */}
        <div className={style.informativa}>
          <div>
            <label
              htmlFor="default-checkbox-group"
              className={style.privacyLabel}
            >
              <p className={style.paragraph}>
                {intl.formatMessage({
                  id: "store/newsletter-custom-ukcc.privacyLabel",
                })}
                <a className={style.link} href="/privacy-policy" target="_blank"> {intl.formatMessage({ id: "store/newsletter-custom-ukcc.privacyLabelLink", })}</a>
              </p>
            </label>
            <div className={style.privacyCheckboxWrapper}>
              <div className={style.privacyCheckboxContainer}>
                <Checkbox
                  checked={userValues?.isOptin}
                  id="privacy-check"
                  name="default-checkbox-group"
                  onChange={(e: any) =>
                    setUserValues({ ...userValues, isOptin: e.target.checked })
                  }
                  required={true}
                  value={userValues?.isOptin}
                />
              </div>

              <label
                htmlFor="default-checkbox-group"
                className={style.privacyCheckboxLabel}
              >
                <RichText text={privacyCheckboxLabel} />
              </label>
            </div>
          </div>
        </div>
        {/* SUMBIT BUTTON */}
        <div className={style.submitContainer}>
          {!formCallStatus?.loading ? (
            <>
              <div
                className={
                  hasErrors
                    ? style.formNotValid
                    : isUserAdded
                      ? style.buttonDisabled
                      : null
                }
              >
                <Input
                  disabled={isUserAdded}
                  type="submit"
                  value={buttonLabel}
                />
              </div>
              {formCallStatus?.errorMessage != "" && (
                <div className={style.errorClass}>
                  {formCallStatus?.errorMessage}
                </div>
              )}
            </>
          ) : (
            <div className={style.loaderForm}></div>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewsLetterForm;

NewsLetterForm.schema = {
  title: "NewsLetterFrom",
  description: "Newsletter form",
  type: "object",
  properties: {
    title: {
      title: "Modal title",
      description: "",
      default: undefined,
      type: "string",
    },
    description: {
      title: "Modal subtitle",
      description: "",
      default: undefined,
      type: "string",
    },
    textButton: {
      title: "Button label",
      description: "Label shown on the submit button",
      default: "",
      type: "string",
    },
    name: {
      title: "Name field",
      description:
        "Boolean able to decide if the filed name should be visible or not",
      default: true,
      type: "boolean",
    },
    surname: {
      title: "Surname field",
      description:
        "Boolean able to decide if the filed surname should be visible or not",
      default: true,
      type: "boolean",
    },
  },
};
