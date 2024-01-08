import React from 'react'
import style from "./style.css";
import { useProduct } from 'vtex.product-context'

interface LeadTimeProps {
  inStock: string,
  hideTitle: boolean
}

const KeyFeatures: StorefrontFunctionComponent<LeadTimeProps> = ({hideTitle=false}) => {

  const productContext = useProduct()
  const product = productContext?.product;
  const Bullet_1 = product?.properties?.filter((e: any) => e?.name == "Bullet_1");
  const Bullet_2 = product?.properties?.filter((e: any) => e?.name == "Bullet_2");
  const Bullet_3 = product?.properties?.filter((e: any) => e?.name == "Bullet_3");
  const Bullet_4 = product?.properties?.filter((e: any) => e?.name == "Bullet_4");
  const nullishValues = ["NULL", "null", "Null", null];

  return (
    <>
      {
        ((Bullet_1 && Bullet_1[0]?.values && Bullet_1[0]?.values.length > 0 && nullishValues.indexOf(Bullet_1[0]?.values[0]) < 0) ||
        (Bullet_2 && Bullet_2[0]?.values && Bullet_2[0]?.values.length > 0 && nullishValues.indexOf(Bullet_2[0]?.values[0]) < 0) ||
        (Bullet_3 && Bullet_3[0]?.values && Bullet_3[0]?.values.length > 0 && nullishValues.indexOf(Bullet_3[0]?.values[0]) < 0) ||
        (Bullet_4 && Bullet_4[0]?.values && Bullet_4[0]?.values.length > 0 && nullishValues.indexOf(Bullet_4[0]?.values[0]) < 0)) && (
          <div className={style.wrapper}>
            {!hideTitle && (
             <p className={style.title}>Key features</p>
            )}
            <div className={style.features}>
              {/* Check for each bullet if exists and if its value is NOT "NULL" and then render it */}
              {Bullet_1 && Bullet_1[0]?.values && Bullet_1[0]?.values.length > 0 && nullishValues.indexOf(Bullet_1[0]?.values[0]) < 0 && (
                <p className={style.feature}>{Bullet_1[0]?.values[0]}</p>
              )}
              {Bullet_2 && Bullet_2[0]?.values && Bullet_2[0]?.values.length > 0 && nullishValues.indexOf(Bullet_2[0]?.values[0]) < 0 && (
                <p className={style.feature}>{Bullet_2[0]?.values[0]}</p>
              )}
              {Bullet_3 && Bullet_3[0]?.values && Bullet_3[0]?.values.length > 0 && nullishValues.indexOf(Bullet_3[0]?.values[0]) < 0 && (
                <p className={style.feature}>{Bullet_3[0]?.values[0]}</p>
              )}
              {Bullet_4 && Bullet_4[0]?.values && Bullet_4[0]?.values.length > 0 && nullishValues.indexOf(Bullet_4[0]?.values[0]) < 0 && (
                <p className={style.feature}>{Bullet_4[0]?.values[0]}</p>
              )}
            </div>
          </div>
        )
      }
    </>
  )
}

KeyFeatures.schema = {
  title: 'Lead Time Label',
  description: 'editor.leadtime.description',
  type: 'object',
  properties: {
    inStock: {
      title: 'In Stock label',
      description: 'This is the label visible for in stock products',
      type: 'string',
      default: 'In Stock',
    },
  },
}

export default KeyFeatures

