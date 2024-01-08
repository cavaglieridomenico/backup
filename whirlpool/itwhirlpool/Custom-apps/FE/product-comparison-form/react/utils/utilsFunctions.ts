import { split, trim } from 'ramda'
import { defineMessages } from "react-intl";
/* 
  CONST FOR FORMATTED MESSAGES 
*/
export const messages = defineMessages({
  nameLabel: {
    defaultMessage: "",
    id: "store/product-comparison-form.name-label",
  },
  surnameLabel: {
    defaultMessage: "",
    id: "store/product-comparison-form.surname-label",
  },
  emailLabel: {
    defaultMessage: "",
    id: "store/product-comparison-form.email-label",
  },
  namePlaceholder: {
    defaultMessage: "",
    id: "store/product-comparison-form.name-placeholder",
  },
  surnamePlaceholder: {
    defaultMessage: "",
    id: "store/product-comparison-form.surname-placeholder",
  },
  emailPlaceholder: {
    defaultMessage: "",
    id: "store/product-comparison-form.email-placeholder",
  },
  successComparison: {
    defaultMessage: "",
    id: "store/product-comparison-form.success-comparison",
  },
  successOptin: {
    defaultMessage: "",
    id: "store/product-comparison-form.success-optin",
  },
  successOptinUserLogged: {
    defaultMessage: "",
    id: "store/product-comparison-form.success-optin-user-logged",
  },  
  errorComparison: {
    defaultMessage: "",
    id: "store/product-comparison-form.error-comparison",
  },
  errorOptin: {
    defaultMessage: "",
    id: "store/product-comparison-form.error-optin",
  },
  errorOptinUserAlreadyRegistered: {
    defaultMessage: "",
    id: "store/product-comparison-form.error-optin-user-already-registered",
  },
  errorOptinUserMustLogged: {
    defaultMessage: "",
    id: "store/product-comparison-form.error-optin-user-must-logged",
  },
  errorEmptyField: {
    defaultMessage: "",
    id: "store/product-comparison-form.error-empty-field",
  },
  errorInvalidMail: {
    defaultMessage: "",
    id: "store/product-comparison-form.error-invalid-mail",
  },
  errorRequiredField: {
    defaultMessage: "",
    id: "store/product-comparison-form.error-required-fields",
  }, 
});
/* 
  CONST FOR HANDLES 
*/
export const CSS_HANDLES = [
  'container',
  'container__form',
  'container__input',
  'container__input_name',
  'container__input_surname',
  'container__input_email',
  'container__checkbox',
  'container__button',
  'container__text_success',
  'container__text_error',
  'text__title',
  'text__description',
  'form__text-success',
  'button__submit',
  'skeleton',
  'skeleton__wrapper'
] as const
/* 
  Function used to split string with all specification
  to hide in the PDF sent to user after subscription
*/
export const splitString = (text?: string) => {
  if (!(text && text.length > 0)) {
    return []
  }

  return split(',', text)
    .filter((str: string) => str !== null && str !== '')
    .map((str: string) => trim(str))
}
/*
  Get session data (useful to check if user isLoggedIn)
*/
export const getSessionData = () => {
  return fetch('/api/sessions?items=*')
    .then((res: any) => res.json())
    .then(data => {
      return data?.namespaces?.profile
    })
}
/*
  Function to create user account in VTEX (register User mail) 
*/
export const putNewUser = async (
  email: string,
  campaign: string,
  optin: boolean,
  name?: string,
  surname?: string
) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      firstName: name,
      lastName: surname,
      campaign: campaign,
      isNewsletterOptIn: optin,
    }),
  }
  const fetchUrlPatch = '/_v/wrapper/api/user?userId=true'
  const response = await fetch(fetchUrlPatch, options);
  if(!response.ok) {
    throw new Error(`An error has occured: ${response.status}`);
  }
  return await response.json();
}
/*
  Get User Info from email 
*/
export const getIdUser = async (email: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const fetchUrl = `/_v/wrapper/api/user/email/userinfo?email=${email}`;
  const response = await fetch(fetchUrl, options);
  if(!response.ok) {
    throw new Error(`An error has occured: ${response.status}`);
  } 
  return await response.json();
}
/* 
  Set optin to user that isLoggedIn (so it has already an account)
  But didn't gave the consent to optin and now wants it
  Call this only if optin is flagged and user is loggedin 
*/
export const putNewOptinForUser = async () => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isNewsletterOptIn: true,
    }),
  }
  const fetchUrlPatch = '/_v/wrapper/api/user/newsletteroptin';
  const response = await fetch(fetchUrlPatch, options);
  if(!response.ok) {
    throw new Error(`An error has occured: ${response.status}`);
  }
  return response;
}
/*
  Subscribe User to Product Comparison mail
*/
export const postProductComparison = async (
  firstName: string,
  lastName: string,
  email: string,
  skuIds: string[],
  specificationsAvoided: string[]
) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      skuIds,
      specificationsAvoided
    }),
  }
  const fetchUrlPatch = '/v1/api/email/productsComparison';
  const response = await fetch(fetchUrlPatch, options);
  if(!response.ok) {
    throw new Error(`An error has occured: ${response.status}`);
  }
  return await response.json()
}
