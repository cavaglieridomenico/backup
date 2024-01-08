import React from 'react'
import { useIntl } from "react-intl";
import { useState } from 'react';
import { useMutation } from "react-apollo";
import CREATE_DOCUMENT from "./graphql/createDocument.graphql";
import { Button, Dropdown, Input, Textarea } from "vtex.styleguide";
import { useCssHandles } from 'vtex.css-handles'
interface SupportFormProps {
    supportFormTitle: string;
    supportFormSubtitle: string;
    nameSurnameLabel: string;
    nameSurnamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    accessType: any[];
    accessTypeLabel: string;
    accessTypePlaceholder: string;
    support: any[];
    supportLabel: string;
    supportPlaceholder: string;
    additionalDetailsLabel: string;
    additionalDetailsPlaceholder: string;
    buttonText: string;
}

const CSS_HANDLES = [
  "supportForm",
  "supportFormWrapper",
  "supportFormTitle",
  "supportFormSubtitle",
  "row",
  "buttonRow",
  "submitButton",
  "supportThanks",
  "supportTitle",
  "supportSubtitle",
  "additionalSupport",
  "additionalSupportText",
  "additionalSupportLink"
];

let showThankyouMessage = false;


const SupportForm: StorefrontFunctionComponent<SupportFormProps> = ({
  supportFormTitle,
  supportFormSubtitle,
  nameSurnameLabel,
  nameSurnamePlaceholder,
  emailLabel,
  emailPlaceholder,
  accessType,
  accessTypeLabel,
  accessTypePlaceholder,
  support,
  supportLabel,
  supportPlaceholder,
  additionalDetailsLabel,
  additionalDetailsPlaceholder,
  buttonText
}) => {
  const intl = useIntl();
  const handles = useCssHandles(CSS_HANDLES);
  const [createDocument, { loading }] = useMutation(CREATE_DOCUMENT, {
    onCompleted: () => {
      showThankyouMessage = true;
    },
    onError: () => {
      console.log("error");
    },
  });
  const [inputValues, setInputValues] = useState({
    nameSurname: "",
    email: "",
    accessType: "",
    support: "",
    additionalDetails: "",
  });

  const [formErrors, setErrors] = useState({
    nameSurnameError: "",
    emailError: "",
    accessTypeError: "",
    supportError: ""
  });

  const formattedOptions = (options: any) => {
    return options?.map((el: any) => {
      return {value: el.option, label: el.option}
    })
  }
  const validateForm = () => {
    let hasError = false;
    setErrors(prevState => ({...prevState, nameSurnameError: "", emailError: "", accessTypeError: "", supportError: ""}));
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;

    if (!emailRegex.test(inputValues.email) && inputValues.email !== "") {
      setErrors(prevState => ({
        ...prevState,
        emailError: intl.formatMessage({
          id: "store/support-form.errors.invalid-email",
        }),
      }));
      hasError = true;
    } else if (inputValues.email === "") {
      setErrors(prevState => ({
        ...prevState,
        emailError: intl.formatMessage({
          id: "store/support-form.errors.empty-field",
        }),
      }));
      hasError = true;
    }

    if (inputValues.nameSurname === "") {
      setErrors((prevState) => ({
        ...prevState,
        nameSurnameError: intl.formatMessage({
          id: "store/support-form.errors.empty-field",
        }),
      }));
      hasError = true;
    }

    if (inputValues.accessType === "") {
      setErrors((prevState) => ({
        ...prevState,
        accessTypeError: intl.formatMessage({
          id: "store/support-form.errors.empty-field",
        }),
      }));
      hasError = true;
    }

    if (inputValues.support === "") {
      setErrors((prevState) => ({
        ...prevState,
        supportError: intl.formatMessage({
          id: "store/support-form.errors.empty-field",
        }),
      }));
      hasError = true;
    }

    return hasError;
  }

  const handleSubmitSupport = (e: any) => {
    e.preventDefault();
    const hasErrors = validateForm()
    if (!hasErrors) {
      createDocument({variables: {acronym: "SF", document: {fields:[
        {
          key:'email', 
          value: inputValues.email
        },
        {
          key: 'nameSurname',
          value: inputValues.nameSurname
        },
        {
          key: 'accessType',
          value: inputValues.accessType
        },
        {
          key: 'support',
          value: inputValues.support
        },
        {
          key: 'additionalDetails',
          value: inputValues.additionalDetails
        }
      ]}}});
    }
  }
  
  if (loading) {
    return <></>;
  } else if (showThankyouMessage) {
    return (
      <div className={handles.supportForm}>
        <div className={handles.supportFormWrapper}>
          <div className={handles.supportFormTitle}>{supportFormTitle}</div>
          <div className={handles.supportThanks}>
            <img src="https://ukccwhirlpool.vteximg.com.br/arquivos/typ.png" />
            <div>
              <div className={handles.supportTitle}>
                {intl.formatMessage({ id: "store/support-form.receive" })}
              </div>
              <div className={handles.supportSubtitle}>
                {intl.formatMessage({ id: "store/support-form.notify" })}
              </div>
            </div>
          </div>
          <div className={handles.additionalSupport}>
            <p className={handles.additionalSupportText}>
              Need additional Support?
            </p>
            <a
              className={handles.additionalSupportLink}
              href="mailto:MDL-UK.D2C@whirlpool.com"
            >
              MDL-UK.D2C@whirlpool.com
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={handles.supportForm}>
        <div className={handles.supportFormWrapper}>
          <div className={handles.supportFormTitle}>{supportFormTitle}</div>
          <div className={handles.supportFormSubtitle}>
            {supportFormSubtitle}
          </div>
          <form onSubmit={(e: any) => handleSubmitSupport(e)}>
            <div className={handles.row}>
              <Input
                type="text"
                label={nameSurnameLabel}
                name="nameSurname"
                placeholder={nameSurnamePlaceholder}
                errorMessage={formErrors.nameSurnameError}
                onChange={(e: any) =>
                  setInputValues({
                    ...inputValues,
                    nameSurname: e.target.value,
                  })
                }
              />
              <Input
                type="email"
                label={emailLabel}
                name="email"
                placeholder={emailPlaceholder}
                errorMessage={formErrors.emailError}
                onChange={(e: any) =>
                  setInputValues({ ...inputValues, email: e.target.value })
                }
              />
            </div>
            <div className={handles.row}>
              <Dropdown
                label={accessTypeLabel}
                name="accessType"
                placeholder={accessTypePlaceholder}
                errorMessage={formErrors.accessTypeError}
                value={inputValues.accessType}
                onChange={(e: any) =>
                  setInputValues({ ...inputValues, accessType: e.target.value })
                }
                options={formattedOptions(accessType)}
              />
              <Dropdown
                label={supportLabel}
                name="support"
                placeholder={supportPlaceholder}
                value={inputValues.support}
                errorMessage={formErrors.supportError}
                onChange={(e: any) =>(
                  setInputValues({
                    ...inputValues,
                    support: e.target.value,
                  })
                )}
                options={formattedOptions(support)}
              />
            </div>
            <div className={handles.row}>
              <Textarea
                label={additionalDetailsLabel}
                name="additionalDetails"
                placeholder={additionalDetailsPlaceholder}
                onChange={(e: any) =>
                  setInputValues({
                    ...inputValues,
                    additionalDetails: e.target.value,
                  })
                }
              />
            </div>
            <div className={handles.buttonRow}>
              <Button
                type="submit"
                onClick={(e: any) => handleSubmitSupport(e)}
              >
                {buttonText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

SupportForm.schema = {
  title: "Support form",
  description: "Form to request help",
  type: "object",
  properties: {
    supportFormTitle: {
      title: "Support form title",
      type: "string",
      description: "Support form title",
      default: "Access support request form",
    },
    supportFormSubtitle: {
      title: "Support form subtitle",
      type: "string",
      description: "Support form subtitle",
      default:
        "We're sorry to see you here. Please fill the form below, we''l promptly evaluate your case and get in touch.",
    },
    nameSurnameLabel: {
      title: "Name and Surname label",
      type: "string",
      description: "name and surname label",
      default: "Name and surname",
    },
    nameSurnamePlaceholder: {
      title: "Name and Surname placeholder",
      type: "string",
      description: "name and surname placeholder",
      default: "Name and surname",
    },
    emailLabel: {
      title: "Email label",
      type: "string",
      description: "Email label",
      default: "Contact e-mail",
    },
    emailPlaceholder: {
      title: "Email placeholder",
      type: "string",
      description: "Email placeholder",
      default: "E-mail",
    },
    accessType: {
      title: "Access type",
      type: "array",
      description: "Access type",
      items: {
        properties: {
          option: {
            title: "option",
            default: "",
            type: "string",
          },
        },
      },
    },
    accessTypeLabel: {
      title: "Access type label",
      type: "string",
      description: "Access type label",
      default: "Access type",
    },
    accessTypePlaceholder: {
      title: "Access type placeholder",
      type: "string",
      description: "Access type placeholder",
      default: "Partner company",
    },
    support: {
      title: "Needed Support",
      type: "array",
      description: "Needed type",
      items: {
        properties: {
          option: {
            title: "option",
            default: "",
            type: "string",
          },
        },
      },
    },
    supportLabel: {
      title: "Needed support label",
      type: "string",
      description: "Needed support label",
      default: "Needed Support",
    },
    supportPlaceholder: {
      title: "Access type placeholder",
      type: "string",
      description: "Access type placeholder",
      default: "My company ID doesn't work",
    },
    additionalDetailsLabel: {
      title: "Additional details label",
      type: "string",
      description: "Additiona details label",
      default: "Addition details (optional)",
    },
    additionalDetailsPlaceholder: {
      title: "Additional details placeholder",
      type: "string",
      description: "Additional details placeholder",
      default: "Description",
    },
    buttonText: {
      title: "Button text",
      type: "string",
      description: "Button text",
      default: "Submit",
    },
  },
};

export default SupportForm

