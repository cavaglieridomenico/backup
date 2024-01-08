import { defineMessages } from 'react-intl'
export const messages = defineMessages({
  formTitle: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.form-title',
  },
  namePlaceholder: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.name-placeholder',
  },
  surnamePlaceholder: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.surname-placeholder',
  },
  emailPlaceholder: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.email-placeholder',
  },
  backInStockCheckbox: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.back-in-stock-checkbox',
  },
  optinCheckbox: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.optin-checkbox',
  },
  submitButton: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.submit-button',
  },
  invalidMail: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.invalid-email',
  },
  successNotifyMessage: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.success-notify-message',
  },
  successNewsletterMessage: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.success-newsletter-message',
  },
  successNewUser: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.success-new-user',
  },
  successNotifyAndNewsletterMessage: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.success-notify-and-newsletter-message',
  },
  errorNewsletterMessage: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.error-newsletter-message',
  },
  errorAlreadyRegistered: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.error-already-registered',
  },
  errorNotifyMessage: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.error-notify-message',
  },
  errorRequired: {
    defaultMessage: '',
    id: 'store/availability-subscriber-custom.error-required',
  },
  errorSubmitEmpty: {
    id: 'store/availability-subscriber-custom.error-submit-empty',
  },
  errorMustBeLogged: {
    id: 'store/availability-subscriber-custom.error-must-be-logged',
  },
})

export const getSessionData = async () => {
  let res = await fetch('/api/sessions?items=*')
  let resJson = await res.json()
  return resJson?.namespaces?.profile
}

export const putNewUser = async (
  campaign: string,
  optin: boolean,
  email: string,
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
  const res = await fetch('/_v/wrapper/api/user?userId=true', options)
  return res
}

export const getIdUser = async (email: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const res = await fetch(
    `/_v/wrapper/api/user/email/userinfo?email=${email}`,
    options
  )
  return await res.json()
}

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
  const res = await fetch('/_v/wrapper/api/user/newsletteroptin', options)
  return res
}
