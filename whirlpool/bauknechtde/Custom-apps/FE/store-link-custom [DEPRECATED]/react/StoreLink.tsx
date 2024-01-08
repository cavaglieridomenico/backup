import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { Link } from 'vtex.render-runtime'
import { defineMessages, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { ModalContext } from 'vtex.modal-layout'
import { formatIOMessage } from 'vtex.native-types'
import hasChildren from './modules/hasChildren'
import useButtonClasses, { Variant } from './modules/useButtonClasses'
import { useInterpolatedLink } from './modules/useInterpolatedLink'
import { usePixel } from "vtex.pixel-manager"

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
  analyticsType?:string
  clickArea?:string
  analyticsData?: AnalyticsData
  checkpoint?: string
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
    analyticsData = undefined,
    checkpoint = ""
  } = props
  const { variant, size } = {
    ...defaultButtonProps,
    ...buttonProps,
  }
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const modalDispatch = useModalDispatch()
  const classes = useButtonClasses({ variant, size })
  const resolvedLink = useInterpolatedLink(href)

  const { push } = usePixel();

  const [shouldReplaceUrl, setShouldReplaceUrl] = useState(
    Boolean(modalDispatch)
  )

  useEffect(() => {
    setShouldReplaceUrl(Boolean(modalDispatch))
  }, [modalDispatch])

  const rootClasses = classnames(handles.link, {
    [`${handles.buttonLink} ${classes.container}`]: displayMode === 'button',
  })

  const labelClasses = classnames(handles.label, {
    [classes.label]: displayMode === 'button',
  })

  const scrollOptions = scrollTo ? { baseElementId: scrollTo } : undefined

  const localizedLabel = formatIOMessage({ id: label, intl })
  const [mounted,setMounted] = useState<boolean>(false)
  useEffect(()=>{
    setMounted(true)
  },[])

  const handlePrevent = (e: React.MouseEvent) =>{
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  //GA4 Events - Note: in Theme app use "isPrevent":false
  const pushAnalyticsEvent = () =>{
    if(isAnalyticsEvent){
      if(analyticsEventName == "cta_click"){
        push({
          event: analyticsEventName,
          ctaClick: [{linkUrl: href, linkText: label, area: clickArea, checkpoint: checkpoint, type: analyticsType}]
        })
      } else {
        push({
          event: analyticsEventName,
          type: analyticsType,
          linkUrl: href,
          linkText: label,
          clickArea: clickArea,
          checkpoint: checkpoint,
          data: analyticsData
        })
      }
    }
  }

  return (
    mounted ?
    <div onClick={(e: React.MouseEvent) =>{isPrevent && handlePrevent(e); pushAnalyticsEvent()}} className={handles.linkContainer}>
      <Link
        to = {resolvedLink}
        target={target}
        className={rootClasses}
        replace={shouldReplaceUrl}
        scrollOptions={scrollOptions}
        onClick={(e: React.MouseEvent) =>{ isPrevent && handlePrevent(e)}}
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
  title: 'Link'
}

export default StoreLink