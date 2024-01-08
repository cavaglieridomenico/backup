import React, { useState } from 'react'
import style from './styles.css'
import UserForm from './components/UserForm'
import DatasForFetch from './datasForFetch'
import FormSuccess from './components/FormSuccess'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'

interface ContactUsFormProps {
  showCheckboxSection: boolean
  showProductInfoHelp: boolean
  errorEmpty: string
  errorZip: string
  errorEmail: string
  regexZipCode?: any
  reasons: []
  bindingByTheme: any
  bindingByTheme2: any
  bindingByTheme3: any
  locale: any
  prodInfoTitle?: string
  prodInfoDesc?: []
  prodCodeDesc?: []
  prodCodeTitle?: string
  privacyPolicyText?: []
  acceptTermPrivacyText?: []
  apiAccountSigle: string
  telephonePlaceholder: any
  emailPlaceholder: any
  datePickerCountry: string
  datePickerPlaceholder: string
  isTelephoneRequired: boolean
}

const ContactUsForm: StorefrontFunctionComponent<ContactUsFormProps> = ({
  showCheckboxSection,
  showProductInfoHelp,
  regexZipCode,
  reasons,
  bindingByTheme,
  bindingByTheme2,
  bindingByTheme3,
  locale,
  prodInfoTitle,
  prodInfoDesc,
  prodCodeTitle,
  prodCodeDesc,
  privacyPolicyText,
  acceptTermPrivacyText,
  apiAccountSigle,
  telephonePlaceholder = '+39',
  emailPlaceholder = 'latuaemail@esempio.com',
  datePickerCountry = 'it',
  datePickerPlaceholder = 'GG/MM/AAAA',
  isTelephoneRequired = false
}) => {
  const { push } = usePixel()
  const [isSubmitted, setIsSubmitted]: any = useState(false)
  const [isLoading, setIsLoading]: any = useState({
    fetchLoading: false,
    fetchResponse: true,
  })
  const { binding } = useRuntime()

  function submitForm(values: any) {
    setIsLoading({ ...isLoading, fetchLoading: true })

    //CT come from theme
    fetch(`/api/dataentities/${apiAccountSigle}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        DatasForFetch(
          values,
          binding.id,
          bindingByTheme,
          bindingByTheme2,
          bindingByTheme3,
          locale
        )
      ),
    })
      .then(response => {
        //GA4FUNREQ19
        const ga4Data = {
          serviceReason: getEnglishReasonValue(values?.Reason),
          type: 'support',
        }
        push({ event: 'ga4-serviceContactFormSubmit', ga4Data })

        //GA4FUNREQ61
        if (values?.WhirlpoolCommunication) {
          push({
            event: 'ga4-optin',
          })
        }

        push({ event: 'formSubmission' })
        setIsLoading({
          ...isLoading,
          fetchLoading: false,
          fetchResponse: response.ok,
        })
        setIsSubmitted(response.ok)
      })
      .catch(() => {
        setIsLoading({
          ...isLoading,
          fetchLoading: false,
          fetchResponse: false,
        })
      })
  }

  return (
    <>
      {!isSubmitted ? (
        <div className={style.formContainer}>
          <p className={style.title}>
            <FormattedMessage id="store/contact-us-form.formTitle" />
          </p>
          <UserForm
            submitForm={submitForm}
            isLoading={isLoading}
            showCheckboxSection={showCheckboxSection}
            showProductInfoHelp={showProductInfoHelp}
            regexZipCode={regexZipCode}
            reasons={reasons}
            prodInfoTitle={prodInfoTitle}
            prodInfoDesc={prodInfoDesc}
            prodCodeTitle={prodCodeTitle}
            prodCodeDesc={prodCodeDesc}
            privacyPolicyText={privacyPolicyText}
            acceptTermPrivacyText={acceptTermPrivacyText}
            telephonePlaceholder={telephonePlaceholder}
            emailPlaceholder={emailPlaceholder}
            datePickerCountry={datePickerCountry}
            datePickerPlaceholder={datePickerPlaceholder}
            isTelephoneRequired={isTelephoneRequired}
          />
        </div>
      ) : (
        <FormSuccess />
      )}
    </>
  )
}

ContactUsForm.schema = {
  title: 'Contact Us Form',
  description: 'contuct us form',
  type: 'object',
  properties: {
    showCheckboxSection: {
      title: 'showCheckboxSection',
      description: 'Whether to show or not the checkbox section',
      type: 'boolean',
      default: true,
    },

    showProductInfoHelp: {
      title: 'showProductInfoHelp',
      description: 'Whether to show or not the ProductInfoHelp section',
      type: 'boolean',
      default: true,
    },

    prodInfoTitle: {
      title: 'Product Info Title',
      description: '',
      type: 'string',
      default: '',
    },

    prodInfoDesc: {
      type: 'array',
      title: 'Description below products info title',
      items: {
        title: 'Text of description',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text of description',
            type: 'string',
          },
        },
      },
    },

    prodCodeTitle: {
      title: 'Product-code Title',
      description: '',
      type: 'string',
      default: '',
    },

    prodCodeDesc: {
      type: 'array',
      title: 'Description below products code title',
      items: {
        title: 'Text of description',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text of description',
            type: 'string',
          },
        },
      },
    },

    privacyPolicyText: {
      type: 'array',
      title: 'Privacy Text',
      items: {
        title: 'Text of privacyPolicy ',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text and link of privacy',
            type: 'string',
          },
        },
      },
      'ui:widget': 'textarea',
    },
    isTelephoneRequired: {
      title: 'Is the Telephone field required?',
      description: 'Whether to mark the telephone field as required',
      type: 'boolean',
      default: false,
    },

    // telephonePlaceholder: {
    //   title: 'Insert phone prefix placeholder to be shown for personal data',
    //   description: '',
    //   type: 'any',
    //   default: '+39',
    // },

    // emailPlaceholder:{
    //   title: 'Insert email placeholder to be shown for personal data',
    //   description: '',
    //   type: 'any',
    //   default: 'example@email.com',
    // },

    // datePickerPlaceHolder: {
    //   title: 'Insert date picker placeholder to be shown for product data',
    //   description: '',
    //   type: 'string',
    //   default: 'DD/MM/YYYY',
    // },

    acceptTermPrivacyText: {
      type: 'array',
      title: 'Checkboxes to print',
      items: {
        properties: {
          checkboxTitle: {
            title: 'checkbox Title',
            type: 'string',
          },
        },
      },
    },
  },
}

//GA4FUNREQ19 fix for english text in serviceReason
function getEnglishReasonValue(reason: string): string
{
  if(reason === "Informazioni sui prodotti")
    return "Information about products";
  if(reason === "Informazioni acquisti online sul sito www.whirlpool.it")
    return "Informations about online shopping at www.whirlpool.it";
  if(reason === "Richiesta assistenza tecnica su prodotto 0-24 mesi")
    return "Request for technical support on product 0-24 months";
  if(reason === "Richiesta assistenza tecnica su prodotto con più di 24 mesi")
    return "Request for technical support on product after 24 months";
  if(reason === "Richiesta assistenza tecnica su prodotto coperto da estensione di assistenza")
    return "Request for technical support on product with extended warrently";
  if(reason === "Informazioni/Segnalazioni intervento in corso")
    return "Information about on-going operation";
  if(reason === "Spostare, modificare o cancellare un appuntamento")
    return "Update or cancel an appointment";
  if(reason === "Aggiornare /cancellare dati personali (gestione privacy) / GDPR cancellazione account")
    return "Update or cancel personal data (privacy) / GDPR account deletion";

  return "Missing english translation for the specified reason";
}

export default ContactUsForm
