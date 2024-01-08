import React from 'react'
import style from "./style.css";
import { useProduct } from 'vtex.product-context'

interface LeadTimeProps {
  inStock: string
}

const KeyFeatures: StorefrontFunctionComponent<LeadTimeProps> = ({ }) => {

  const productContext = useProduct()
  const product = productContext?.product;
  const Bullet_1 = product?.properties?.filter(
    (e: any) => e?.name == "Bullet_1"
  );
  const Bullet_2 = product?.properties?.filter((e: any) => e?.name == "Bullet_2");
  const Bullet_3 = product?.properties?.filter((e: any) => e?.name == "Bullet_3");
  const Bullet_4 = product?.properties?.filter((e: any) => e?.name == "Bullet_4");

  return (
    <>
      {((Bullet_1 && Bullet_1[0]?.values && Bullet_1[0]?.values.length > 0) ||
        (Bullet_2 && Bullet_2[0]?.values && Bullet_2[0]?.values.length > 0) ||
        (Bullet_3 && Bullet_3[0]?.values && Bullet_3[0]?.values.length > 0) ||
        (Bullet_4 &&
          Bullet_4[0]?.values &&
          Bullet_4[0]?.values.length > 0)) && (
        <div className={style.wrapper}>
          <p className={style.title}>Caratteristiche principali</p>
          <div className={style.features}>
            <p
              className={
                Bullet_4.length == 0 || Bullet_1[0]?.values[0] == "NULL"
                  ? style.featureNone
                  : style.feature
              }
            >
              {Bullet_1[0]?.values[0]}
            </p>
            <p
              className={
                Bullet_2.length == 0 || Bullet_2[0]?.values[0] == "NULL"
                  ? style.featureNone
                  : style.feature
              }
            >
              {Bullet_2[0]?.values[0]}
            </p>
            <p
              className={
                Bullet_3.length == 0 || Bullet_3[0]?.values[0] == "NULL"
                  ? style.featureNone
                  : style.feature
              }
            >
              {Bullet_3[0]?.values[0]}
            </p>
            <p
              className={
                Bullet_4.length == 0 || Bullet_4[0]?.values[0] == "NULL"
                  ? style.featureNone
                  : style.feature
              }
            >
              {Bullet_4[0]?.values[0]}
            </p>
          </div>
        </div>
      )}
    </>
  );
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

