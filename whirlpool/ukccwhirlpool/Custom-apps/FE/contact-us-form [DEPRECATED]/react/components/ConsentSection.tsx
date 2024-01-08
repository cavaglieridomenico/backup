import React from 'react'
import style from '../styles.css'
import { FormattedMessage } from 'react-intl'


interface PersonalDataSectionProps {
  handleChangeCheckboxes : any,
  values: any
}

const ContentSection: StorefrontFunctionComponent<PersonalDataSectionProps> = ({
  handleChangeCheckboxes,
  values
}) => {

  return (
    <div className={style.privacySectionDiv}>
        {/* <span className={style.title}>
          <FormattedMessage
            id="store/contact-us-form.privacySectionTitle"
          />
        </span> */}
        <span className={`${style.description} ${style.descriptionPrivacy}`}>
        <FormattedMessage
            id="store/contact-us-form.privacyDesc1"
        />
        <a href="/pages/politique-de-protection-des-donnees-a-caractere-personnel" target="_blank" className={style.privacyLink}>
        <FormattedMessage
            id="store/contact-us-form.privacyDescLink"
        />
        </a> 
        <FormattedMessage
            id="store/contact-us-form.privacyDesc2"
        />
        </span>
        <div className={style.checkboxGroup}>
            <div className={style.brandCheckbox}>
                <span className={style.description}>
                <FormattedMessage
                  id="store/contact-us-form.privacyFirstPointLabel"
                />
                </span>
                <div className={style.checkboxWrapper}>
                    <input type="checkbox" className={style.inputCheckbox} onChange={handleChangeCheckboxes} name='WhirlpoolCommunication' value={values.WhirlpoolCommunication}/>
                    <span className={values.WhirlpoolCommunication ? style.customCheckboxFilled : style.customCheckbox}></span>
                    <span className={style.privacyAccept}>
                    <FormattedMessage
                      id="store/contact-us-form.privacyCheckboxLabel"
                    />
                    </span>
                </div>    
            </div>   
            {/* <div className={style.brandCheckbox}>
                <span className={style.description}>
                <FormattedMessage
                  id="store/contact-us-form.privacySecondPointLabel"
                />
                </span>
                <div className={style.checkboxWrapper}>
                    <input type="checkbox" className={style.inputCheckbox} onChange={handleChangeCheckboxes} name='WarrantyCommunication' value={values.WarrantyCommunication}/>
                    <span className={values.WarrantyCommunication ? style.customCheckboxFilled : style.customCheckbox}></span>
                    <span className={style.privacyAccept}>
                    <FormattedMessage
                      id="store/contact-us-form.privacyCheckboxLabel"
                    />
                    </span>
                </div>    
            </div>    */}
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
