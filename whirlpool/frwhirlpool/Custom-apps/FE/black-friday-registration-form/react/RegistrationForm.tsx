/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { useState, useReducer } from 'react'
import { Input, Checkbox } from 'vtex.styleguide'
// @ts-ignore
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from "react-intl";

interface RegistrationFormProps {
  title?: string
  textButton?: string
  textBeforeLink?: string
  textLink?: string
  textAfterLink?: string
  checkBoxText?: string,
  nameLabel?: string,
  surnameLabel?: string,
  emailLabel?: string,
  genericErrorMessage?: string,
  errorName?: string,
  errorSurname?: string,
  errorEmail?: string,
  errorCheckbox?: string,
  linkToPolicy?: string,
  successMessage?: string
}

interface WindowGTM extends Window {
  dataLayer: any[]
}

const CSS_HANDLES = [
  'formContainer',
  'inputContainer',
  'textInputContainer',
  'textInput',
  'nameInput',
  'errorMessage',
  'buttonContainer',
  'errorMessage',
  'button',
  'invalidButton',
  'label',
  'formTitle',
  'checkBoxes',
  'successClass',
  'loaderForm',
  'checked',
  'link',
] as const
interface UserErrors {
  name: boolean
  surname: boolean
  email: boolean
  checkbox: boolean
}

const reducer = (state: any, target: any) => ({
  ...state,
  [target.name]: target.value,
})
const initialForm = {
  name: '',
  surname: '',
  email: '',
}

const RegistrationForm: StorefrontFunctionComponent<RegistrationFormProps> = ({
  title,
  textButton = 'Send',
  nameLabel = "Name",
  surnameLabel = "Surname",
  emailLabel = "Email",
  errorName = "Name is requried",
  errorSurname = "Surname is requried",
  errorEmail = "Email is requried",
  errorCheckbox = "This field is mandatory",
  genericErrorMessage = "This field is required",
  textBeforeLink = 'I understand and take note of the content of the ',
  textLink = 'privacy policy',
  textAfterLink = 'and:',
  successMessage = "Thank you for registering!",
  linkToPolicy,
  checkBoxText = 'I consent to the processing of my personal data to allow Whirlpool Italia Srl to send me newsletters / marketing communications (in electronic and non-electronic form, also by telephone, traditional mail, e-mail, SMS, push notifications on third-party sites including on Facebook and Google platforms) regarding Whirlpool Italia Srl products and services, also purchased or registered by me, as well as to carry out market research. By registering I will be able to take advantage of a 5% discount valid on the first purchase made within 12 months of registration. Discount can be combined with other offers.',
}) => {
  const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];
  const [form, dispatch] = useReducer(reducer, initialForm)
  const [errors, setErrors] = useState<UserErrors>({
    name: false,
    surname: false,
    email: false,
    checkbox: false,
  })
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [optInCheck, setOptInCheck] = useState<boolean>(false)
  const [loading, setLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  const [success, setSuccess] = useState(false);

  const handles = useCssHandles(CSS_HANDLES)

  const newsletterUrl = window?.location?.href.split("?")[1];
  const targetCampaign = newsletterUrl
    ?.toString()
    .toUpperCase()
    .replace("=", "");

  const handleBlur = (e: any) => {
    setErrors({
      ...errors,
      [e.target.name]: !e.target.validity.valid,
    })
  }

  const formIsValid =
    Object.values(form).every(field => !!field) &&
    Object.values(errors).every(error => !error) &&
    optInCheck

  const putNewOptinForUser = () => {
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isNewsletterOptIn: true,
      }),
    };
    const fetchUrlPatch = "/_v/wrapper/api/user/newsletteroptin";
    return fetch(fetchUrlPatch, options).then((response) => response.json());
  };
  const putNewUser = (
    email: string,
    campaign: string,
    name?: string,
    surname?: string
  ) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        firstName: name,
        lastName: surname,
        isNewsletterOptIn: true,
        campaign: campaign,
      }),
    };
    const fetchUrlPatch = "/_v/wrapper/api/user?userId=true";
    return fetch(fetchUrlPatch, options).then((response) => response.json());
  };

  const getIdUser = (email: string) => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const fetchUrl = "/_v/wrapper/api/user/email/userinfo?email=" + email;
    return fetch(fetchUrl, options).then((response) => response.json());
  };

  const handleSubmit = (e: any) => {
    if (!formIsValid) {
      setErrors({
        name: !form.name,
        surname: !form.surname,
        email: !form.email,
        checkbox: !optInCheck,
      })
      return
    }

    setLoading(true);
    getIdUser(form.email).then((User: any) => {
      if (User.length && !User[0].isNewsletterOptIn) {
        fetch("/api/sessions?items=*")
          .then((response: any) => response.json())
          .then((res: any) => {
            if (
              res?.namespaces?.profile?.isAuthenticated?.value == "false"
            ) {
              setIsLogged(false);
            } else {
              putNewOptinForUser();
            }
            setLoading(false);
            setSuccess(true);
          });
      } else if (User.length > 0 && User[0].isNewsletterOptIn) {
        setLoading(false);
        setSuccess(false);
        setErrorMessage("Cet e-mail est déjà enregistré");
      } else {
        putNewUser(form.email, targetCampaign, form.name, form.surname).then(
          (repsonse: any) => {
            setErrorMessage('');
            setLoading(false);
            if (!repsonse.Message) {
              setSuccess(true);
              dataLayer.push({
                event: "userRegistration",
              });
              dataLayer.push({
                event: "optin_granted",
              });
              dataLayer.push({
                event: "leadGeneration",
                eventCategory: "Lead Generation",
                eventAction: "Optin granted",
                eventLabel: "Lead from newsletter",
                email: form.email,
              });
            }
          }
        );
      }
    });
    e.preventDefault();
    e.stopPropagation();

  }

  return (
    <div className={handles.formContainer}>
      {title && <h1 className={handles.formTitle}>{title}</h1>}
      <div className={handles.textInputContainer}>
        <Input
          id="Name"
          name="name"
          placeholder={nameLabel}
          value={form.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch(e.target)
          }
          required={true}
          errorMessage={errors.name && (errorName ?? genericErrorMessage)}
          onBlur={handleBlur}
        />
        <Input
          id="Surname"
          name="surname"
          placeholder={surnameLabel}
          value={form.surname}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch(e.target)
          }
          required={true}
          errorMessage={errors.surname && (errorSurname ?? genericErrorMessage)}
          onBlur={handleBlur}
        />
      </div>
      <Input
        id="Email"
        name="email"
        placeholder={emailLabel}
        type="email"
        value={form.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          dispatch(e.target)
        }
        required={true}
        errorMessage={errors.email && (errorEmail ?? genericErrorMessage)}
        onBlur={handleBlur}
      />
      <div className={optInCheck ? handles.checked : handles.checkBoxes}>
        {linkToPolicy && <label className={handles.label}>
          {textBeforeLink}
          <a
            target="_blank"
            href={linkToPolicy}
            className={handles.link}
          >
            {textLink}
          </a>{' '}
          {textAfterLink}
        </label>}
        <Checkbox
          checked={optInCheck}
          id="optin"
          onChange={(e: any) => {
            setOptInCheck(e.target.checked)
            setErrors({ ...errors, checkbox: !e.target.checked })
          }}
          handles
          required
          label={checkBoxText}
        />
        {errors.checkbox && (
          <span className={handles.errorMessage}>
            {errorCheckbox}
          </span>
        )}
      </div>

      {!loading ? (
        !success ? (
          <button
            id="user-bonus-registration-button"
            className={handles.button}
            onClick={handleSubmit}
          >
            {textButton}
          </button>
        ) : !isLogged ? (
          <div className={handles.errorMessage}>
            <FormattedMessage id="store/emailRegistered" />
          </div>
        ) : (
          <div className={handles.successClass}>
            {successMessage}
          </div>
        )
      ) : (
        <div className={handles.loaderForm}></div>
      )}
      {errorMessage && <h1 className={handles.errorMessage}>{errorMessage}</h1>}

    </div>
  )
}
RegistrationForm.schema = {
  title: "editor.registrationForm.title",
  description: "editor.registrationForm.description",
  type: "object",
  properties: {
    blockClass: {
      title: "blockClass",
      description: "css class",
      default: "",
      type: "string",
    },
    title: {
      title: "title",
      description: "Title before the form",
      default: "",
      type: "string",
    },
    textButton: {
      title: "textButton",
      description: "Text of the submit button",
      default: "Valider",
      type: "string",
    },
    nameLabel: {
      title: "nameLabel",
      description: "Label for name input",
      default: "Prenom",
      type: "string",
    },
    surnameLabel: {
      title: "surnameLabel",
      description: "Label for surname input",
      default: "Nom",
      type: "string",
    }, emailLabel: {
      title: "emailLabel",
      description: "Label for email input",
      default: "Email",
      type: "string",
    },
    errorName: {
      title: "errorName",
      description: "Label for errorName",
      default: "Le prenom est requis",
      type: "string",
    },
    errorSurname: {
      title: "errorSurname",
      description: "Label for errorsurname",
      default: "Le prenom est requis",
      type: "string",
    },
    errorEmail: {
      title: "errorEmail",
      description: "errorEmail",
      default: "L'e-mail est requis",
      type: "string",
    },
    errorCheckbox: {
      title: "errorCheckbox",
      description: "erroCheckbox",
      default: "Ce champ est obligatoire",
      type: "string",
    },
    genericErrorMessage: {
      title: "genericErrorMessage",
      description: "genericErrorMessage",
      default: "Ce champ est requis",
      type: "string",
    },
    checkBoxText: {
      title: "checkBoxText",
      description: "checkBoxText",
      default: "Je consens au traitement de mes données personnelles pour permettre à Whirlpool France S.A.S. de m'envoyer des bulletins d'information/communications marketing (sous forme électronique et non électronique, y compris par téléphone, courrier traditionnel, e-mail, SMS, MMS, notifications push sur des sites tiers, y compris sur les plateformes Facebook et Google) concernant les produits et services de Whirlpool France S.A.S. même achetés ou enregistrés par vous.",
      type: "string",
    },
    textAfterLink: {
      title: "textAfterLink",
      description: "textAfterLink",
      default: "",
      type: "string",
    },
    textBeforeLink: {
      title: "textBeforeLink",
      description: "textBeforeLink",
      default: "",
      type: "string",
    },
    textLink: {
      title: "textLink",
      description: "textLink",
      default: "",
      type: "string",
    },
    linkToPolicy: {
      title: "linkToPolicy",
      description: "linkToPolicy",
      default: "",
      type: "string",
    },
    successMessage: {
      title: "successMessage",
      description: "successMessage",
      default: "",
      type: "string",
    },
  },
}
export default RegistrationForm
