import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { ModalContext } from 'vtex.modal-layout'
import { formatIOMessage } from 'vtex.native-types'
import { Link } from 'vtex.render-runtime'

import { usePixel } from "vtex.pixel-manager"
import hasChildren from './modules/hasChildren'
import useButtonClasses, { Variant } from './modules/useButtonClasses'
import { useInterpolatedLink } from './modules/useInterpolatedLink'

type DisplayMode = 'anchor' | 'button'
type Size = 'small' | 'regular' | 'large'

export interface ButtonProps {
  variant: Variant
  size: Size
}

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

interface AllProps {
  href: string
  label: string
  target?: string
  scrollTo?: string
  escapeLinkRegex?: string
  children: React.ReactNode
  displayMode?: DisplayMode
  buttonProps?: Partial<ButtonProps>
  isPrevent?:boolean
  isAnalyticsEvent?:boolean
  analyticsEventName?:string
  analyticsType?: string
  clickArea?: string
  checkpoint?: string,
  analyticsData?: AnalyticsData
}
interface AnalyticsData {
  [index: string]: any,
}

export type Props = RequireOnlyOne<AllProps, 'label' | 'children'>

defineMessages({
  labelTitle: {
    id: 'admin/editor.link.label.title',
    defaultMessage: '',
  },
})

export const defaultButtonProps: ButtonProps = {
  variant: 'primary',
  size: 'regular',
}

const { useModalDispatch } = ModalContext
const CSS_HANDLES = ['linkContainer','link', 'label', 'childrenContainer', 'buttonLink']

function StoreLink(props: Props) {
  const {
    label,
    href,
    target,
    children,
    buttonProps = defaultButtonProps,
    scrollTo,
    displayMode = 'anchor',
    isPrevent = true,
    isAnalyticsEvent = false,
    analyticsEventName = "",
    analyticsType = "",
    clickArea = "",
    checkpoint = "",
    analyticsData = undefined
  } = props
  const { variant, size } = {
    ...defaultButtonProps,
    ...buttonProps,
  }
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
    // MODAL DISPATCH IS ALWAYS AN EMPTY FUNCTION, NO MATTER IF WE ARE INSIDE A MODAL CONTEXT OR NOT, SO THE CONDITION ON 'REPLACE' PROPS OF LINK WILL ALWAYS BE TRUE. THE ONLY WAY TO HANDLE THIS IS TO TRANSFORM IT IN A STRING AND CHECK ITS LENGTH. IF WE ARE INSIDE A MODAL CONTEXT WE RECEIVE A REDUCER DISPATCH FUNCTION INSTEAD OF A NORMAL EMPTY FUNCTION, AND LUCKILY THE DISPATCH FUNCTION HAS SOME REACT NATIVE CODE INSIDE OF IT, SO ITS LENGTH WILL BE EXACTLY '29'.
  const modalDispatch = useModalDispatch()
  const classes = useButtonClasses({ variant, size })
  const resolvedLink = useInterpolatedLink(href)

  const { push } = usePixel();

  const [shouldReplaceUrl, setShouldReplaceUrl] = useState(
    Boolean(modalDispatch.toString().length >= 29)
  )

  useEffect(() => {
    setShouldReplaceUrl(Boolean(modalDispatch.toString().length >= 29))
  }, [modalDispatch])

  const rootClasses = classnames(handles.link, {
    [`${handles.buttonLink} ${classes.container}`]: displayMode === 'button',
  })

  const labelClasses = classnames(handles.label, {
    [classes.label]: displayMode === 'button',
  })

  const scrollOptions = scrollTo ? { baseElementId: scrollTo } : undefined

  const localizedLabel = formatIOMessage({ id: label, intl })
  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePrevent = (e: React.MouseEvent) =>{
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
}
    //GA4 Events - Note: in Theme app use "isPrevent":false
  const pushAnalyticsEvent = () => {
    if (isAnalyticsEvent) {
      if (analyticsEventName == "cta_click") {
        push({
          event: analyticsEventName,
          ctaClick: [{ linkUrl: href, linkText: label, area: clickArea, checkpoint: checkpoint, type: analyticsType }]
        })
      }
      else {
        push({
          event: analyticsEventName,
          type: analyticsType,
          linkUrl: href,
          linkText: label,
          checkpoint: checkpoint,
          clickArea: clickArea,
          data: analyticsData
        })
      }
    }
  }

  return (
    mounted ?
    <div onClick={(e: React.MouseEvent) => { pushAnalyticsEvent(); isPrevent && handlePrevent(e) }} className={handles.linkContainer}>
      <Link
        to={resolvedLink}
        target={target}
        className={rootClasses}
        replace={shouldReplaceUrl}
        scrollOptions={scrollOptions}
        onClick={(e: React.MouseEvent) => { isPrevent && handlePrevent(e) }}
      >
        {label && <span className={labelClasses}>{localizedLabel}</span>}
        {hasChildren(children) && (
          <div className={handles.childrenContainer}>{children}</div>
        )}
      </Link>
    </div>
    :
    <></>
  )
}

StoreLink.schema = {
  title: 'Link',
}

export default StoreLink
