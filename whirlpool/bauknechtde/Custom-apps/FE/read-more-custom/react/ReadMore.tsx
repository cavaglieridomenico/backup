import React, { memo } from 'react'
import type { MemoExoticComponent, PropsWithChildren } from 'react'
import GradientCollapse from './components/GradientCollapse'
import style from "./style.css"
import { index as RichText } from "vtex.rich-text";


type Props = {
  /** Define if content should start collapsed or not */
  collapseContent?: boolean,
  /** This is the Read More text */
  plpText?: string
}

/**
 * Product Description Component.
 * Render the description of a product
 */
function ReadMore(props: PropsWithChildren<Props>) {
  const { collapseContent = true, plpText="lorem10" } = props
  
  if (!plpText) {
    return null
  }

  return (
    <div className={style.productDescriptionContainer}>
      <div className={`${style.productDescriptionText} c-muted-1`}>
        {collapseContent ? (
          <GradientCollapse collapseHeight={120}>
            <RichText text={plpText} />
          </GradientCollapse>
        ) : (
          <RichText text={plpText} />
        )}
      </div>
    </div>
  )
}

const MemoizedProductDescription: MemoExoticComponent<
  typeof ReadMore
> & { schema?: Record<string, any> } = memo(ReadMore)

MemoizedProductDescription.schema = {
  title: '[TEXT] - TOP - Read more Text',
  description: '',
  type: 'object',
  properties: {
    plpText :{
      title: "PLP text",
      description:"Insert the read-more text (Markdown)",
      default: "",
      type: "string"
    }
  },
}

export default MemoizedProductDescription
