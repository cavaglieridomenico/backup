import React from 'react'
import style from '../styles.css'


interface PersonalDataSectionProps {
  handleChangeCheckboxes: any,
  values: any
  privacyPolicyText?: []
  acceptTermPrivacyText?: []
}

let parsedText: string = "";

const ContentSection: StorefrontFunctionComponent<PersonalDataSectionProps> = ({
  handleChangeCheckboxes,
  values,
  privacyPolicyText,
  acceptTermPrivacyText
}) => {

  return (
    <div className={style.privacySectionDiv}>
      {//parsing del testo inserito in privacy, traduce in html se ce n'è all'interno
        <p>{privacyPolicyText?.map((item: any) => {
          parsedText = item?.__editorItemTitle
          return <div dangerouslySetInnerHTML={{ __html: parsedText }} />
        })}</p>
      }
      <div className={style.checkboxGroup}>
        <div className={style.brandCheckbox}>
          {acceptTermPrivacyText?.map((item: any, index: number) => {

            return <div className={style.checkboxWrapper} key={index}>

              <input type="checkbox"
                className={style.inputCheckbox}
                onChange={handleChangeCheckboxes}
                name='WhirlpoolCommunication'
                value={values.WhirlpoolCommunication} />

              <span className={values.WhirlpoolCommunication ?
                style.customCheckboxFilled :
                style.customCheckbox}>
              </span>

              <span className={style.privacyAccept}>
                {item.checkboxTitle}
              </span>
            </div>

          })}
        </div>

      </div>
    </div>
  )
}

ContentSection.schema = {
  title: 'editor.customForm.title',
  description: 'editor.customForm.description',
  type: 'object',
  properties: {},
}

export default ContentSection
