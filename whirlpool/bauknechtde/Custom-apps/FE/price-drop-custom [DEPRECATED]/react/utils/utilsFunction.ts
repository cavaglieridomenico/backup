/*
  Function to set isNewsletterOptin to true on user
  loggedIn with isNewsletterOptin === false (this is
  possibile only if the user is loggedIn)
*/
import { defineMessages } from "react-intl"
export const messages = defineMessages({
  formTitle: {
    defaultMessage: "",
    id: "store/price-drop-custom.title-text"
  },
  namePlaceholder: {
    defaultMessage: "",
    id: "store/price-drop-custom.form-name-placeholder"
  },
  surnamePlaceholder: {
    defaultMessage: "",
    id: "store/price-drop-custom.form-surname-placeholder"
  },
  emailPlaceholder: {
    defaultMessage: "",
    id: "store/price-drop-custom.form-email-placeholder"
  },
  checkboxLabel: {
    defaultMessage: "",
    id: "store/price-drop-custom.form-checkbox-label"
  },
  submitBtnText: {
    defaultMessage: "",
    id: "store/price-drop-custom.submit-btn-text"
  },

  errorEmpty: {
    defaultMessage: "",
    id: "store/price-drop-custom.error-empty-field"
  },
  errorMail: {
    defaultMessage: "",
    id: "store/price-drop-custom.error-email-field"
  },
  errorAllRequiredFields: {
    defaultMessage: "",
    id: "store/price-drop-custom.error-all-required-field"
  },
  errorIsAlreadyRegisteredToNL: {
    defaultMessage: "",
    id: "store/price-drop-custom.error-isAlreadyRegisteredToNL"
  },
  errorMustBeLogeedIn: {
    defaultMessage: "",
    id: "store/price-drop-custom.error-must-be-loggedin"
  },
  errorRegisterToNL: {
    defaultMessage: "",
    id: "store/price-drop-custom.error-register-to-nl"
  },
  errorPriceDropAlert: {
    defaultMessage: "",
    id: "store/price-drop-custom.error-price-drop-alert"
  },
  successRegisteredToNL: {
    defaultMessage: "",
    id: "store/price-drop-custom.success-subscribed-to-nl"
  },
  successPriceDropAlert: {
    defaultMessage: "",
    id: "store/price-drop-custom.success-price-drop-alert"
  },


})

export const CSS_HANDLES = [
  'container',
  'container__title',
  'form__container',
  'form__container-inputs',
  'form__container-name',
  'form__container-surname',
  'form__container-email',
  'form__container-checkbox',
  'form__container-btn',
  'form__container-text',
  'form__text',
  'form__text-success',
  'form__text-error',
  'form__text-warning',
  'form__button-disabled',
  'form__button-enabled',
  'skeleton__wrapper',
  'skeleton'
] as const

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
  return fetch(fetchUrlPatch, options).then((response) => response.json());
};
/*
  Function to get current Session data, this is useful
  to check if the user is loggedIn
*/
export const getSessionData = () => {
  return fetch("/api/sessions?items=*")
    .then((res: any) => res.json())
    .then((data) => {
      return data?.namespaces?.profile;
    });
};
/*
  Function to get create user account in VTEX, this
  must be done if user isn't registered yet and if
  user flag the optIn checkbox
*/
export const putNewUser = (
  campaign: string,
  optin: Boolean,
  email: string,
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
        campaign: campaign,
        isNewsletterOptIn: optin,
      }),
  };
   //const fetchUrlPatch = "/_v/wrapper/api/campaigns/signup";
  const fetchUrlPatch = "/_v/wrapper/api/user?userId=true";
  return fetch(fetchUrlPatch, options).then((response) => response.text()
  );
};
/*
  Function to get User info passing the email
*/
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
  Function to check user status and what he can dod
*/
export const getOptinMessage = async (
  loggedin: boolean,
  email: string,
  firstName: string,
  surname: string,
  campaign: string
) => {

  // Get User data from email
  const userData = await getIdUser(email)
  // If User isLoggedIn
  if(loggedin) {
    // If loggedIn user has not the isNewsletterOptIn = true
    if(!userData[0]?.isNewsletterOptIn) {
      return await putNewOptinForUser()
      .then((response: any) => {
        if(response.status !== 200)
          return("errorUserMessage")
        else
          return("successUserCreated")
      })
    } else { // Otherwise loggedIn User is already registered to Newsletter
      return("errorUserAlreadyRegisteredToNewsletterMessage")
    }
  }
  else { // Else --> User isn't loggedIn

    // If --> User is already registered and has isNewsletterOptin = false
    if (userData?.length > 0 && !userData[0]?.isNewsletterOptIn) {
      // User need to be logged to change its marketing preferences
      return("errorUserMustBeLoggedMessage")
    }
    else if (userData?.length > 0 && userData[0]?.isNewsletterOptIn) { // Else If --> User is already registered and isNewsletter optin = true
      // You are already registered to Newsletter
      return("errorUserAlreadyRegisteredToNewsletterMessage")
    }
    else {  // Else --> New User so register the email
      return await putNewUser(
        campaign,
        true,
        email,
        firstName,
        surname,
      ).then((response : any) => {
        if(response.status !== 200)
          return("errorUserMessage")
        else
          return("successUserCreated")
      })
    }
  }

}


/**************** ONLY FOR BAUKNECHTDE ***********************/

export const putNewUserBKDE = (
  email: string,
  firstName: string,
  lastName: string,
  campaign: string,
  isNewsletterOptIn: Boolean,
) => {
  const options = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: firstName,
        surname: lastName,
        sourceCampaign: campaign,
        optin: isNewsletterOptIn,
      }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/campaigns/signup";
  return fetch(fetchUrlPatch, options).then((response) => response)
};


export const getOptinMessageBKDE = async (
  email: string,
  firstName: string,
  surname: string,
  campaign: string,
) => {

  return await putNewUserBKDE(
    email,
    firstName,
    surname,
    campaign,
    true,)
  .then((response: any) => {
    if(response.status !== 200)
      return("errorRegisterToNL")
    else
      return("successRegisteredToNL")
  })

}

export const getOptinMessageBKDEwithcontrol = async (
  loggedin: boolean,
  email: string,
  firstName: string,
  surname: string,
  campaign: string,
) => {

  // If User isLoggedIn
  if(loggedin) {
    // Update Newsletter Status
      return await putNewUserBKDE(
        email,
        firstName,
        surname,
        campaign,
        true,)
      .then((response: any) => {
        if(response.status !== 200)
          return("errorRegisterToNL")
        else
          return("successRegisteredToNL")
      })
  }
  else { // Else --> User isn't loggedIn

    // Get User data from email
    const userData = await getIdUser(email)

    // If --> User is already registered and has isNewsletterOptin = false
    if (userData?.length > 0 && !userData[0]?.isNewsletterOptIn) {
      //In this case in BKDE User don't need to be logged to change its marketing preferences
      //cause have double check by email
      return await putNewUserBKDE(
        email,
        firstName,
        surname,
        campaign,
        true,)
      .then((response: any) => {
        if(response.status !== 200)
          return("errorRegisterToNL")
        else
          return("successRegisteredToNL")
      })
    }
    if (userData?.length > 0 && userData[0]?.isNewsletterOptIn) {
      // User previously optin click again optin, msg: success subscription
      return("successRegisteredToNL")
    }

    else {  // Else --> New User so register the email
      return await putNewUserBKDE(
        email,
        firstName,
        surname,
        campaign,
        true).then((response : any) => {
        if(response.status !== 200)
          return("errorRegisterToNL")
        else
          return("successRegisteredToNL")
      })
    }
  }

}
