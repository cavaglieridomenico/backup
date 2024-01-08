import React, { useState, useEffect } from 'react'

interface stickyWrapperInterface {}

const StickyWrapper: StorefrontFunctionComponent<stickyWrapperInterface> = ({children}) => {
  // const containerRef = useRef<any>()
  const [isVisible, setIsVisible] = useState(false)
  
  const callback = (entries: any) => {
    const [entry] = entries
    setIsVisible(entry.isIntersecting)
    
  }
  
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: [1]
  }
  
  let target = window?.document?.querySelector('.vtex-flex-layout-0-x-flexRow--AddToCartPdp')
  
  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    if(target) {
      observer.observe(target)
    }

    return () => {
      if(target) {
        observer.unobserve(target)
      }
    }
    
  }, [target, options, isVisible])

  return (
    <>
      {!isVisible ? children : <></>}
    </>
      )
}

StickyWrapper.schema = {
  title: 'editor.supportStickyMenu.title',
  description: 'editor.supportStickyMenu.description',
  type: 'object',
  properties: {},
}

export default StickyWrapper
