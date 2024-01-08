import React, { useState } from 'react'
import style from '../styles.css'
import { serialNumbers } from '../utils/serial-number'
import { useIntl } from 'react-intl'
interface ProductInfoHelpProps {
  prodCodeTitle?: string,
  prodCodeDesc?:[]
}

const ProductInfoHelp: StorefrontFunctionComponent<ProductInfoHelpProps> = ({
  prodCodeTitle,
  prodCodeDesc
}) => {
    //Setto la prima immagine come la prima della lista
    const [activeImage, setActiveImage] = useState("") 
    const intl = useIntl()
    //first select's element, wich one that mustn't be re-selected converted to string
   
    
  return (
    <>
        <div className={style.productInfoHelp}>
          <div className={style.productInfoHelpWrapper}>
            
            <div className={style.productInfoHelpTextWrapper}>
              <div  className={style.productInfoHelpText} >
                
                <h2 className={style.title}>
                  {prodCodeTitle}
                </h2>
                
                <div>
                  {
                    prodCodeDesc?.map((item:any)=> {
                      return <p>{item?.__editorItemTitle}</p>
                    })
                  }
                </div>

              </div>

              <div className={style.productInfoHelpImgWrapper}>
                <img
                      className={style.productInfoHelpImg1}
                      src={Object.values<string>(serialNumbers)[0]}
                      alt=""
                />
              </div>
            </div>
            

            <div className={style.selectDiv}>
              <select
                name="category"
                className={style.select}
                onChange={(e: any) => {
                  setActiveImage(e.target.value)
                }}
              >
                {/* first option's element and cannot be re-select */}
                <option disabled selected>
                  {intl.formatMessage( { id:"store/contact-us-form.serial-number-products" })}
                </option>

                {Object.keys(serialNumbers).map( function x (serial: any, ) {
                   return (<option
                    key ={serial}
                    value={serial}
                    className={style.option}
                  > 
                  {intl.formatMessage( { id:serial })}
                  </option>)
                })}
                </select>
              </div>
        </div>
        <div className={style.productInfoHelpImgWrapper}>
                {
                activeImage && <img
                  className={style.productInfoHelpImg}
                  src={serialNumbers[activeImage]}
                  alt=""
                />
                }
              </div>
      </div>
    </>    
  )
}

ProductInfoHelp.schema = {
  title: 'editor.customForm.title',
  description: 'editor.customForm.description',
  type: 'object',
  properties: {
    
  },
}

export default ProductInfoHelp
