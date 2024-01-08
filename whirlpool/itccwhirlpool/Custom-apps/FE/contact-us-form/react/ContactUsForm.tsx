import React, { useState } from 'react'
import style from './styles.css'
import UserForm from './components/UserForm'
import DatasForFetch from './datasForFetch'
import FormSuccess from './components/FormSuccess'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { usePixel } from "vtex.pixel-manager";

interface ContactUsFormProps {
  showCheckboxSection: boolean
  showProductInfoHelp: boolean
}

const ContactUsForm: StorefrontFunctionComponent<ContactUsFormProps> = ({
  showCheckboxSection,
  showProductInfoHelp
}) => {
  const { push } = usePixel();
  const [isSubmitted, setIsSubmitted]: any = useState(false)
  const [isLoading, setIsLoading]: any = useState({
    fetchLoading: false,
    fetchResponse: true
  })
  const { binding } = useRuntime()

  function submitForm(values: any) {
    setIsLoading({...isLoading, fetchLoading: true}) 
    fetch('/api/dataentities/CU/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(DatasForFetch(values, binding.id)),
    })
      .then(response => {
        push({ event: "formSubmission" });
        setIsLoading({...isLoading, fetchLoading: false, fetchResponse: response.ok}) 
        setIsSubmitted(response.ok)
      })
      .catch(() => {
        setIsLoading({...isLoading, fetchLoading: false, fetchResponse: false}) 
      })
  }

  return (
    <>
      {!isSubmitted ? (
        <div className={style.formContainer}>
          <h1 className={style.title}>
            <FormattedMessage
                id="store/contact-us-form.formTitle"
            />
          </h1>
          <UserForm submitForm={submitForm} isLoading={isLoading} showCheckboxSection={showCheckboxSection} showProductInfoHelp={showProductInfoHelp}/>
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
  }
}

export default ContactUsForm
