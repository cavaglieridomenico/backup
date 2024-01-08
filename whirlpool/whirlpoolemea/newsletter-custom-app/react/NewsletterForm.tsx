/**
 * @param {NewsletterFormProps}
 * @returns A form used for the Newsletter Subscription
 */
import React, { useState, useReducer, useRef, useEffect } from "react";
import { useIntl } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
import { useNewsletterForm } from "./hooks/useNewsletterForm";
import { Input, Button, Checkbox, Spinner } from "vtex.styleguide";
import RichText from "vtex.rich-text/index";
import AfterSubmitMessages from "./components/AfterSubmitMessages";
import { useCssHandles, applyModifiers } from "vtex.css-handles";
import { CSS_HANDLES, messages } from "./utils/utils";

interface CheckboxProps {
  checkboxLabel?: string;
  checkboxRequired?: boolean;
  checkboxNewsletter?: boolean;
  checkboxProfiling?: boolean;
  checkboxError?: string;
}

interface NewsletterFormProps {
  title?: string;
  subtitles?: string[];
  namePlaceholder: string;
  surnamePlaceholder: string;
  emailPlaceholder: string;
  showInputLabels?: boolean;
  nameLabel?: string;
  surnameLabel?: string;
  emailLabel?: string;
  checkboxes?: CheckboxProps[];
  errorProfOptinCheckbox?: string;
  privacyPolicyTextArray?: string[];
  privacyPolicyTextArrayAfterCheckboxes?: string[];
  errorRequiredField: string;
  errorInvalidMail: string;
  campaign: string;
  submitButtonText?: string;
  successMessageInsideButton?: boolean;
  successMessage: string;
  registeredErrorMessage: string;
  shouldLogInErrorMessage: string;
  genericApiErrorMessage: string;
  pixelEventName?: string;
}

const reducer = (state: any, target: any) => ({
  ...state,
  [target.name]: target.value,
});
const initialForm = {
  name: "",
  surname: "",
  email: "",
};

const NewsletterForm: StorefrontFunctionComponent<NewsletterFormProps> = ({
  title,
  subtitles = [],
  namePlaceholder,
  surnamePlaceholder,
  emailPlaceholder,
  showInputLabels = false,
  nameLabel,
  surnameLabel,
  emailLabel,
  checkboxes = [],
  errorProfOptinCheckbox = "To receive tailored messages, you also need to consent to marketing emails.",
  privacyPolicyTextArray = [],
  privacyPolicyTextArrayAfterCheckboxes = [],
  errorRequiredField,
  errorInvalidMail,
  campaign = "FORM_HP_PROMO_5%DISC",
  submitButtonText,
  successMessage,
  successMessageInsideButton = true,
  registeredErrorMessage = "This email is already registered!",
  shouldLogInErrorMessage = "This email is already associated to one account, please log in to continue",
  genericApiErrorMessage = "Something went wrong, try again.",
  pixelEventName = "newsletterSubscription",
}: NewsletterFormProps) => {
  // Handles form values
  const [form, dispatch] = useReducer(reducer, initialForm);
  // Handles for style
  const handles = useCssHandles(CSS_HANDLES);
  // Formatted messages
  const { formatMessage } = useIntl();
  // handle push GA events
  const { push } = usePixel();
  // Email regEx to validated email
  const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
  // Array with all checkboxes states (checked or not)
  const [checkboxesState, setCheckboxesState] = useState<any>(
    new Array(checkboxes?.length)?.fill(false)
  );
  const [showErrors, setShowErrors] = useState(false);
  // Array to check which checkbox is for newsletter --> it will be used for newsletterOptin
  const wichOneIsNewsletter = checkboxes.map(
    (item: CheckboxProps) => item?.checkboxNewsletter
  );
  // Array to check which checkbox is for profiling --> it will be used for profilingOptIn
  const whichOneIsProfiling = checkboxes.map(
    (item: CheckboxProps) => item?.checkboxProfiling ?? false
  );
  // Array to check if every required checkbox is checked
  const errorCheckboxes = checkboxes?.map(
    ({ checkboxRequired }: CheckboxProps, index: number) =>
      checkboxRequired && !checkboxesState[index]
  );
  // If no checked checkboxes at whichOneIsNewsletter index --> optInCheck = false
  const optInCheck = !wichOneIsNewsletter.some(
    (isNewsletter: boolean | undefined, index: number): boolean =>
      !!isNewsletter && !checkboxesState[index]
  );
  // If no checked checkboxes at whichOneIsProfiling index --> profilingOptIn = false
  const profilingOptIn = whichOneIsProfiling?.some(
    (isProfiling: boolean, index: number): boolean =>
      isProfiling && checkboxesState[index]
  );
  // Check if form is valid
  const errors = {
    name: !form.name,
    surname: !form.surname,
    email: !regEx.test(form.email),
    optIn: !optInCheck,
  };
  // handleSubmit and status from useNewsletterForm Hook
  const { handleSubmit, status } = useNewsletterForm({
    form,
    errors,
    errorCheckboxes,
    optInCheck,
    profilingOptIn,
    campaign,
    setShowErrors,
    submitButtonText,
    pixelEventName,
  });
  // Handle Inputs onBlur
  const handleBlur = (e: any) => {
    (errors as any)[e.target.name] =
      !e.target.validity.valid || !e.target.value;
  };
  // Handle onChange checkboxes
  const handleOnChangeCheckbox = (position: number) => {
    /* set Value to checkbox in position x */
    const updatedCheckboxesState = checkboxesState.map(
      (item: boolean, index: number) => (index == position ? !item : item)
    );
    //save array with state data in a state
    setCheckboxesState(updatedCheckboxesState);
  };
  // Handle the message to show inside submit button
  const handleButtonText = () => {
    if (successMessageInsideButton) {
      return status === "SUCCESS"
        ? successMessage
        : submitButtonText ?? formatMessage(messages.submitButtonText);
    }
    return submitButtonText ?? formatMessage(messages.submitButtonText);
  };

  //GA4FUNREQ60
  const analyticsPopupWrapper: any = useRef(null);
  useEffect(() => {
    if (!analyticsPopupWrapper) return;
    const ga4Data = {
      event: "popup",
      popupId: analyticsPopupWrapper.current.id,
    };
    push({ ...ga4Data, action: "view" });

    return () => {
      push({ ...ga4Data, action: "close" });
    };
  }, [analyticsPopupWrapper]);

  return (
    // Analytics wrapper for GA4
    <div
      className="analytics-popup-wrapper h-100"
      id="newsletter_popup"
      ref={analyticsPopupWrapper}
    >
      <div
        className={`${handles.container__form} flex flex-column justify-center items-center pa5`}
      >
        {/* TITLE */}
        <h2 className={`${handles.form__title} mv4 tc`}>{title}</h2>

        {/* SUBTITLE TEXTS*/}
        {subtitles.map((subtitleText: any, i: number) => (
          <div
            className={`${handles["container__text-subtitle"]} tc`}
            key={`subtitle${i}`}
          >
            <RichText text={subtitleText?.__editorItemTitle} />
          </div>
        ))}

        <div className={`${handles.container__inputs} w-100`}>
          {/* EMAIL INPUT */}
          <div
            className={`${applyModifiers(
              handles["container__form-input"],
              errors.email && showErrors ? "error" : ""
            )} w-100 mb1`}
          >
            <Input
              id="Email"
              name="email"
              placeholder={
                emailPlaceholder ??
                formatMessage(messages.inputEmailPlaceholder)
              }
              label={showInputLabels && emailLabel}
              type="email"
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(e.target)
              }
              errorMessage={
                errors.email &&
                showErrors &&
                (!form.email ? errorRequiredField : errorInvalidMail)
              }
              onBlur={handleBlur}
            />
          </div>

          {/* NAME INPUT */}
          <div
            className={`${applyModifiers(
              handles["container__form-input"],
              errors.name && showErrors ? "error" : ""
            )} w-100 mb1`}
          >
            <Input
              id="Name"
              name="name"
              placeholder={
                namePlaceholder ?? formatMessage(messages.inputNamePlaceholder)
              }
              label={showInputLabels && nameLabel}
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(e.target)
              }
              errorMessage={errors.name && showErrors && errorRequiredField}
              onBlur={handleBlur}
            />
          </div>

          {/* SURNAME INPUT */}
          <div
            className={`${applyModifiers(
              handles["container__form-input"],
              errors.surname && showErrors ? "error" : ""
            )} w-100 mb1`}
          >
            <Input
              id="Surname"
              name="surname"
              placeholder={
                surnamePlaceholder ??
                formatMessage(messages.inputSurnamePlaceholder)
              }
              label={showInputLabels && surnameLabel}
              value={form.surname}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(e.target)
              }
              errorMessage={errors.surname && showErrors && errorRequiredField}
              onBlur={handleBlur}
            />
          </div>
        </div>

        {/* PRIVACY SECTION */}
        <div className={handles.container__privacy}>
          {/* PRIVACY TEXTS BEFORE CHECKBOXES */}
          {privacyPolicyTextArray.map((policyText: any, i: number) => (
            <div
              className={handles["container__text-privacy"]}
              key={`policy${i}`}
            >
              <RichText text={policyText.__editorItemTitle} />
            </div>
          ))}

          {/* CHECKBOXES CONTAINER */}
          <div
            id="checkbox-container"
            className={`${handles.container__checkboxes} flex flex-column justify-center items-left tj`}
          >
            {checkboxes?.map((item: CheckboxProps, index: number) => (
              <div
                className={`${applyModifiers(
                  handles["container__form-checkbox"],
                  errorCheckboxes[index] && showErrors ? "error" : ""
                )} mb4 f6`}
                id="checkbox-wrapper"
                key={`div-checkbox-${index}`}
              >
                <Checkbox
                  id={`custom-checkbox-${index}`}
                  name={item?.checkboxLabel}
                  label={<RichText text={item?.checkboxLabel} />}
                  value={checkboxesState[index]}
                  checked={checkboxesState[index]}
                  onChange={() => handleOnChangeCheckbox(index)}
                />
                {errorCheckboxes[index] && showErrors && (
                  <div className="c-danger t-small lh-title">
                    {profilingOptIn
                      ? errorProfOptinCheckbox
                      : item?.checkboxError}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* PRIVACY TEXTS AFTER CHECKBOXES */}
          {privacyPolicyTextArrayAfterCheckboxes.map(
            (policyText: any, i: number) => (
              <div
                className={handles["container__text-privacy"]}
                key={`second-policy${i}`}
              >
                <RichText text={policyText.__editorItemTitle} />
              </div>
            )
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div
          className={`${handles["container__btn-submit"]} ${
            handles[
              status === "SUCCESS"
                ? "container__btn-submit-disabled"
                : "container__btn-submit-enabled"
            ]
          }`}
        >
          {/* Show Spinner on LOADING Api call */}
          {status === "LOADING" ? (
            <Spinner />
          ) : (
            <Button onClick={handleSubmit} disabled={status === "SUCCESS"}>
              {handleButtonText()}
            </Button>
          )}
        </div>

        {/**
         * After Submit messages (if !successMessageInsideButton will be shown
         * only error message)
         */}
        {status && (
          <AfterSubmitMessages
            status={status}
            successMessageInsideButton={successMessageInsideButton}
            userMessages={{
              registeredErrorMessage,
              shouldLogInErrorMessage,
              successMessage,
              genericApiErrorMessage,
            }}
          />
        )}
      </div>
    </div>
  );
};

NewsletterForm.schema = {
  title: "Newsletter Form",
  description: "Form that let the user subscribe to Newsletter",
  type: "object",
  properties: {
    title: {
      title: "Form Title",
      description: "Set the text shown in the form title",
      type: "string",
    },
    subtitles: {
      type: "array",
      title: "Form Subtitles",
      items: {
        title: "Set texts of subtitle",
        type: "object",
        properties: {
          __editorItemTitle: {
            title:
              "Insert text to shown as subtitle (markdown language so it's like a RichText)",
            type: "string",
            widget: {
              "ui:widget": "textarea",
            },
          },
        },
      },
    },
    emailPlaceholder: {
      title: "Email Placeholder",
      description: "Set the text shown in email input placeholder",
      type: "string",
    },
    namePlaceholder: {
      title: "Name  Placeholder",
      description: "Set the text shown in name input placeholder",
      type: "string",
    },
    surnamePlaceholder: {
      title: "Surname Placeholder",
      description: "Set the text shown in surname input placeholder",
      type: "string",
    },
    showInputLabels: {
      title: "Show Input Labels",
      description: "Choose to show or not labels up to Input fields",
      type: "boolean",
    },
    emailLabel: {
      title: "Email Label",
      description: "Set the text shown in email input label",
      type: "string",
      required: ["showInputLabels"],
    },
    nameLabel: {
      title: "Name  Label",
      description: "Set the text shown in name input label",
      type: "string",
      required: ["showInputLabels"],
    },
    surnameLabel: {
      title: "Surname Label",
      description: "Set the text shown in surname input label",
      type: "string",
      required: ["showInputLabels"],
    },
    errorRequiredField: {
      title: "Error Required Field",
      description: "Error message to shown on required fields",
      type: "string",
    },
    errorInvalidMail: {
      title: "Error Invalid Mail",
      description: "Error message to shown on invalid email format",
      type: "string",
    },
    privacyPolicyTextArray: {
      type: "array",
      title: "Privacy Text",
      items: {
        title: "Text of privacyPolicy ",
        type: "object",
        properties: {
          __editorItemTitle: {
            title: "Insert text and link of privacy using markdown",
            type: "string",
            widget: {
              "ui:widget": "textarea",
            },
          },
        },
      },
    },
    checkboxes: {
      type: "array",
      title: "Checkboxes to show",
      items: {
        properties: {
          checkboxLabel: {
            title: "Checkbox Label",
            description: "Set the text shown right to the checkbox",
            type: "string",
            widget: {
              "ui:widget": "textarea",
            },
          },
          checkboxRequired: {
            title: "Checkbox Required",
            description:
              "Set true if this checkbox is required in order to submit form successfully",
            type: "boolean",
          },
          checkboxNewsletter: {
            title: "Checkbox Newsletter",
            description:
              "Set true if this checkbox is related to the Newsletter Optin (necessary to subscribe user to Newsletter)",
            type: "boolean",
          },
          checkboxProfiling: {
            title: "Checkbox Profiling",
            description:
              "Set true if this checkbox is related to the Profiling Optin (necessary to give profiling consent)",
            type: "boolean",
          },
          checkboxError: {
            title: "Checkbox Error",
            description:
              "Error message to shown under checkbox (this will be shown only if checkbox is required)",
            type: "string",
          },
        },
      },
    },
    errorProfOptinCheckbox: {
      title: "Error Prof Optin Checkbox",
      description:
        "Error message to shown if user checked profiling optin but didn't checked newsletter optin",
      type: "string",
      default:
        "To receive tailored messages, you also need to consent to marketing emails.",
    },
    privacyPolicyTextArrayAfterCheckboxes: {
      type: "array",
      title: "Privacy Text After Checkboxes",
      items: {
        title: "Text of privacyPolicy ",
        type: "object",
        properties: {
          __editorItemTitle: {
            title:
              "Insert text to shown after checkboxes (markdown language so it's like a RichText)",
            type: "string",
            widget: {
              "ui:widget": "textarea",
            },
          },
        },
      },
    },
    campaign: {
      title: "Campaign value",
      description: "Set the value of the campaign related to the form",
      default: "FORM_HP_PROMO_5%DISC",
      type: "string",
    },
    submitButtonText: {
      title: "Submit Button Text",
      description: "Set the text shown in the submit button",
      type: "string",
    },
    successMessageInsideButton: {
      title: "Success Messages Inside Submit Button",
      description:
        "Select to show or not after submit success message inside the submit button (if not it will be shown below the submit button)",
      default: true,
      type: "boolean",
    },
    successMessage: {
      title: "Success Message",
      description:
        "Message to display when the user successfully subscribe to newsletter",
      type: "string",
    },
    registeredErrorMessage: {
      title: "Registered Error Message",
      description:
        "Message to display when the user is already registered to newsletter",
      type: "string",
    },
    shouldLogInErrorMessage: {
      title: "Should Login Error Message",
      description:
        "Message to display when the user already has an account in VTEX, so to update the newsletter optin it needs to be logged in",
      type: "string",
    },
    genericApiErrorMessage: {
      title: "Generic API Error Message",
      description:
        "Message to display when the API call to subscribe User to newsletter goes wrong",
      type: "string",
    },
  },
};

export default NewsletterForm;
