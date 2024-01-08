import React from "react";
import style from "../styles.css"

// interface WindowGTM extends Window{
//   dataLayer: any
// }

interface PrivacySectionProps {
  values: any
  handleChangeCheckboxes: any
  // Labels
  privacyTitleLabel: string
  privacySubTitleLabel: string
  privacySubTitleLinkLabel: string
  privacySubTitleLabel2: string
  privacyFirstPointLabel: string
  privacySecondPointLabel: string
  privacyCheckboxLabel: string
}

const PrivacySection: StorefrontFunctionComponent<PrivacySectionProps> = ({ 
  values,
  handleChangeCheckboxes,
  // Labels
  privacyTitleLabel,
  privacySubTitleLabel,
  privacySubTitleLinkLabel,
  privacySubTitleLabel2,
  privacyFirstPointLabel,
  privacySecondPointLabel,
  privacyCheckboxLabel
}) => {

  return(
    <div className={style.privacySectionDiv}>
        <span className={style.privacyTitle}>{privacyTitleLabel}</span>
        <span className={style.privacyDescription}>{privacySubTitleLabel}<a href="" className={style.privacyLink}>{privacySubTitleLinkLabel}</a> {privacySubTitleLabel2}</span>
        <div className={style.checkboxGroup}>
            <div className={style.brandCheckbox}>
                <span className={style.privacyDescription}>{privacyFirstPointLabel}</span>
                <div className={style.checkboxWrapper}>
                    <input type="checkbox" className={style.inputCheckbox} onChange={handleChangeCheckboxes} name='eu_consumer_brand' value={values.eu_consumer_brand}/>
                    <span className={values.eu_consumer_brand ? style.customCheckboxFilled : style.customCheckbox}></span>
                    <span className={style.privacyAccept}>{privacyCheckboxLabel}</span>
                </div>    
            </div>   
            <div className={style.brandCheckbox}>
                <span className={style.privacyDescription}>{privacySecondPointLabel}</span>
                <div className={style.checkboxWrapper}>
                    <input type="checkbox" className={style.inputCheckbox} onChange={handleChangeCheckboxes} name='eu_consumer_prv' value={values.eu_consumer_prv}/>
                    <span className={values.eu_consumer_prv ? style.customCheckboxFilled : style.customCheckbox}></span>
                    <span className={style.privacyAccept}>{privacyCheckboxLabel}</span>
                </div>    
            </div>   
        </div> 
    </div>
  )
}

PrivacySection.schema = {
  title: "editor.customForm.title",
  description: "editor.customForm.description",
  type: "object",
  properties: {},
};

export default PrivacySection;
