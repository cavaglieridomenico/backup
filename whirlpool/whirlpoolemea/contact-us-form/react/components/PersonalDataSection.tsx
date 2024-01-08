import React from 'react'
import style from '../styles.css'
import { FormattedMessage } from 'react-intl'


interface PersonalDataSectionProps {
  errors: any
  resetInput: any,
  handleChange: any,
  values: any,
  telephonePlaceholder: string,
  emailPlaceholder: string,
  isTelephoneRequired: boolean
}

const PersonalDataSection: StorefrontFunctionComponent<PersonalDataSectionProps> = ({
  errors,
  resetInput,
  handleChange,
  values,
  telephonePlaceholder,
  emailPlaceholder,
  isTelephoneRequired
}) => {
  
  return (
    <>
      <h2 className={style.title}>
              <FormattedMessage
                  id="store/contact-us-form.personalDatasTitle"
              />
      </h2> 
      <div className={style.formDiv}>
          <div className={style.inputDiv}>
              <input
                type="text"
                required
                className={errors.Name ? style.errorInput : style.input}
                onChange={handleChange}
                onFocus={() => resetInput("Name")}
                name="Name"
                value={values.Name}
              />
              <label className={style.inputLabel}>
                <FormattedMessage
                  id="store/contact-us-form.nameLabel"
                />
              </label>
              {errors.Name && (
                <p className={style.errorLabel}>{errors.Name}</p>
              )}
          </div>
          <div className={style.inputDiv}>
              <input
                type="text"
                required
                className={errors.Surname ? style.errorInput : style.input}
                onChange={handleChange}
                onFocus={() => resetInput("Surname")}
                name="Surname"
                value={values.Surname}
              />
              <label className={style.inputLabel}>
              <FormattedMessage
                  id="store/contact-us-form.surnameLabel"
                />
              </label>
              {errors.Surname && (
                <p className={style.errorLabel}>{errors.Surname}</p>
              )}
          </div>
          <div className={style.inputDivFull}>
                <input
                  type="text"
                  required
                  className={errors.Address ? style.errorInput : style.input}
                  onChange={handleChange}
                  onFocus={() => resetInput("Address")}
                  name="Address"
                  value={values.Address}
                />
                <label className={style.inputLabel}>
                  <FormattedMessage
                    id="store/contact-us-form.addressLabel"
                  />
                </label>
                {errors.Address && (
                  <p className={style.errorLabel}>{errors.Address}</p>
                )}
          </div>
          <div className={style.inputDiv}>
              <input
                type="text"
                required
                className={errors.ZipCode ? style.errorInput : style.input}
                onChange={handleChange}
                onFocus={() => resetInput("ZipCode")}
                name="ZipCode"
                value={values.ZipCode}
              />
              <label className={style.inputLabel}>
                <FormattedMessage
                  id="store/contact-us-form.ZipCodeLabel"
                />
              </label>
              {errors.ZipCode && (
                <p className={style.errorLabel}>{errors.ZipCode}</p>
              )}
          </div>
          <div className={style.inputDiv}>
              <input
                type="text"
                required
                className={errors.City ? style.errorInput : style.input}
                onChange={handleChange}
                onFocus={() => resetInput("City")}
                name="City"
                value={values.City}
              />
              <label className={style.inputLabel}>
              <FormattedMessage
                  id="store/contact-us-form.CityLabel"
                />
              </label>
              {errors.City && (
                <p className={style.errorLabel}>{errors.City}</p>
              )}
          </div>
          <div className={style.inputDiv}>
              <input
                type="phone"
                // required
                required={isTelephoneRequired}
                className={errors.Phone ? style.errorInput : style.input}
                onChange={handleChange}
                onFocus={() => resetInput("Phone")}
                name="Phone"
                value={values.Phone}
                placeholder={telephonePlaceholder}
              />
              <label className={style.inputLabel}>
                {isTelephoneRequired ? 
                  <FormattedMessage
                    id="store/contact-us-form.PhoneLabelRequired"
                  /> : 
                  <FormattedMessage
                    id="store/contact-us-form.PhoneLabel"
                  />
                }
              </label>
              {errors.Phone && (
                <p className={style.errorLabel}>{errors.Phone}</p>
              )}
          </div>
          <div className={style.inputDiv}>
              <input
                type="email"
                required
                className={errors.Email ? style.errorInput : style.input}
                onChange={handleChange}
                onFocus={() => resetInput("Email")}
                name="Email"
                value={values.Email}
                placeholder={emailPlaceholder}
              />
              <label className={style.inputLabel}>
              <FormattedMessage
                  id="store/contact-us-form.EmailLabel"
                />
              </label>
              {errors.Email && (
                <p className={style.errorLabel}>{errors.Email}</p>
              )}
          </div>
          <div className={style.inputDivFull}>
              <textarea onChange={handleChange} className={style.textArea} name="UserMessage" rows={10} value={values.UserMessage} placeholder="" onFocus={() => resetInput("UserMessage")}>
              </textarea>
              <label className={style.inputLabel}>
              <FormattedMessage
                  id="store/contact-us-form.UserMessageLabel"
                />
              </label>
              {errors.UserMessage && (
                <p className={style.errorLabel}>{errors.UserMessage}</p>
              )}
          </div>
      </div>
    </>
  )
}

PersonalDataSection.schema = {
  title: 'editor.customForm.title',
  description: 'editor.customForm.description',
  type: 'object',
  properties: {},
}

export default PersonalDataSection
