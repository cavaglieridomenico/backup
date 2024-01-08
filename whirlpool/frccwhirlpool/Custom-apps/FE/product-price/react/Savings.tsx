import React, {useState, useEffect} from 'react'
import { defineMessages, useIntl, IntlFormatters } from 'react-intl'
import { useProduct } from 'vtex.product-context'
import { FormattedCurrency } from 'vtex.format-currency'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { ProductSummaryContext } from 'vtex.product-summary-context'

import { getDefaultSeller } from './modules/seller'

const CSS_HANDLES = [
  'savings',
  'previousPriceValue',
  'newPriceValue',
  'savingsValue',
  'savingsWithTax',
  'savingsPercentage',
] as const

const messages = defineMessages({
  title: {
    id: 'admin/savings.title',
  },
  description: {
    id: 'admin/savings.description',
  },
  default: {
    id: 'store/savings.default',
  },
})

// This is essentially a space char (" ") that doesn't allow line breaks
// It is needed because the formatNumber function returns it that way
const NON_BREAKING_SPACE_CHAR = String.fromCharCode(160)

interface GetFormattedSavingsPercentageParams {
  formatNumber: IntlFormatters['formatNumber']
  savingsPercentage: number
  percentageStyle: Props['percentageStyle']
}

function getFormattedSavingsPercentage({
  formatNumber,
  savingsPercentage,
  percentageStyle,
}: GetFormattedSavingsPercentageParams) {
  const formattedSavingsPercentage = formatNumber(savingsPercentage, {
    style: 'percent',
  })

  if (percentageStyle === 'compact') {
    return formattedSavingsPercentage.replace(
      `${NON_BREAKING_SPACE_CHAR}%`,
      '%'
    )
  }

  return formattedSavingsPercentage
}

interface WindowRuntime extends Window  {
  __RUNTIME__:any
}

export async function getUserSession(): Promise<any> {
  return fetch(`/api/sessions?items=*`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
}


interface Props {
  message?: string
  markers?: string[]
  percentageStyle?: 'locale' | 'compact'
  /** Used to override default CSS handles */
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

function Savings({
  message = messages.default.id,
  markers = [],
  percentageStyle = 'locale',
  classes,
}: Props) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes })
  const { formatNumber } = useIntl()
  const productContextValue = useProduct()
  const productSummaryValue = ProductSummaryContext.useProductSummary()

  const seller = getDefaultSeller(productContextValue?.selectedItem?.sellers)

  const commercialOffer = seller?.commertialOffer

  if (
    !commercialOffer ||
    // commercialOffer?.AvailableQuantity <= 0 ||
    productSummaryValue?.isLoading
  ) {
    return null
  }

  // const previousPriceValue = commercialOffer.ListPrice
  // const newPriceValue = commercialOffer.Price
  // const savingsValue = previousPriceValue - newPriceValue
  // const savingsWithTax =
  //   savingsValue + savingsValue * commercialOffer.taxPercentage



  const outOfStock = !commercialOffer || commercialOffer?.AvailableQuantity <= 0

  const [currentSc, setCurrentSc] = useState<any>(null);
  const [newPriceValue] = useState<any>(commercialOffer.Price);
  const [previousPriceValue] = useState<any>(commercialOffer.ListPrice);
  const [savingsValue] = useState<any>(previousPriceValue - newPriceValue);
  const [savingsWithTax] = useState<any>(savingsValue + savingsValue * commercialOffer.taxPercentage);

  const savingsPercentage = savingsValue / previousPriceValue
  let runtime = (window as unknown as WindowRuntime).__RUNTIME__


  useEffect(() => {
    if(JSON.parse(atob(runtime.segmentToken)).channel === null) {
      getUserSession()
      .then((response) => response.json())
      .then((data: any) => {
        setCurrentSc(data.namespaces.store.channel.value)
        // localStorage.setItem('Current-SC', data.namespaces.store.channel.value)
      });
    } else {
      setCurrentSc(JSON.parse(atob(runtime.segmentToken)).channel)
    }
  }, []);

  useEffect(() => {
    handleShowPrice()
  }, [currentSc]);

  const getPropertyValue = (indexString: string) => {
    const showPriceSpecIndex = productContextValue?.product?.properties.map(productSpecification => productSpecification.name).indexOf(indexString)
    const showPriceString = (showPriceSpecIndex && showPriceSpecIndex !== -1) && productContextValue?.product?.properties[showPriceSpecIndex].values[0]
    const showPrice = showPriceString === "true" ? true : false
    return showPrice
  }

  const handleShowPrice = () => {
    const isDiscontinued = getPropertyValue('isDiscontinued')
    switch (currentSc) {
      case '1':
        const showPriceEPP = getPropertyValue('showPriceEPP')
        const sellableEPP = getPropertyValue('sellableEPP')
        if((showPriceEPP && outOfStock) || isDiscontinued || (!sellableEPP || !showPriceEPP)) return false
        break;
      case '2':
        const showPriceFF = getPropertyValue('showPriceFF')
        const sellableFF = getPropertyValue('sellableFF')
        if((showPriceFF && outOfStock) || isDiscontinued || (!sellableFF || !showPriceFF)) return false
        break;
      case '3':
        const showPriceVIP = getPropertyValue('showPriceVIP')
        const sellableVIP = getPropertyValue('sellableVIP')
        if((showPriceVIP && outOfStock) || isDiscontinued || (!sellableVIP || !showPriceVIP)) return false
        break;
      default:
        return false
    }
    return true
  }
  
  if (savingsValue <= 0) {
    return null
  }

  return (
    <span 
    // style={{display: handleShowPrice() ? 'block' : 'none'}} 
    className={handles.savings}>
      <IOMessageWithMarkers
        message={message}
        markers={markers}
        handleBase="savings"
        values={{
          previousPriceValue: (
            <span
              key="previousPriceValue"
              className={handles.previousPriceValue}
            >
              <FormattedCurrency value={previousPriceValue} />
            </span>
          ),
          newPriceValue: (
            <span key="newPriceValue" className={handles.newPriceValue}>
              <FormattedCurrency value={newPriceValue} />
            </span>
          ),
          savingsValue: (
            <span key="savingsValue" className={handles.savingsValue}>
              <FormattedCurrency value={savingsValue} />
            </span>
          ),
          savingsWithTax: (
            <span key="savingsWithTax" className={handles.savingsWithTax}>
              <FormattedCurrency value={savingsWithTax} />
            </span>
          ),
          savingsPercentage: (
            <span key="savingsPercentage" className={handles.savingsPercentage}>
              {getFormattedSavingsPercentage({
                formatNumber,
                savingsPercentage,
                percentageStyle,
              })}
            </span>
          ),
        }}
      />
    </span>
  )
}

Savings.schema = {
  title: messages.title.id,
}

export default Savings
