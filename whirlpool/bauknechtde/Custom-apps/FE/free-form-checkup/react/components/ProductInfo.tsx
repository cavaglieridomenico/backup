import React, { useState } from 'react'
import style from '../styles.css'
import styles from './styles.global.css'
import { applianceData } from '../utils/appliance-data'
import { serialNumbers } from '../utils/serial-number'
import { DatePicker } from 'vtex.styleguide'

// interface WindowGTM extends Window{
//   dataLayer: any
// }

interface ProductInfoProps {
  applianceDatas: any
  handleChangeSelectCategory: any
  handleChangeSelectModel: any
  handleChangeMatricola: any
  handleChangeDate: any
  addSection: any
  removeSection: any
  errors: any
  //Labels
  categoryLabel: string
  matricolaLabel: string
  modelLabel: string
  dateLabel: string
  productInfoTitleLabel: string
  productInfoTitle2Label: string
  productInfoSubTitleLabel: string
  addProductsLabel: string
}

const ProductInfo: StorefrontFunctionComponent<ProductInfoProps> = ({
  applianceDatas,
  handleChangeSelectCategory,
  handleChangeSelectModel,
  handleChangeMatricola,
  handleChangeDate,
  addSection,
  removeSection,
  errors,
  //Labels
  categoryLabel,
  matricolaLabel,
  modelLabel,
  dateLabel,
  productInfoTitleLabel,
  productInfoTitle2Label,
  productInfoSubTitleLabel,
  addProductsLabel
}) => {
  const [activeImage, setActiveImage] = useState(Object.keys(serialNumbers)[0]) //Setto la prima immagine come la prima della lista
  styles

  return (
    <div className={style.productInfoDiv}>
      {applianceDatas.map((appliance: any, index: any) => (
        <div className={style.productInfoWrapper}>
          <div
            className={
              index == 0 ? style.productInfoForm : style.productInfoForm2
            }
            id={index}
          >
            {index != 0 ? (
              <span
                className={style.closeSectionIcon}
                onClick={() => removeSection(index)}
              ></span>
            ) : null}
            <div
              className={index == 0 ? style.inputDivFull : style.inputDivMid}
            >
              <label className={style.inputLabel}>{categoryLabel}</label>
              <div className={style.selectDiv}>
                <select
                  name="category"
                  className={style.select}
                  onChange={e => handleChangeSelectCategory(e, index)}
                >
                  {applianceData.map((category: any) => (
                    <option
                      key={category.category}
                      id={category.category}
                      value={category.category}
                      className={style.option}
                      selected={category.category == appliance.category}
                    >
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div
              className={index == 0 ? style.inputDivFull : style.inputDivMid}
            >
              <label className={style.inputLabel}>{matricolaLabel}</label>
              <input
                type="text"
                required
                className={
                  errors.matricola && errors.matricola[index]
                    ? style.errorInput
                    : style.input
                }
                onChange={e => handleChangeMatricola(e, index)}
                name="register"
                value={applianceDatas[index].register}
              />
              {errors.matricola && errors.matricola[index] ? (
                <p className={style.errorLabel}>{errors.matricola[index]}</p>
              ) : null}
            </div>
            <div
              className={index == 0 ? style.inputDivFull : style.inputDivMid}
            >
              <label className={style.inputLabel}>{modelLabel}</label>
              <div className={style.selectDiv}>
                <select
                  name="category"
                  className={style.select}
                  onChange={e => handleChangeSelectModel(e, index)}
                >
                  {applianceData
                    .find(
                      (category: any) => category.category == appliance.category
                    )
                    ?.model.map((model: any) => (
                      <option
                        key={model.product_id}
                        id={model.product_id}
                        value={model.commercial_code}
                        className={style.option}
                      >
                        {model.product_id} - {model.commercial_code}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div
              className={index == 0 ? style.inputDivFull : style.inputDivMid}
            >
              <label className={style.inputLabel}>{dateLabel}</label>
              <div
                className={
                  errors.date && errors.date[index]
                    ? style.inputDivFullDateError
                    : style.inputDivFullDate
                }
              >
                <DatePicker
                  value={appliance.purchase_date}
                  onChange={date => handleChangeDate(date, index)}
                  locale="it"
                  maxDate={new Date()}
                />
              </div>
              {errors.date && errors.date[index] ? (
                <p className={style.errorLabel}>{errors.date[index]}</p>
              ) : null}
            </div>
          </div>
          {index == 0 ? (
            <div className={style.productInfoHelp}>
              <div className={style.productInfoHelpImgWrapper}>
                <img
                  className={style.productInfoHelpImg}
                  src={serialNumbers[activeImage]}
                  alt=""
                />
              </div>
              <span className={style.privacyTitle2}>
                {productInfoTitleLabel}
              </span>
              <div className={style.selectDiv}>
                <select
                  name="category"
                  className={style.select}
                  onChange={(e: any) => {
                    setActiveImage(e.target.value)
                  }}
                >
                  {Object.keys(serialNumbers).map((serial: any) => (
                    <option
                      key={serial}
                      value={serial}
                      className={style.option}
                    >
                      {serial}
                    </option>
                  ))}
                </select>
              </div>
              <span className={style.privacyTitle3}>
                {productInfoTitle2Label}
              </span>
              <p className={style.privacyDescription2}>
                {productInfoSubTitleLabel}
              </p>
            </div>
          ) : null}
        </div>
      ))}
      <button onClick={addSection} className={style.addSectionButton}>
        {addProductsLabel}
      </button>
    </div>
  )
}

ProductInfo.schema = {
  title: 'editor.customForm.title',
  description: 'editor.customForm.description',
  type: 'object',
  properties: {},
}

export default ProductInfo
