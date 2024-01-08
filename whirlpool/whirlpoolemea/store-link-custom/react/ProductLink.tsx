import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { ModalContext } from 'vtex.modal-layout'
import { useProduct } from 'vtex.product-context'
import { Link } from 'vtex.render-runtime'

import { usePixel } from "vtex.pixel-manager"
import { Props, defaultButtonProps } from './StoreLink'
import hasChildren from './modules/hasChildren'
import { AvailableContext } from './modules/mappings'
import useButtonClasses from './modules/useButtonClasses'
import { useInterpolatedLink } from './modules/useInterpolatedLink'

const { useModalDispatch } = ModalContext

const CSS_HANDLES = [
  'linkContainer',
  'link',
  'label',
  'childrenContainer',
  'buttonLink',
] as const

function ProductLink(props: Props) {
  const {
    label,
    href,
    escapeLinkRegex,
    replaceEscapedValue,
    children,
    target,
    displayMode = 'anchor',
    buttonProps = defaultButtonProps,
    isPrevent = true,
    isAnalyticsEvent = false,
    analyticsEventName = "clickCustom",
    analyticsData = undefined
  } = props
  const productContext = useProduct()
  const handles = useCssHandles(CSS_HANDLES)
  const resolvedLink = useInterpolatedLink(
    href,
    escapeLinkRegex ? new RegExp(escapeLinkRegex, 'g') : undefined,
    replaceEscapedValue ? replaceEscapedValue : undefined,
    [
      {
        type: AvailableContext?.product,
        context: productContext,
      },
    ]
  )

  console.log(resolvedLink, "resolvedLink")
  // MODAL DISPATCH IS ALWAYS AN EMPTY FUNCTION, NO MATTER IF WE ARE INSIDE A MODAL CONTEXT OR NOT, SO THE CONDITION ON 'REPLACE' PROPS OF LINK WILL ALWAYS BE TRUE. THE ONLY WAY TO HANDLE THIS IS TO TRANSFORM IT IN A STRING AND CHECK ITS LENGTH. IF WE ARE INSIDE A MODAL CONTEXT WE RECEIVE A REDUCER DISPATCH FUNCTION INSTEAD OF A NORMAL EMPTY FUNCTION, AND LUCKILY THE DISPATCH FUNCTION HAS SOME REACT NATIVE CODE INSIDE OF IT, SO ITS LENGTH WILL BE EXACTLY '29'.
  const modalDispatch = useModalDispatch()

  const { push } = usePixel();

  const {
    size = defaultButtonProps?.size,
    variant = defaultButtonProps?.variant,
  } = buttonProps
  const classes = useButtonClasses({ variant, size })
  const [shouldReplaceUrl, setShouldReplaceUrl] = useState(
    Boolean(modalDispatch.toString().length >= 29)
  )

  useEffect(() => {
    // if the link is in a modal it should replace the url instead of just pushing a new one
    setShouldReplaceUrl(Boolean(modalDispatch.toString().length >= 29))
  }, [modalDispatch])

  const rootClasses = classnames(handles.link, {
    [`${handles.buttonLink} ${classes.container}`]: displayMode === 'button',
  })

  const labelClasses = classnames(handles.label, {
    [classes.label]: displayMode === 'button',
  })

  const handlePrevent = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  const noSpaceLink = resolvedLink.replace(/ /g, "-");

  const pushAnalyticsEvent = () => {
    if (isAnalyticsEvent) {
      push({
        event: analyticsEventName,
        url: noSpaceLink,
        productName: productContext?.selectedItem?.nameComplete,
        productCode: productContext?.selectedItem?.name,
        label: label ? label : displayMode === 'label' && hasChildren(children) ? (children as any)[0].props.blockProps.text : '',
        //se è multilingua la props viene settata nella lingua madre
        data: analyticsData
      })
    }
  }

  return (
    <div onClick={(e) => { pushAnalyticsEvent(); isPrevent && handlePrevent(e) }} className={handles.linkContainer}>
      <Link
        target={target}
        to={noSpaceLink}
        className={rootClasses}
        replace={shouldReplaceUrl}
      >
        {label && <span className={labelClasses}>{label}</span>}
        {hasChildren(children) && displayMode === 'anchor' && (
          <div className={handles.childrenContainer}>{children}</div>
        )}
        {hasChildren(children) && displayMode === 'label' && (
          children
        )}
      </Link>
    </div>
  )
}

ProductLink.schema = { title: 'admin/editor.product-link.title' }

export default ProductLink
