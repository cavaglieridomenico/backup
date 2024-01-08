import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useReducer,
} from "react";
import { Input, Checkbox, Button } from "vtex.styleguide";
import { CheckboxProps } from "./typings/global";
import { useCssHandles } from "vtex.css-handles";
import { getOptinMessageWEMEA } from "./utils/utilsFunction";
import { FormattedMessage, useIntl } from "react-intl";
import { CampaignContext } from "./CampaignContext";
import { usePixel } from "vtex.pixel-manager";
import { useRuntime } from "vtex.render-runtime";

interface NewsLetterFormProps {
  textButton?: any;
  textButtonLang?: string;
  name: boolean;
  surname: boolean;
  textBeforePrivacy: any;
  textBeforePrivacy_lang: any;
  textAfterPrivacy: any;
  textAfterPrivacy_lang: any;
  privacyPolicyLink: any;
  privacyPolicyLink_lang: any;
  privacyPolicyLinkURL: any;
  privacyPolicyContent: string;
  placeholderName: any;
  placeholderSurname: any;
  placeholderEmail: any;
  errorMessageCompleteField: string;
  errorMessageRegistrationFailed: string;
  alreadyRegistered: string;
  alreadyRegisteredQuestion: string;
  checkboxes?: [CheckboxProps];
  generalCheckboxError: string;
  checkBoxErrorMessage_defaultLang: string;
  checkBoxErrorMessage_currentLang: string;
}

interface WindowGTM extends Window {
  dataLayer: any[];
}
const dataLayer = (window as unknown as WindowGTM).dataLayer || [];

let textButtonFormatted: any = <FormattedMessage id="store/submit-button" />;
let textBeforeFormatted: any = (
  <FormattedMessage id="store/i-have-read-content" />
);
let registerCompletedFormatted: any = (
  <FormattedMessage id="store/success-registered" />
);
let privacyPolicyLinkFormatted: any = (
  <FormattedMessage id="store/privacy-policy" />
);
let errorMessageCompleteFieldFormatted: any = (
  <FormattedMessage id="store/complete-field" />
);
let errorMessageRegistrationFailedFormatted: any = (
  <FormattedMessage id="store/registration-failed" />
);
let alreadyRegisteredQuestionFormatted: any = (
  <FormattedMessage id="store/already-registered-question" />
);
let generalCheckboxErrorFormatted: any = (
  <FormattedMessage id="store/general-checkbox-error" />
);

const initialForm = {
  firstName: "",
  surname: "",
  email: "",
};

const reducer = (state: any, target: any) => ({
  ...state,
  [target.name]: target.value,
});

const NewsLetterForm: StorefrontFunctionComponent<NewsLetterFormProps> = ({
  textButton = textButtonFormatted,
  textButtonLang,
  name = true,
  surname = true,
  textBeforePrivacy = textBeforeFormatted,
  textBeforePrivacy_lang,
  textAfterPrivacy,
  textAfterPrivacy_lang,
  privacyPolicyLink = privacyPolicyLinkFormatted,
  privacyPolicyLink_lang,
  privacyPolicyLinkURL,
  placeholderName,
  placeholderSurname,
  placeholderEmail,
  errorMessageCompleteField = errorMessageCompleteFieldFormatted,
  errorMessageRegistrationFailed = errorMessageRegistrationFailedFormatted,
  alreadyRegisteredQuestion = alreadyRegisteredQuestionFormatted,
  checkboxes,
  generalCheckboxError = generalCheckboxErrorFormatted,
}: NewsLetterFormProps) => {
  const [optin, setOptin] = useState<Boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [errorMessageNewsletter, setErrorMessageNewsletter] =
    useState<boolean>(false);
  const [isAlreadyRegistred, setAlreadyRegister] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);
  const [form, dispatch] = useReducer(reducer, initialForm);
  const [loading, setLoading] = useState(false);
  const [messageSuccess, setMessage] = useState("");
  //array with all newsletters
  const [wichOneIsNewsletter, setWichOneIsNewsletter] = useState(
    new Array(checkboxes?.length)?.fill(false)
  );
  //array with all required checkboxes errors
  const [errorCheckboxes, setErrorCheckboxes] = useState(
    new Array(checkboxes?.length)?.fill(false)
  );
  //array with all checkboxes states (checked or not)
  const [checkboxesState, setCheckboxesState] = useState(
    new Array(checkboxes?.length)?.fill(false)
  );
  // Handle form values errors
  const [errors, setErrors] = useState({
    firstName: false,
    surname: false,
    email: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();
  const { push } = usePixel();
  console.log(loading);

  const {
    culture: { locale },
  } = useRuntime();

  const CSS_HANDLES = [
    "containerForm",
    "titleForm",
    "descriptionForm",
    "fieldContainer",
    "fieldContainer",
    "fieldContainerEmail",
    "informativa",
    "submitContainer",
    "errorClass",
    "successClass",
    "loaderForm",
    "formButtonEnabled",
    "textBeforePrivacy",
    "privacyPolicyLink",
    "textAfterPrivacy",
  ] as const;
  const handles = useCssHandles(CSS_HANDLES);

  // Handle Input onBlur
  const handleBlur = (e: any) => {
    setErrors({
      ...errors,
      [e.target.name]: !e.target.validity.valid || !e.target.value,
    });
    if (e.target.name === "email") {
      validateEmail(e.target.value);
    }
  };

  // Function to validate email properly
  const validateEmail = (newEmail: string) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // If mail doesn't pass the regex test setError and return false
    if (!emailRegex.test(newEmail.toLowerCase())) {
      setErrors({
        ...errors,
        email: !emailRegex.test(newEmail.toLowerCase()),
      });
      return false;
    }
    return true;
  };

  const campaign = useContext(CampaignContext);

  // Handle if Optin is true
  const handleUserOptIn = async () => {
    // Set OptinMessage basing on what getOptinMessage utils function return
    await getOptinMessageWEMEA(
      loggedIn,
      form.email,
      form.firstName,
      form.surname,
      campaign.campaignState
    );
  };

  //GA4FUNREQ58
  useEffect(() => {
    if (isSubmitting) {
      pushCustomErrors();
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const pushCustomErrors = () => {
    let errArray = Object.keys(errors);
    let err: any = errors;
    errArray.map((key) => {
      if (err[key]) {
        push({
          event: "ga4-custom_error",
          type: "error message",
          description: `${key}: ${intl.formatMessage({
            id: "store/complete-field",
          })}`,
        });
      }
    });
  };

  const handleSubmit = async (e: any) => {
    setIsSubmitting(true);
    e.preventDefault();
    e.stopPropagation();
    checkIfIsOptin();
    resetMessages();
    if (!isFormValid()) {
      return;
    }
    if (!checkboxesFormValid()) return;
    setLoading(true);
    if (optin) {
      await handleUserOptIn();
      setMessage(registerCompletedFormatted);
      //GA4FUNREQ53
      push({
        event: "ga4-form_submission",
        type: "newsletter",
      });
      //GA4FUNREQ61
      push({
        event: "ga4-optin",
      });
    } else {
      setErrorMessageNewsletter(true);
    }
    setLoading(false);
    setIsSubmitting(false);
  };

  //Function to Check if Form informations inserted are Valid
  const isFormValid = () => {
    if (!loggedIn) {
      //If some form values are not setted
      if (Object.values(form).some((formValue) => !formValue)) {
        setErrors({
          ...errors,
          firstName: form.firstName ? false : true,
          surname: form.surname ? false : true,
          email: form.email && validateEmail(form.email) ? false : true,
        });
        return false;
      }
    }

    // If some errors are already present
    if (Object.values(errors).some((errorBoolean) => errorBoolean)) {
      return false;
    }

    // Otherwise form is valid
    return true;
  };

  //when submit are required-checkboxes checked?
  const checkboxesFormValid = () => {
    let updatedErrorCheckboxesState: boolean[] = [];
    checkboxes?.forEach((item: CheckboxProps, index: number) => {
      if (item.checkboxRequired && !checkboxesState[index]) {
        updatedErrorCheckboxesState.push(true);
      } else {
        updatedErrorCheckboxesState.push(false);
      }
    });

    //save array with error data in a state
    setErrorCheckboxes(updatedErrorCheckboxesState);

    //if checkboxes error is true return form valid is false
    if (
      updatedErrorCheckboxesState.filter((item) => item === true).length > 0
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleOnChangeCheckbox = (position: number) => {
    push({
      event: "LeadGeneration",
      data: "newsletter_subscription",
    });
    /* set Value to checkbox in position x */
    const updatedCheckboxesState = checkboxesState.map((item, index: number) =>
      index == position ? !item : item
    );
    //save array with state data in a state
    setCheckboxesState(updatedCheckboxesState);

    /*set error if not checked */
    let updatedErrorCheckboxesState: any[] = errorCheckboxes;
    if (
      checkboxes?.[position]?.checkboxRequired &&
      !updatedCheckboxesState[position]
    ) {
      updatedErrorCheckboxesState[position] = true;
    } else {
      updatedErrorCheckboxesState[position] = false;
    }
    //save array with error data in a state
    setErrorCheckboxes(updatedErrorCheckboxesState);
  };

  const checkIsNewsletterCheckbox = () => {
    let wichOneIsNL: boolean[] = [];
    checkboxes?.map((item: any) => {
      if (item.checkboxNewsLetter) {
        wichOneIsNL.push(true);
      } else {
        wichOneIsNL.push(false);
      }
    });
    setWichOneIsNewsletter(wichOneIsNL);
  };

  //if all newsletter checkboxes are setted then optin is true
  const checkIfIsOptin = () => {
    let isOptinArray: boolean[] = [];
    //set value true to new array if newslettercheckboxes are true
    wichOneIsNewsletter.map((WIN: boolean, index: number) => {
      if (WIN && checkboxesState[index]) {
        isOptinArray.push(true);
      } else {
        isOptinArray.push(false);
      }
    });
    //set optin if all newsletterCheckboxes are setted
    const equals = (a: any, b: any) => {
      if (JSON.stringify(a) === JSON.stringify(b)) {
        setOptin(true);
      } else {
        setOptin(false);
      }
    };
    return equals(isOptinArray, wichOneIsNewsletter);
  };

  const getSessionData = () => {
    return fetch("/api/sessions?items=*")
      .then((res: any) => res.json())
      .then((data) => {
        return data?.namespaces?.profile;
      });
  };

  // reset all messages
  const resetMessages = () => {
    setErrorMessageNewsletter(false);
    setAlreadyRegister(false);
    setIsFetchError(false);
  };

  // Function to check if user is loggedIn
  const isAuth = async () => {
    const profile = await getSessionData();
    setLoggedIn(profile?.isAuthenticated?.value == "true");
    if (profile && profile.email)
      dispatch({ name: "email", value: profile?.email?.value });
    dispatch({ name: "firstName", value: profile?.firstName?.value });
    dispatch({ name: "surname", value: profile?.lastName?.value });
    // setFormLoading(false);
  };

  // set if user is logged and set state with wich one checkboxes are marked as newsletter
  useEffect(() => {
    //user is loggedin?
    isAuth();
    //we push in wich position are checkoboxes newsletter
    checkIsNewsletterCheckbox();
  }, []);

  useEffect(() => {
    checkIfIsOptin();
  }, [checkboxesState]);

  const analyticsPopupWrapper: any = useRef(null);
  useEffect(() => {
    if (!analyticsPopupWrapper) return;
    const popupEvent = {
      event: "popupInteraction",
      eventCategory: "Popup",
      eventAction: analyticsPopupWrapper.current
        ? analyticsPopupWrapper.current.id
        : "newsletter-popup",
    };
    dataLayer.push({ ...popupEvent, eventLabel: "click" });
    dataLayer.push({ ...popupEvent, eventLabel: "view" });

    return () => {
      dataLayer.push({ ...popupEvent, eventLabel: "close" });
    };
  }, [analyticsPopupWrapper]);

  const generateForm = () => {
    return (
      <div className={`${handles.containerForm}`}>
        <form onSubmit={handleSubmit}>
          <div className={handles.fieldContainer}>
            {name ? (
              <Input
                placeholder={placeholderName}
                name="firstName"
                value={form.firstName}
                type="text"
                onChange={(e: any) => dispatch(e.target)}
                errorMessage={
                  errors.firstName ? errorMessageCompleteField : null
                }
                onBlur={handleBlur}
              />
            ) : null}

            {surname ? (
              <Input
                placeholder={placeholderSurname}
                name="surname"
                type="text"
                value={form.surname}
                onChange={(e: any) => dispatch(e.target)}
                onBlur={handleBlur}
                errorMessage={errors.surname ? errorMessageCompleteField : null}
              />
            ) : null}
          </div>

          {!loggedIn ? (
            <div
              className={`${handles.fieldContainer} ${handles.fieldContainerEmail}`}
            >
              <Input
                placeholder={placeholderEmail}
                name="email"
                value={form.email}
                type="email"
                onChange={(e: any) => dispatch(e.target)}
                onBlur={handleBlur}
                errorMessage={errors.email ? errorMessageCompleteField : null}
              />
            </div>
          ) : (
            <div
              className={`${handles.fieldContainer} ${handles.fieldContainerEmail}`}
            >
              <Input
                placeholder={placeholderEmail}
                name="email"
                value={form.email}
                type="email"
                disabled={true}
              />
            </div>
          )}
          <div className={handles.informativa}>
            <div>
              <label
                htmlFor="default-checkbox-group"
                style={{ marginLeft: "0", fontSize: "0.625rem" }}
              >
                {locale == "it-IT" ? (
                  <span className={handles.textBeforePrivacy}>
                    {textBeforePrivacy}
                  </span>
                ) : (
                  <span>{textBeforePrivacy_lang}</span>
                )}
                {locale == "it-IT" ? (
                  <a
                    target="_blank"
                    href={privacyPolicyLinkURL}
                    className={handles.privacyPolicyLink}
                  >
                    {privacyPolicyLink}
                  </a>
                ) : (
                  <a
                    target="_blank"
                    href={privacyPolicyLinkURL}
                    className={handles.privacyPolicyLink}
                  >
                    {privacyPolicyLink_lang}
                  </a>
                )}
                {locale == "it-IT" ? (
                  <span className={handles.textAfterPrivacy}>
                    {textAfterPrivacy}
                  </span>
                ) : (
                  <span className={handles.textAfterPrivacy}>
                    {textAfterPrivacy_lang}
                  </span>
                )}
              </label>
            </div>
          </div>
          {/* CHECKBOXES CONTAINER */}
          <div
            id="checkbox-container"
            className={`flex flex-column justify-center items-left tj mb4`}
          >
            {checkboxes?.map((item: CheckboxProps, index: number) => (
              <div
                id="checkbox-wrapper"
                className={`${handles[`form__checkbox`]}`}
              >
                <div id="checkbox" key={`div-checkbox-${index}`}>
                  <Checkbox
                    id={`custom-checkbox-${index}`}
                    name={
                      locale == "it-IT"
                        ? item?.checkboxTitleIT
                        : item?.checkboxTitleEN
                    }
                    label={
                      locale == "it-IT"
                        ? item?.checkboxTitleIT
                        : item?.checkboxTitleEN
                    }
                    value={checkboxesState[index]}
                    checked={checkboxesState[index]}
                    onChange={() => handleOnChangeCheckbox(index)}
                  />
                  {errorCheckboxes[index] && (
                    <div className="c-danger t-small lh-title">
                      {locale == "it-IT" &&
                        item.checkBoxErrorMessage_currentLang}
                      {locale != "it-IT" &&
                        item.checkBoxErrorMessage_defaultLang}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className={handles.submitContainer}>
            <Button type="submit" className={`${handles.formButtonEnabled}`}>
              {locale != "it-IT" ? textButton : textButtonLang}
            </Button>
            {isAlreadyRegistred && (
              <div className={handles.errorClass}>
                {alreadyRegisteredQuestion}
              </div>
            )}
            {isFetchError && (
              <div className={handles.errorClass}>
                {errorMessageRegistrationFailed}
              </div>
            )}
            {errorMessageNewsletter && (
              <div className={handles.errorClass}>{generalCheckboxError}</div>
            )}
            {messageSuccess && (
              <div className={handles.successClass}>{messageSuccess}</div>
            )}
            <div className={handles.loaderForm}></div>
          </div>
        </form>
      </div>
    );
  };

  return generateForm();
};

//when set any checkboxes, have a check to optin

NewsLetterForm.schema = {
  title: "NewsLetterFrom",
  description: "Newsletter form",
  type: "object",
  properties: {
    textButton: {
      title: "Button label",
      description: "Label shown on the submit button",
      default: "",
      type: "string",
    },
    textButtonLang: {
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
    placeholderName: {
      title: "Placeholder name",
      description: "Label for the placeholder name",
      default: "name",
      type: "string",
    },
    placeholderSurname: {
      title: "Placeholder surname",
      description: "Label for the placeholder surname",
      default: "surname",
      type: "string",
    },
    placeholderEmail: {
      title: "Placeholder email",
      description: "Label for the placeholder email",
      default: "name.surname@example.com",
      type: "string",
    },
    textBeforePrivacy: {
      title: "Text Before Privacy",
      description: "Label for the text before the privacy information link",
      type: "string",
    },
    textBeforePrivacy_lang: {
      title: "Text Before Privacy second lang",
      description: "Label for the text before the privacy information link",
      type: "string",
    },
    privacyPolicyLink: {
      title: "Privacy policy link",
      description: "Link for the privacy policy",
      type: "string",
    },
    privacyPolicyLink_lang: {
      title: "Privacy policy link second lang",
      description: "Link for the privacy policy",
      type: "string",
    },
    privacyPolicyLinkURL: {
      title: "Privacy policy link URL",
      description: "pagine/informativa-sulla-privacy",
      type: "string",
    },
    textAfterPrivacy: {
      title: "Text After Privacy",
      description: "Label for the text after the privacy information link",
      type: "string",
    },
    textAfterPrivacy_lang: {
      title: "Text After Privacy second lang",
      description: "Label for the text after the privacy information link",
      type: "string",
    },
    privacyPolicyContent: {
      title: "Privacy policy content",
      description: "Label for the privacy policy content",
      type: "string",
    },
    errorMessageCompleteField: {
      title: "Error message complete field",
      description: "Label for error message complete field",
      type: "string",
    },
    errorMessageRegistrationFailed: {
      title: "Error message registration failed",
      description: "Label for error message registration failed",
      type: "string",
    },
    alreadyRegistered: {
      title: "Already registered",
      description: "Label for Already registered",
      type: "string",
    },
    alreadyRegisteredQuestion: {
      title: "Already registered?",
      description: "Label for Already registered question",
      type: "string",
    },
    generalCheckboxError: {
      title: "General checkbox error",
      description: "Label for general checkbox error",
      type: "string",
    },
    checkboxes: {
      type: "array",
      title: "Checkboxes to print",
      items: {
        properties: {
          checkboxTitleIT: {
            title: "checkbox Title IT",
            type: "string",
          },
          checkboxTitleEN: {
            title: "checkbox Title EN",
            type: "string",
          },
          checkboxRequired: {
            title: "is Required",
            type: "boolean",
          },
          checkboxNewsLetter: {
            title: "Is newsletter",
            type: "boolean",
          },
          checkBoxErrorMessage_defaultLang: {
            title: "Checkbox message error EN",
            description: "Label for unflagged checkbox",
            type: "string",
          },
          checkBoxErrorMessage_currentLang: {
            title: "Checkbox message error IT",
            description: "Label for unflagged checkbox",
            type: "string",
          },
        },
      },
    },
  },
};

export default NewsLetterForm;
