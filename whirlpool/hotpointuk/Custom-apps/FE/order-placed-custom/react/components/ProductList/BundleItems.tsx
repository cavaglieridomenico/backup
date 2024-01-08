import React, { FC, Fragment } from 'react'
import { ProductImage } from 'vtex.order-details'

import FormattedPrice from '../FormattedPrice'
import AttachmentAccordion from './AttachmentAccordion'
import { useCssHandles } from 'vtex.css-handles'
import styles from './ProductList.module.css'

interface Props {
  product: OrderItem
}
const CSS_HANDLES = ['sectionTitle','listContainer','price']

const BundleItems: FC<Props> = ({ product }) => {
  const { bundleItems } = product
  const handles = useCssHandles(CSS_HANDLES)
const listContainerCustom = `${handles.listContainer} ${styles.directionColumn} ${styles.w85}`

  if (!bundleItems?.length) {
    return null
  }

  return (
    <Fragment>
      {bundleItems?.length>0 ?
        <div className={`${handles.sectionTitle}`}> Included services:</div> : null
      }
      <div className={listContainerCustom}>
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
            toggleLabel={<FormattedPrice value={bundleItem.price} />}
            content={content}
          />
        )
      })}
      </div>
    </Fragment>
  )
}

export default BundleItems
