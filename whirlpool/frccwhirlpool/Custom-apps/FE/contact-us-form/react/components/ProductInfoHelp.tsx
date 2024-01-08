import React, { useState } from 'react'
import style from '../styles.css'
import { FormattedMessage } from 'react-intl'
import { serialNumbers } from '../utils/serial-number'

interface ProductInfoHelpProps {
}

const ProductInfoHelp: StorefrontFunctionComponent<ProductInfoHelpProps> = ({
}) => {

    const [activeImage, setActiveImage] = useState(Object.keys(serialNumbers)[0]) //Setto la prima immagine come la prima della lista

  return (
    <>
        <div className={style.productInfoHelp}>
          <div className={style.productInfoHelpWrapper}>
             <h2 className={style.title}>
              <FormattedMessage
                id="store/contact-us-form.productInfoHelpTitle"
              />
            </h2>
            <div className={style.productInfoHelpImgWrapper}>
              <img
                    className={style.productInfoHelpImg}
                    src={Object.values<string>(serialNumbers)[0]}
                    alt=""
              />
            </div>
            <p className={style.description}>
              <FormattedMessage
                id="store/contact-us-form.productInfoHelpDesc1"
              />
            </p>
            <p className={style.description}>
              <FormattedMessage
                id="store/contact-us-form.productInfoHelpDesc2"
              />
            </p>
            <p className={style.description}>
              <FormattedMessage
                id="store/contact-us-form.productInfoHelpDesc3"
              />
            </p>
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
              <div className={style.productInfoHelpImgWrapper}>
                <img
                  className={style.productInfoHelpImg}
                  src={serialNumbers[activeImage]}
                  alt=""
                />
              </div>
        </div>
      </div>
    </>    
  )
}

ProductInfoHelp.schema = {
  title: 'editor.customForm.title',
  description: 'editor.customForm.description',
  type: 'object',
  properties: {},
}

export default ProductInfoHelp
