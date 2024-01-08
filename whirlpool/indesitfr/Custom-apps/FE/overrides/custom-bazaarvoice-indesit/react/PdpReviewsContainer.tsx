import React, { createRef, useEffect } from 'react'
import { usePixel } from 'vtex.pixel-manager'

interface PdpReviewsContainerProps {}

const PdpReviewsContainer: React.FC<PdpReviewsContainerProps> = ({
  children,
}) => {
  const { push } = usePixel()
  const containerRef = createRef<HTMLDivElement>()

  //GA4FUNREQ34
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            push({ event: 'ga4-reviews_interaction' })
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.1,
      }
    )
    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current)
    }
  }, [containerRef.current])
  /*-----------*/

  return (
    <div id="pdp-reviews-container" ref={containerRef}>
      {children}
    </div>
  )
}

export default PdpReviewsContainer
