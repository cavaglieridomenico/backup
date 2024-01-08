import { defineMessages } from "react-intl";

/**
 * messages const for FormattedMessages
 */
export const messages = defineMessages({
  inputEmailPlaceholder: {
    id: "store/newsletter-popup-custom.input-email-placeholder",
  },
  inputNamePlaceholder: {
    id: "store/newsletter-popup-custom.input-name-placeholder",
  },
  inputSurnamePlaceholder: {
    id: "store/newsletter-popup-custom.input-surname-placeholder",
  },
  requiredField: {
    id: "store/newsletter-popup-custom.required-field",
  },
  requiredCheckbox: {
    id: "store/newsletter-popup-custom.required-checkbox",
  },
  privacyLink: {
    id: "store/newsletter-popup-custom.privacy-link",
  },
  newsletterButtonText: {
    id: "store/newsletter-popup-custom.newsletter-button-text",
  },
  submitButtonText: {
    id: "store/newsletter-popup-custom.submit-button-text",
  },
});
/**
 * CSS_HANDLES const for handles classes
 * used for style
 */
export const CSS_HANDLES = [
  "container__form",
  "container__form-input",
  "container__form-checkbox",
  "container__inputs",
  "container__privacy",
  "container__checkboxes",
  "form__title",
  "container__text-subtitle",
  "container__text-privacy",
  "container__text-messages",
  "container__btn",
  "container__btn-submit",
  "container__btn-submit-enabled",
  "container__btn-submit-disabled",
  "text__message-success",
  "text__message-error",
] as const;

/**
 * appInfos const used in the GraphQL query
 * to get app settings
 */
export const appInfos = {
  vendor: "whirlpoolemea",
  appName: "newsletter-custom-app",
  version: "0.x",
};
/**
 * interface for the AppSettings
 */
export interface AppSettings {
  sessionApi: string;
  userInfoApi: string;
  postUserApi: string;
  newsletteroptinApi: string;
}
