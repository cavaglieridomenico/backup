import React from 'react'
import style from '../styles.css'

interface FormSuccessProps {
  //Labels
  titleSuccessFormLabel:string
  subtitleSuccessFormLabel:string
}

const FormSuccess: StorefrontFunctionComponent<FormSuccessProps> = ({
  titleSuccessFormLabel,
  subtitleSuccessFormLabel
}) => {
  return (
    <div className={style.formSuccessDiv}>
      <h1 className={style.formSuccessTitle}>{titleSuccessFormLabel}</h1>
      <div className={style.formSuccessSubtitleDiv}>
        <span className={style.formSuccessSubtitle}>
          {subtitleSuccessFormLabel}
        </span>
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
