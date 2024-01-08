import { split, trim, without } from 'ramda'
import { defineMessages } from 'react-intl'

// const for Formatted Messages
export const messages = defineMessages({
  nameLabel: {
    defaultMessage: '',
    id: 'store/product-comparison-form.name-label',
  },
  surnameLabel: {
    defaultMessage: '',
    id: 'store/product-comparison-form.surname-label',
  },
  emailLabel: {
    defaultMessage: '',
    id: 'store/product-comparison-form.email-label',
  },
  namePlaceholder: {
    defaultMessage: '',
    id: 'store/product-comparison-form.name-placeholder',
  },
  surnamePlaceholder: {
    defaultMessage: '',
    id: 'store/product-comparison-form.surname-placeholder',
  },
  emailPlaceholder: {
    defaultMessage: '',
    id: 'store/product-comparison-form.email-placeholder',
  },
  submitBtnText: {
    defaultMessage: '',
    id: 'store/product-comparison-form.submit-btn-text',
  },
  successComparison: {
    defaultMessage: '',
    id: 'store/product-comparison-form.success-comparison',
  },
  errorComparison: {
    defaultMessage: '',
    id: 'store/product-comparison-form.error-comparison',
  },
  successNewsletter: {
    defaultMessage: '',
    id: 'store/product-comparison-form.success-newsletter',
  },
  successNewsletterLoggedIn: {
    defaultMessage: '',
    id: 'store/product-comparison-form.success-newsletter-logged-in',
  },
  errorNewsletter: {
    defaultMessage: '',
    id: 'store/product-comparison-form.error-newsletter',
  },
  errorNewsletterAlreadyRegistered: {
    defaultMessage: '',
    id: 'store/product-comparison-form.error-newsletter-already-registered',
  },
  errorNewsleterMustLoggedIn: {
    defaultMessage: '',
    id: 'store/product-comparison-form.error-newsletter-must-logged-in',
  },
  errorEmptyField: {
    defaultMessage: '',
    id: 'store/product-comparison-form.error-empty-field',
  },
  errorInvalidMail: {
    defaultMessage: '',
    id: 'store/product-comparison-form.error-invalid-mail',
  },
  errorRequiredField: {
    defaultMessage: '',
    id: 'store/product-comparison-form.error-required-fields',
  },
})

/* CONS FOR HANDLES */
export const CSS_HANDLES = [
  'container',
  'container__form',
  'container__inputs',
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
  'text__message-success',
  'button__submit',
  'skeleton',
  'skeleton__wrapper',
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

/**
 * consts for AppSettings
 */
export const appInfos = {
  // vendor: "whirlpoolemea",
  vendor: 'whirlpoolemea',
  appName: 'product-comparison-form',
  version: '0.x',
}

interface GetApiCall {
  endpoint: string
}
interface PostApiCallNewsletter {
  endpoint: string
  bodyKeys: NewsletterKeys
}
type NewsletterKeys = {
  items: NewsletterBodyKeys[]
}
type NewsletterBodyKeys = {
  name: string
  surname: string
  email: string
  campaign: string
  optin: string
}
interface PostApiCallComparison {
  endpoint: string
  bodyKeys: ComparisonBodyKeys
}
type ComparisonBodyKeys = {
  items: ComparisonKeys[]
}
type ComparisonKeys = {
  firstName: string
  lastName: string
  email: string
  skuIds: string
  specificationsAvoided: string
}
interface PatchApiCall {
  endpoint: string
  bodyKeys: NewsletterOptinBodyKeys
}
type NewsletterOptinBodyKeys = {
  items: NewsletterOptinKeys[]
}
type NewsletterOptinKeys = {
  optin: string
}

export interface AppSettings {
  userSessionApi: GetApiCall
  newsletterSubscribeApi: PostApiCallNewsletter
  userInfoApi: GetApiCall
  newsletterOptinApi: PatchApiCall
  comparisonSubscribeApi: PostApiCallComparison
}
