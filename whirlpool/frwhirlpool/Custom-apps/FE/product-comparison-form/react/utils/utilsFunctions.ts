import { split, trim, without } from 'ramda'
import { defineMessages } from "react-intl";

// const for Formatted Messages
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

/* CONS FOR HANDLES */
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

// Function used to split string with all specification
// to hide in the PDF sent to user after subscription
export const splitString = (text?: string) => {
  if (!(text && text.length > 0)) {
    return []
  }

  return split(',', text)
    .filter((str: string) => str !== null && str !== '')
    .map((str: string) => trim(str))
}

export const getProductSpecificationFields = (
  existing: string[],
  fieldsToHide?: string
) => {
  const removeList = splitString(fieldsToHide)

  return without(removeList, existing)
}

export const getSkuSpecificationFields = (
  existing: string[],
  fieldsToHide?: string
) => {
  const removeList = splitString(fieldsToHide)

  return without(removeList, existing)
}

export const getProductFields = (fieldsToHide?: string) => {
  const fieldNames = ['productName', 'brand', 'description', 'productReference']
  const removeList = splitString(fieldsToHide)
  const fieldsSelected = without(removeList, fieldNames)

  const fields = fieldsSelected.map((fieldName: string) => {
    let value = {}

    switch (fieldName) {
      case 'productName':
        value = {
          fieldType: 'ProductField',
          name: 'productName',
          displayValue: 'Product Name',
          showOnSite: true,
        }
        break

      case 'brand':
        value = {
          fieldType: 'ProductField',
          name: 'brand',
          displayValue: 'Brand',
          showOnSite: true,
        }
        break

      case 'description':
        value = {
          fieldType: 'ProductField',
          name: 'description',
          displayValue: 'Product Description',
          showOnSite: true,
        }
        break

      case 'productReference':
        value = {
          fieldType: 'ProductField',
          name: 'productReference',
          displayValue: 'Product Reference',
          showOnSite: true,
        }
        break

      default:
        value = {
          fieldType: '',
          name: '',
          displayValue: '',
          showOnSite: false,
        }
        break
    }
    //@ts-ignore
    return value as ComparisonField
  })

  return fields
}

export const getSkuFields = (fieldsToHide?: string) => {
  const fieldNames = ['name', 'ean']
  const removeList = splitString(fieldsToHide)
  const fieldsSelected = without(removeList, fieldNames)

  const fields = fieldsSelected.map((fieldName: string) => {
    let value = {}

    switch (fieldName) {
      case 'name':
        value = {
          fieldType: 'SkuField',
          name: 'name',
          displayValue: 'Sku Name',
          showOnSite: true,
        }
        break

      case 'ean':
        value = {
          fieldType: 'SkuField',
          name: 'ean',
          displayValue: 'Ean',
          showOnSite: true,
        }
        break

      default:
        value = {
          fieldType: '',
          name: '',
          displayValue: '',
          showOnSite: false,
        }
        break
    }
    //@ts-ignore
    return value as ComparisonField
  })

  return fields
}

// Get session data (useful to check if user isLoggedIn)
export const getSessionData = () => {
  return fetch('/api/sessions?items=*')
    .then((res: any) => res.json())
    .then(data => {
      return data?.namespaces?.profile
    })
}
// Function to create user account in VTEX
export const putNewUser = (
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
  return fetch(fetchUrlPatch, options).then(response => response)
}

// Get User Info from email
export const getIdUser = (email: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const fetchUrl = '/_v/wrapper/api/user/email/userinfo?email=' + email
  return fetch(fetchUrl, options).then(response => response.json())
}

// Set optin to user that isLoggedIn (so it has already an account)
// But didn't gave the consent to optin and now wants it
// Call this only if optin is flagged and user is loggedin
export const putNewOptinForUser = () => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      isNewsletterOptIn: true,
    }),
  }
  const fetchUrlPatch = '/_v/wrapper/api/user/newsletteroptin'
  return fetch(fetchUrlPatch, options).then(response => response)
}

// Subscribe User to Product Comparison mail
export const postProductComparison = (
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
  const fetchUrlPatch = '/app/sfmc/productsComparison'
  return fetch(fetchUrlPatch, options).then(response => response.json())
}
