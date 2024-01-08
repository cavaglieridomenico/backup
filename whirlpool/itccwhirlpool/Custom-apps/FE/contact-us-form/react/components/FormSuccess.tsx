import React from 'react'
import style from '../styles.css'
import { FormattedMessage } from 'react-intl'

interface FormSuccessProps {
}

const FormSuccess: StorefrontFunctionComponent<FormSuccessProps> = ({

}) => {
  return (
    <div className={style.formSuccessDiv}>
      <div className={style.formSuccessSubtitleDiv}>
        <span className={style.formSuccessSubtitle}>
          <FormattedMessage
            id="store/contact-us-form.successFormTitle"
          />
        </span>
        <a className={style.formLink} href="/">
          <FormattedMessage
            id="store/contact-us-form.successFormLink"
          />
        </a>
      </div>
    </div>
  )
}

FormSuccess.schema = {
  title: 'editor.customForm.title',
  description: 'editor.customForm.description',
  type: 'object',
  properties: {},
}

export default FormSuccess
