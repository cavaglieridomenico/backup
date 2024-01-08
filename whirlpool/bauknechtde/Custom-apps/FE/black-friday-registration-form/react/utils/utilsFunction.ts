import { defineMessages } from "react-intl";
/*
  INTERFACES
*/
export interface RegistrationFormProps {
  campaignName?: string,
  formTopText?: string,
  namePlaceholder?: string,
  surnamePlaceholder?: string,
  emailPlaceholder?: string,
  submitBtnText?: string
  privacyText?: string,
  privacyText2: string,
  privacyLink: string,
  privacyLinkText: string,
  privacyText3: string,
  checkboxLabel?: string,
  emptyFieldErrorRequired?: string
  wrongEmail?: string
}
export interface WindowGTM extends Window {
  dataLayer: any[]
}
export interface UserErrors {
  name: boolean
  surname: boolean
  email: boolean
  checkbox: boolean
}
export interface UserMessage {
  successMessage: boolean,
  errorApiCall: boolean,
  errorAlreadyRegistered: boolean
}
/*
  FORMATTED MESSAGES
*/
export const messages = defineMessages({
  formTopText: {
    id: "store/black-friday-registration-form.form-text-top",
    default: "Lorem Ipsum dolor...Lorem Ipsum dolor...Lorem Ipsum dolor...Lorem Ipsum dolor...Lorem Ipsum dolor...ecc"
  },
  inputNamePlaceholder: {
    id: "store/black-friday-registration-form.input-name-placeholder",
    default: "Vorname *"
  },
  inputSurnamePlaceholder: {
    id: "store/black-friday-registration-form.input-surname-placeholder",
    default: "Nachname *"
  },
  inputEmailPlaceholder: {
    id: "store/black-friday-registration-form.input-email-placeholder",
    default: "E-mail *"
  },
  buttonSubmitText: {
    id: "store/black-friday-registration-form.button-submit-text",
    default: "Jetzanmelden"
  },
  checkboxOptinLabel: {
    id: "store/black-friday-registration-form.checkbox-optin-label",
    default: "Ich stimme zu, personalisierte Werbemitteilungen in Bezug auf Bauknecht und andere Marken der Whirlpool Corporation zu erhalten."
  },
  errorRequiredField: {
    id: "store/black-friday-registration-form.error-required-field",
    default: "Pflichtfeld darf nicht leer sein"
  },
  errorEmail: {
    id: "store/black-friday-registration-form.error-email",
    default: "Ungültige mail"
  },
  successMessage: {
    id: "store/black-friday-registration-form.success-message",
    default: "E-Mail korrekt registriert"
  },
  errorApiCallMessage: {
    id: "store/black-friday-registration-form.error-api-call-message",
    default: "E-Mail-Registrierung fehlgeschlagen"
  },
  errorUserAlreadyRegisteredMessage: {
    id: "store/black-friday-registration-form.error-user-already-registered-message",
    default: "Sie sind bereits registriert"
  },
})
/*
  HANDLES CONST FOR STYLE
*/
export const CSS_HANDLES = [
    'bf__container',
    'form__container',
    'inputContainer',
    'form__containerinputs',
    'form__container-input',
    'form__button-enabled',
    'form__container-btn',
    'form__checkBoxes',
    'form__checked',
    'form__text-top',
    'form__container-privacy',
    'form__privacy-text',
    'form__privacy-link',
    'form__container-row',
    'form__col-1',
    'form__col-2',
    'form__container-messages',
    'error__span-message',
    'success__span-message'
] as const;



export const getIdUser = (email: string) => {
  const options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
  };

  const fetchUrl = "/_v/wrapper/api/user/email/userinfo?email=" + email;
  return fetch(fetchUrl, options).then((response) => response.json());
};
/*
  FUNCTION TO GET SESSION DATA
  (USEFUL TO CHECK IF USER IS LOGGEDIN)
*/
export const getSessionData = () => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const fetchUrl = "/api/sessions?items=*"
  return fetch(fetchUrl,options).then(response => response.json());
}

export const putNewUser = (
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
          name: name,
          surname: surname,
          optin: true,
          sourceCampaign: campaign,
      }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/campaigns/signup";
  return fetch(fetchUrlPatch, options).then((response) => response.text());
};

/*
  FUNCTION TO PUT NEWSLETTER OPTIN TO USER
  (FOR LOGGEDIN AND ALREADY REGISTERED USERS)
*/
export const putNewOptinForUser = () => {
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
  return fetch(fetchUrlPatch, options).then((response) => response);
};
