import {defineMessages} from 'react-intl'
/*
  CONST MESSAGES FOR FORMATTED MESSAGES
*/
export const messages = defineMessages({
  userNameRequired: {
    id: "store/login-custom-flow.user-name-required",
    default: "VORNAME *"
  },
  userNamePlaceholder: {
    id: "store/login-custom-flow.user-name-placeholder",
    default: "Vorname"
  },
  userSurnameRequired: {
    id: "store/login-custom-flow.user-surname-required",
    default: "NACHNAME *"
  },
  userSurnamePlaceholder: {
    id: "store/login-custom-flow.user-surname-placeholder",
    default: "Nachname"
  },
  userEmailRequired: {
    id: "store/login-custom-flow.user-email-required",
    default: "E-MAIL *"
  },
  userEmailPlaceholder: {
    id: "store/login-custom-flow.user-email-placeholder",
    default: "beispiel@mail.de"
  },
  privacyPolicyDescription1: {
    id: "store/login-custom-flow.privacy-policy-description-1",
    default: "Ich verstehe und bestätige den Inhalt der "
  },
  privacyPolicy: {
    id: "store/login-custom-flow.privacy-policy",
    default: "Datenschutzerklärung"
  },
  privacyPolicyDescription2: {
    id: "store/login-custom-flow.privacy-policy-description-2",
    default: "und:"
  },
  privacyPolicyCheckDescription1: {
    id: "store/login-custom-flow.privacy-policy-check-description-1",
    default: "Ich stimme zu, personalisierte Werbemitteilungen in Bezug auf Bauknecht und andere Marken der Whirlpool Corporation zu erhalten."
  },
  privacyPolicyCheckLabel1: {
    id: "store/login-custom-flow.privacy-policy-check-label-1",
    default: "Ich stimme zu"
  }
});
/*
  FUNCTION TO REGISTER NEW USER IN VTEX
*/
export const putNewUser = (
  email: string,
  privacy: boolean,
  name?: string,
  surname?: string
) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      firstName: name,
      lastName: surname,
      isNewsletterOptIn: privacy,
    }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/user";
  return fetch(fetchUrlPatch, options).then((response) => response.json());
};
/* 
  FUNCTION TO GET USER INFO FROM EMAIL
*/
export const getIdUser = (email: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const fetchUrl = "/_v/wrapper/api/user/email/userinfo?email=" + email;
  return fetch(fetchUrl, options).then((response) => response.json());
};