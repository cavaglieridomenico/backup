import { defineMessages } from 'react-intl'
/**
 * messages for FormattedMessages
 */
export const messages = defineMessages({
  namePlaceholder: {
    defaultMessage: '',
    id: 'store/price-drop-custom.form-name-placeholder',
  },
  surnamePlaceholder: {
    defaultMessage: '',
    id: 'store/price-drop-custom.form-surname-placeholder',
  },
  emailPlaceholder: {
    defaultMessage: '',
    id: 'store/price-drop-custom.form-email-placeholder',
  },
  submitBtn: {
    defaultMessage: '',
    id: 'store/price-drop-custom.submit-button-text',
  }
})
/**
 * CSS_HANDLES for style with CSS HANDLES
 */
export const CSS_HANDLES = [
  'form__container',
  'container__title',
  'container__text-subtitle',
  'form__container-inputs',
  'form__container-name',
  'form__container-surname',
  'form__container-email',
  'container__privacy',
  'container__text-privacy',
  'form__container-checkbox',
  'form__checkbox',
  'form__container-btn',
  'form__button-disabled',
  'form__button-enabled',
  'container__text-messages',
  'form__container-text',
  'text__message-success',
  'text__message-error',
  'text__message-warning',
  'skeleton__wrapper',
  'skeleton',
] as const
/**
 * consts for AppSettings
 */
export const appInfos = {
  vendor: 'whirlpoolemea',
  appName: 'price-drop-custom',
  version: '0.x',
}

export interface AppSettings {
  sessionApi: string
  userInfoApi: string
  postUserApi: string
  newsletteroptinApi: string
}
