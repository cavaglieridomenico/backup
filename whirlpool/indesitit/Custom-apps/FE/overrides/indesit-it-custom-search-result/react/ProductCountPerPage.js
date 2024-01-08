import React from 'react'
import { path } from 'ramda'
import { FormattedMessage, defineMessages } from 'react-intl'

import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['showingProducts', 'showingProductsCount']

const showingAllProductsMessages = defineMessages({
  showingProducts: {
    id: 'store/search-result.showing-all-products',
  },
  showingProductsCount: {
    id: 'store/search-result.showing-all-products-count',
  },
})

const showingProductsMessages = defineMessages({
  showingProducts: {
    id: 'store/search-result.showing-products',
  },
  showingProductsCount: {
    id: 'store/search-result.showing-products-count',
  },
})

const ProductCountPerPage = () => {
  const { searchQuery } = useSearchPage()

  const handles = useCssHandles(CSS_HANDLES)
  const products =
    path(['data', 'productSearch', 'products'], searchQuery) || []
  const recordsFiltered = path(
    ['data', 'productSearch', 'recordsFiltered'],
    searchQuery
  )

  if (products.length === 0) {
    return null
  }
  
  /* if(typeof document !== "undefined") {    slide 69
    let counter
    if(localStorage.getItem("filter") === null) {
      counter = 0;
    } else {
      counter = localStorage.getItem("filter");
    }
    
    // store url on load
    let currentPage = location.href;
    let categoryToCheck = window.location.pathname.split("/")

    // listen for changes
    setInterval(function()
    {
        if (currentPage != location.href)
        {
            // page has changed, set new page as 'current'
            currentPage = location.href;
            
            // do your thing..
            if(categoryToCheck[3] !== window.location.pathname.split("/")[3]) {
              console.log('location changed!');
              localStorage.removeItem("filter");
            }
        }
    }, 500);

    window.onbeforeunload = function() {
      localStorage.removeItem("filter");
      return '';
    };
    document.querySelector(".vtex-rich-text-0-x-paragraph--modal-filter-button").innerHTML = "FILTRI (" + counter + ")"
  } */

  const messages = showingProductsMessages
 /*  const messages =
    products.length === recordsFiltered
      ? showingAllProductsMessages
      : showingProductsMessages */

  return (
    <div
      className={`
        ${handles.showingProducts} tc t-small pt3 c-muted-2
      `}
    >
      <FormattedMessage
        id={messages.showingProducts.id}
        tagName="span"
        values={{
          value: (
            <span className={`${handles.showingProductsCount} b`}>
              <FormattedMessage
                id={messages.showingProductsCount.id}
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
  )
}

export default ProductCountPerPage
