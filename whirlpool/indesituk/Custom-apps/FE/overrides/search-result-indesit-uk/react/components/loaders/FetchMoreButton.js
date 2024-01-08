import React, { Fragment, useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = [
  'buttonShowMore',
  'showingProducts',
  'showingProductsCount',
]

const useShowButton = (to, products, loading, recordsFiltered) => {
  const [showButton, setShowButton] = useState(
    !!products && to + 1 < recordsFiltered
  )

  useEffect(() => {
    if (!loading) {
      setShowButton(!!products && to + 1 < recordsFiltered)
    }
  }, [to, products, loading, recordsFiltered])

  return showButton
}

const FetchMoreButton = (props) => {
  const {
    products,
    to,
    recordsFiltered,
    onFetchMore,
    loading,
    showProductsCount,
    nextPage,
    htmlElementForButton,
  } = props

  const isAnchor = htmlElementForButton === 'a'
  const showButton = useShowButton(to, products, loading, recordsFiltered)
  const handles = useCssHandles(CSS_HANDLES)

  const handleFetchMoreClick = (ev) => {
    isAnchor && ev.preventDefault()
    onFetchMore()
  }
  const [hover, setHover] = useState(false)

  const mouseEnterHandler = e => {
    setHover(true)
  }
  const mouseLeaveHandler = e => {
    setHover(false)
  }

  return (
    <Fragment>
      <>
      
      { showButton && <div className={`${handles.buttonShowMore} w-100 flex justify-center`} style={{
        textTransform: "uppercase",
        outline: "1px solid #0090d0",
        width: "auto",
        fontWeight: 800,
        padding: "1.1em 2.2em",
        borderRadius: "15px",
        cursor: "pointer",
        background: window?.innerWidth > 1280 ?
          loading || hover ? "#0090d0" : "#FFF"
          : "#FFF"
      }}
      onMouseEnter={(ev) => mouseEnterHandler(ev)}
      onMouseLeave={(ev) => mouseLeaveHandler(ev)}
      onClick={(ev) => { handleFetchMoreClick(ev), onMouseLeave(ev) }}
      >
        {showButton && (
          <a
            href={`?page=${nextPage}`}
            rel={isAnchor && 'next'}
            isLoading={loading}
            size="small"
            key={to} // Necessary to prevent focus after click
            onClick={(e) => e.preventDefault()}
            id="seo-anchor"
             style={
              {
                fontFamily: "Roboto",
                textDecoration: "none",
                fontSize: " 16px!important",
                lineHeight: " 19px",
                textAlign: "center",
                letterSpacing: ".04em",
                textTransform: "uppercase !important",
                color: window?.innerWidth > 1280 ?
                  loading || hover ? "#FFF" : "#0090d0"
                  : "#0090d0"
              }

            } tabIndex="0"> <FormattedMessage id="store/search-result.show-more-button" /> </a>

        )}
      </div>}
      </>
      {showProductsCount && recordsFiltered && (
        <div
          className={`${handles.showingProducts} tc t-small pt3 c-muted-2 mt2`}
        >
          <FormattedMessage
            id="store/search-result.showing-products"
            tagName="span"
            values={{
              value: (
                <span className={`${handles.showingProductsCount} b`}>
                  <FormattedMessage
                    id="store/search-result.showing-products-count"
                    values={{
                      productsLoaded: products.length,
                      total: recordsFiltered,
                    }}
                  />
                </span>
              ),
            }}
          />
        </div>
      )}
    </Fragment>
  )
}

export default FetchMoreButton
