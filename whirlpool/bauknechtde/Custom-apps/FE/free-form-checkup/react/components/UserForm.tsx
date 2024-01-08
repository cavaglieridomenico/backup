import React from 'react'
import style from '../styles.css'
import validate from '../validateInfo'
import useForm from '../hook/useForm'
import { province } from '../utils/province'
import { professione } from '../utils/professione'
import { age } from '../utils/age'
import PrivacySection from './PrivacySection'
import ProductInfo from './ProductInfo'

// interface WindowGTM extends Window{
//   dataLayer: any
// }

interface UserFormProps {
  submitForm: any
  error: any,
  // Labels
  titoloLabel: string
  nameLabel: string
  surnameLabel: string
  addressLabel: string
  internoLabel: string
  capLabel: string
  cityLabel: string
  provinceLabel: string
  emailLabel: string
  confirmEmailLabel: string
  phoneLabel: string
  jobLabel: string
  ageLabel: string
  sendLabel: string
  formErrorLabel: string
  //Privacy section labels
  privacyTitleLabel: string
  privacySubTitleLabel: string
  privacySubTitleLinkLabel: string
  privacySubTitleLabel2: string
  privacyFirstPointLabel: string
  privacySecondPointLabel: string
  privacyCheckboxLabel: string
  //Product Info labels
  categoryLabel: string
  matricolaLabel: string
  modelLabel: string
  dateLabel: string
  productInfoTitleLabel: string
  productInfoTitle2Label: string
  productInfoSubTitleLabel: string
  addProductsLabel: string
}

const UserForm: StorefrontFunctionComponent<UserFormProps> = ({
  submitForm,
  error,
  // Labels
  titoloLabel,
  nameLabel,
  surnameLabel,
  addressLabel,
  internoLabel,
  capLabel,
  cityLabel,
  provinceLabel,
  emailLabel,
  confirmEmailLabel,
  phoneLabel,
  jobLabel,
  ageLabel,
  sendLabel,
  formErrorLabel,
  //Privacy section labels
  privacyTitleLabel,
  privacySubTitleLabel,
  privacySubTitleLinkLabel,
  privacySubTitleLabel2,
  privacyFirstPointLabel,
  privacySecondPointLabel,
  privacyCheckboxLabel,
  //Product Info labels
  categoryLabel,
  matricolaLabel,
  modelLabel,
  dateLabel,
  productInfoTitleLabel,
  productInfoTitle2Label,
  productInfoSubTitleLabel,
  addProductsLabel
  
}) => {
  const {
    handleChange,
    handleChangeSelect,
    handleSubmit,
    handleChangeCheckboxes,
    handleChangeSelectCategory,
    handleChangeSelectModel,
    handleChangeDate,
    addSection,
    removeSection,
    handleChangeMatricola,
    values,
    applianceDatas,
    errors,
  } = useForm(submitForm, validate)


  return (
    <>
      <form onSubmit={handleSubmit} className={style.form} noValidate>
        <div className={style.formDiv}>
          {/* CAMPO TITLE/NAME - RIGA 1 */}
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{titoloLabel}</label>
            <div className={style.selectDiv}>
              <select
                name="title"
                className={style.select}
                onChange={handleChangeSelect}
              >
                <option id="Sig." value={values.title} className={style.option}>
                  Sig.
                </option>
                <option
                  id="Sig.ra"
                  value={values.title}
                  className={style.option}
                >
                  Sig.ra
                </option>
              </select>
            </div>
          </div>
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{nameLabel}</label>
            <input
              type="text"
              required
              className={errors.firstName ? style.errorInput : style.input}
              onChange={handleChange}
              name="firstName"
              value={values.firstName}
            />
            {errors.firstName && (
              <p className={style.errorLabel}>{errors.firstName}</p>
            )}
          </div>
          {/* CAMPO LASTNAME/ADDRESS - RIGA 2 */}
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{surnameLabel}</label>
            <input
              type="text"
              required
              className={errors.lastName ? style.errorInput : style.input}
              onChange={handleChange}
              name="lastName"
              value={values.lastName}
            />
            {errors.lastName && (
              <p className={style.errorLabel}>{errors.lastName}</p>
            )}
          </div>
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{addressLabel}</label>
            <input
              type="text"
              required
              className={errors.address ? style.errorInput : style.input}
              onChange={handleChange}
              name="address"
              value={values.address}
            />
            {errors.address && (
              <p className={style.errorLabel}>{errors.address}</p>
            )}
          </div>
          {/* CAMPO INTERNO/CAP - RIGA 3 */}
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{internoLabel}</label>
            <input
              type="text"
              className={style.input}
              onChange={handleChange}
              name="interno"
              value={values.interno}
            />
          </div>
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{capLabel}</label>
            <input
              type="text"
              required
              className={errors.cap ? style.errorInput : style.input}
              onChange={handleChange}
              name="cap"
              value={values.cap}
            />
            {errors.cap && <p className={style.errorLabel}>{errors.cap}</p>}
          </div>
          {/* CAMPO CITY/PROVINCE - RIGA 4 */}
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{cityLabel}</label>
            <input
              type="text"
              required
              className={errors.city ? style.errorInput : style.input}
              onChange={handleChange}
              name="city"
              value={values.city}
            />
            {errors.city && <p className={style.errorLabel}>{errors.city}</p>}
          </div>
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{provinceLabel}</label>
            <div className={style.selectDiv}>
              <select
                name="province"
                className={style.select}
                onChange={handleChangeSelect}
              >
                {province.map((province: any) => (
                  <option
                    key={province.id}
                    id={province.value}
                    value={values.value}
                    className={style.option}
                  >
                    {province.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* CAMPO EMAIL - RIGA 5 */}
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{emailLabel}</label>
            <input
              type="text"
              required
              className={errors.email ? style.errorInput : style.input}
              onChange={handleChange}
              name="email"
              value={values.email}
            />
            {errors.email && <p className={style.errorLabel}>{errors.email}</p>}
          </div>
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{confirmEmailLabel}</label>
            <input
              type="text"
              required
              className={errors.email2 ? style.errorInput : style.input}
              onChange={handleChange}
              name="email2"
              value={values.email2}
            />
            {errors.email2 && (
              <p className={style.errorLabel}>{errors.email2}</p>
            )}
          </div>
          {/* CAMPO PHONE/JOB - RIGA 6 */}
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{phoneLabel}</label>
            <input
              type="text"
              required
              className={errors.phone ? style.errorInput : style.input}
              onChange={handleChange}
              name="phone"
              value={values.phone}
            />
            {errors.phone && <p className={style.errorLabel}>{errors.phone}</p>}
          </div>
          <div className={style.inputDiv}>
            <label className={style.inputLabel}>{jobLabel}</label>
            <div className={style.selectDiv}>
              <select
                name="job"
                className={style.select}
                onChange={handleChangeSelect}
              >
                {professione.map((job: any) => (
                  <option
                    key={job.value}
                    id={job.value}
                    value={job.value}
                    className={style.option}
                  >
                    {job.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* CAMPO AGE - RIGA 7 */}
          <div className={style.inputDivFull}>
            <label className={style.inputLabel}>{ageLabel}</label>
            <div className={style.selectDiv}>
              <select
                name="age"
                className={style.select}
                onChange={handleChangeSelect}
              >
                {age.map((age: any) => (
                  <option
                    key={age.value}
                    id={age.value}
                    value={age.value}
                    className={style.option}
                  >
                    {age.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* PRIVACY SECTION */}
        <PrivacySection
          values={values}
          handleChangeCheckboxes={handleChangeCheckboxes}
          //Privacy section labels
          privacyTitleLabel={privacyTitleLabel}
          privacySubTitleLabel={privacySubTitleLabel}
          privacySubTitleLinkLabel={privacySubTitleLinkLabel}
          privacySubTitleLabel2={privacySubTitleLabel2}
          privacyFirstPointLabel={privacyFirstPointLabel}
          privacySecondPointLabel={privacySecondPointLabel}
          privacyCheckboxLabel={privacyCheckboxLabel}
        />
        {/* PRODUCT SECTION */}
        <ProductInfo
          applianceDatas={applianceDatas}
          handleChangeSelectCategory={handleChangeSelectCategory}
          handleChangeSelectModel={handleChangeSelectModel}
          handleChangeMatricola={handleChangeMatricola}
          handleChangeDate={handleChangeDate}
          addSection={addSection}
          removeSection={removeSection}
          errors={errors}
          //Product Info labels
          categoryLabel={categoryLabel}
          matricolaLabel={matricolaLabel}
          modelLabel={modelLabel}
          dateLabel={dateLabel}
          productInfoTitleLabel={productInfoTitleLabel}
          productInfoTitle2Label={productInfoTitle2Label}
          productInfoSubTitleLabel={productInfoSubTitleLabel}
          addProductsLabel={addProductsLabel}
        />
        {/* INVIA */}
        <button className={style.submitButton} type="submit">
          {sendLabel}
        </button>
      </form>
      {error ? (
        <div className={style.errorSubmitDiv}>
          <span className={style.errorSubmitLabel}>
            {formErrorLabel}
          </span>
        </div>
      ) : null}
    </>
  )
}

UserForm.schema = {
  title: 'Free Checkup Form Labels',
  description: 'Theese are the checkup form labels',
  type: 'object',
  properties: {
    
  },
}

export default UserForm
