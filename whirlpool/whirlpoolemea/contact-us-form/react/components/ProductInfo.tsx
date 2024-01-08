import React from 'react'
import style from '../styles.css'
import { FormattedMessage, useIntl } from 'react-intl'
import { DatePicker } from 'vtex.styleguide'
import './styles.global.css'


interface ProductInfoProps {
  errors: any
  resetInput: any,
  handleChange: any,
  handleChangeSelect: any,
  handleChangePurchaseDate: any,
  handleChangeEndWarrantyExtensionDate: any,
  values: any,
  prodInfoTitle?: string,
  prodInfoDesc?: [],
  datePickerCountry:string,
  datePickerPlaceholder: string
}

const ProductInfo: StorefrontFunctionComponent<ProductInfoProps> = ({
  errors,
  resetInput,
  handleChange,
  handleChangeSelect,
  handleChangePurchaseDate,
  handleChangeEndWarrantyExtensionDate,
  values,
  prodInfoTitle,
  prodInfoDesc,
  datePickerCountry,
  datePickerPlaceholder
}) => {
  const intl = useIntl()

  const warrantyExtensionsLabels: any = [
    { id: <FormattedMessage id="store/contact-us-form.warrantyExtensionsLabelYes" /> },
    { id: <FormattedMessage id="store/contact-us-form.warrantyExtensionsLabelNo" /> }
  ]

  return (
    <>
      <h2 className={style.title}>
        {prodInfoTitle}
      </h2>
      {//testo inserito in prod title
        <p>{prodInfoDesc?.map((item: any) => {
          return <p style={{"textAlign": "center"}}>{item?.__editorItemTitle}</p>
        })}
        </p>
      }
      <div className={style.formDiv}>
        <div className={`${style.inputDiv} ${style.inputDiv33}`}>
          <input
            type="text"
            required
            className={errors.SerialNumber ? style.errorInput : style.input}
            onChange={handleChange}
            onFocus={() => resetInput("SerialNumber")}
            name="SerialNumber"
            value={values.SerialNumber}
          />
          <label className={style.inputLabel}>
            <FormattedMessage id="store/contact-us-form.SerialNumberLabel" />
          </label>
        </div>
        <div className={`${style.inputDiv} ${style.inputDiv33}`}>
          <input
            type="text"
            required
            className={errors.ModelNumber ? style.errorInput : style.input}
            onChange={handleChange}
            onFocus={() => resetInput("ModelNumber")}
            name="ModelNumber"
            value={values.ModelNumber}
          />
          <label className={style.inputLabel}>
            <FormattedMessage id="store/contact-us-form.ModelNumberLabel" />
          </label>
        </div>
        <div className={`${style.inputDatePicker} ${style.inputDiv} ${style.inputDiv33}`}>
          <DatePicker
            value={values.PurchaseDate}
            onChange={date => handleChangePurchaseDate(date)}
            locale={datePickerCountry}
            maxDate={new Date()}
            placeholder={datePickerPlaceholder}
          />
          <label className={style.inputLabel}>
            <FormattedMessage id="store/contact-us-form.PurchaseDateLabel" />
          </label>
        </div>
        <div className={`${style.inputDiv} ${style.inputDiv33}`}>
          <input
            type="text"
            className={style.input}
            onChange={handleChange}
            name="SalePoint"
            value={values.SalePoint}
          />
          <label className={style.inputLabel}>
            <FormattedMessage id="store/contact-us-form.SalePointLabel" />
          </label>
        </div>
        <div className={`${style.inputDiv} ${style.inputDiv33}`}>
          <select
            name="WarrantyExtension"
            className={`${style.input} ${style.inputWarranty}`}
            onChange={handleChangeSelect}
          >
            <option
              id=""
              value=""
              className={style.option}
              selected
              disabled
            >
              {intl.formatMessage({ id: "store/contact-us-form.OptionsPlaceholderLabel" })}
            </option>
            <option
              id={warrantyExtensionsLabels[0].id}
              value={values.WarrantyExtension}
              className={style.option}
            >
              {intl.formatMessage({ id: "store/contact-us-form.warrantyExtensionsLabelYes" })}
            </option>
            <option
              id={warrantyExtensionsLabels[1].id}
              value={values.WarrantyExtension}
              className={style.option}
            >
              {intl.formatMessage({ id: "store/contact-us-form.warrantyExtensionsLabelNo" })}
            </option>
          </select>
          <label className={style.inputLabel}>
            <FormattedMessage id="store/contact-us-form.WarrantyExtensionLabel" />
          </label>
        </div>
        <div className={`${style.inputDatePicker} ${style.inputDiv} ${style.inputDiv33}`}>
          <DatePicker
            value={values.EndWarrantyExtension}
            onChange={date => handleChangeEndWarrantyExtensionDate(date)}
            locale={datePickerCountry}
            maxDate={new Date()}
            placeholder={datePickerPlaceholder}
          />
          <label className={style.inputLabel}>
            <FormattedMessage id="store/contact-us-form.EndWarrantyExtensionLabel" />
          </label>
        </div>
        <p className={style.postillaText}>
          <FormattedMessage id="store/contact-us-form.PostillaLabel" />
        </p>
      </div>
    </>
  )
}

ProductInfo.schema = {
  title: 'editor.customForm.title',
  description: 'editor.customForm.description',
  type: 'object',
  properties: {},
}

export default ProductInfo
