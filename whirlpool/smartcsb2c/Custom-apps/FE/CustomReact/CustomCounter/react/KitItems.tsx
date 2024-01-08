// @ts-nocheck
import React, { useContext, useEffect, useState, useRef } from 'react'
import { isEmpty, path } from 'ramda'
import { ProductContext } from 'vtex.product-context'
import { defineMessages } from 'react-intl'
import fetchRequest from '../utils/fetchRequest'
import styles from './styles.css'
import IconScrew from './Icons/IconScrew' 
import axios from 'axios';
import { FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages } from 'react-intl'


const messages = defineMessages({
  nameKitItems: { id: 'store/countdown.NameKitItems' },
  qtyKitItems: { id: 'store/countdown.qtyKitItems' },
  priceKitItems: { id: 'store/countdown.priceNameKitItems' },
  referenceKitItems: { id: 'store/countdown.ReferenceKitItems' }
})

const KitItems: StorefrontFunctionComponent<> = () => { 

  const intl = useIntl()
  const translateMessage = (message: MessageDescriptor) =>
  intl.formatMessage(message)

  const valuesFromContext = useContext(ProductContext)
  const [kitItemsTranslations, setKitItemsTranslations] = useState({})
  const [locale, setLocale] = useState("");
  if (!valuesFromContext || isEmpty(valuesFromContext)) {
    return null
  }  


  let hrefOrigin = useRef()

  console.log(locale)
  useEffect( () => {  
      hrefOrigin.current= window.location.origin 
      var promises = [];
      valuesFromContext.selectedItem.kitItems.filter((item) => {
        promises.push(
          axios.get(`/v1/translation/product/${item.product.productId}/${__RUNTIME__.culture.locale}`).then(function(response) {
            return response.data.data.product
          })
          .catch(function(error) {
            return { success: false };
          })
        )
      });
      Promise.all(promises)
      .then((results) => {
          var translations = {};
          results.filter((result) => {
            if(result.id){
              translations[result.id] = result;
            }
          })
          setKitItemsTranslations(translations);
          console.log(translations)
      })
      .catch((e) => {
          // Handle errors here
      });
      setLocale(__RUNTIME__.culture.locale)
  }, []);
 
  return (
          <div className={styles.kitItemsMain} > 
              {valuesFromContext.selectedItem.kitItems && hrefOrigin.current && valuesFromContext.selectedItem.kitItems.map((kitItem,index) => 
              <>
                {index==0  && 
                  <div className={styles.headerKits} >
                    <div className={styles.headerKitBlank}></div>
                    <div className={styles.headerKitName}>{translateMessage(messages.nameKitItems)}</div>
                    <div className={styles.headerKitQuantity} >{translateMessage(messages.qtyKitItems)}</div>
                    <div className={styles.headerKitPrice}>{translateMessage(messages.priceKitItems)}</div>
                  </div>}
                <div key={kitItem.product.productId} className={styles.kitItemsMainInner}>
                    <div className={styles.imageKitDiv}  onClick={()=>window.location.href =`/${locale.split('-')[0]}/${kitItem.product.linkText}/p`} >
                        <img className={styles.kitImages} src={kitItem.sku.images[0].imageUrl} />
                    </div>
                    <div className={styles.kitItemNameDiv}>
                          <h3> {locale == "de-CH" ? kitItem.product.productName :  kitItemsTranslations[kitItem.product.productId] && kitItemsTranslations[kitItem.product.productId].description !== null? kitItemsTranslations[kitItem.product.productId].description: kitItemsTranslations[kitItem.product.productId] ? kitItemsTranslations[kitItem.product.productId].name : kitItem.product.productName} </h3>
                          <p>{translateMessage(messages.referenceKitItems)}:  </p>
                          <p>{kitItem.sku.referenceId[0].Value}</p>
                    </div>
                    <div className={styles.kitAmount}>
                          <p className={styles.kitAmountNumber}> {kitItem.amount} </p>
                    </div>  

                    <div className={styles.kitItemPrice}>
                          <p> {kitItem.sku.sellers[0].commertialOffer.Price + kitItem.sku.sellers[0].commertialOffer.Tax} </p>
                    </div>
                </div> 
              </>
               )} 
          </div>
) 
}

export default KitItems
 