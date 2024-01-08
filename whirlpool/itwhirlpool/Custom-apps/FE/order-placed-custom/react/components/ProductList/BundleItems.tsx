import React, { FC, Fragment,useEffect, useState  } from 'react'
import { ProductImage } from 'vtex.order-details'

import FormattedPrice from '../FormattedPrice'
import AttachmentAccordion from './AttachmentAccordion'
import { useCssHandles } from 'vtex.css-handles'
interface Props {
  product: OrderItem
}

interface bundlePrice {
  name:string
  listPrice:number
  Price:number
}

const CSS_HANDLES = ['sectionTitle','listContainer','theoreticalPrice', 'price']

const BundleItems: FC<Props> = ({ product }) => {
  const { bundleItems } = product
  const categoryId = (product as any).categoryId
  const initialState = bundleItems.map((bundle) => { return { name:bundle.name,value:<></>}})
  const [bundlesPrice, setBundlesPrice] = useState(initialState)

  const handles = useCssHandles(CSS_HANDLES)

  if (!bundleItems?.length) {
    return null
  }

  useEffect(() =>{
    async function updateBundlePrice(){
      let services = await fetch('/_v/wrapper/api/additionalservice/info?categoryId='+categoryId,{method:"GET"}).then(res => res.json())
      let prices : bundlePrice[] = []
      bundleItems.map((bundleItem) =>{
        let listPrice = services.filter((ser:any) => ser.serviceName == bundleItem.name)?.[0].price
        prices.push({
          name:bundleItem.name,
          "listPrice":listPrice*100,
          Price:bundleItem.price
        })
      })
      var copy:any[] = []
      prices.map((price)=>{
        if(price.Price == 0){
          copy.push({name:price.name,value:<React.Fragment>{price.listPrice !== 0 && <span className={`${handles.theoreticalPrice}`}><FormattedPrice value={price.listPrice }/></span>}Gratuito</React.Fragment>})
        }else{
          copy.push({name:price.name,value:<React.Fragment>{price.listPrice !== 0 && price.Price !== price.listPrice && price.listPrice > price.Price && <span className={`${handles.theoreticalPrice}`}><FormattedPrice value={price.listPrice }/></span>}<span className={`${handles.price}`}> <FormattedPrice value={price.Price }/> </span></React.Fragment>})
        }
      })
      setBundlesPrice(copy)
    }
    updateBundlePrice()
  },[])

  return (
    <Fragment>
      {bundleItems?.length>0 ?
        <div className={`${handles.sectionTitle}`}> Servizi Inclusi nel prezzo</div> : null
      }
      <div className={`${handles.listContainer}`}>
      {bundleItems.map((bundleItem) => {
        const isMessage = bundleItem?.attachments?.[0]?.name === 'message'
        const content = isMessage
          ? [bundleItem.attachments[0].content.text]
          : ([] as string[]).concat(
              ...bundleItem.attachments.map((attachmentItem) => {
                return Object.keys(attachmentItem.content).map(
                  (key) => `${key}: ${attachmentItem.content[key]}`
                )
              })
            )

        return (
          <AttachmentAccordion
            key={bundleItem.id}
            beforeTitleLabel={
              bundleItem.imageUrl && (
                <ProductImage url={bundleItem.imageUrl} alt={bundleItem.name} />
              )
            }
            titleLabel={bundleItem.name}
            toggleLabel={bundlesPrice.filter((el:any) => el.name == bundleItem.name)[0].value}
            content={content}
          />
        )
      })}
      </div>
    </Fragment>
  )
}

export default BundleItems
