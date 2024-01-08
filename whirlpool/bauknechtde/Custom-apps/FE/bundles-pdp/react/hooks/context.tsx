import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useCallback
} from 'react'
import { useProduct } from 'vtex.product-context'
import { useLazyQuery } from 'react-apollo'
import getProductSpecifications from '../graphql/getProductSpecifications.graphql'
import getKitItems from '../graphql/getKitItems.graphql'

interface Context {
  specifications: any
  isKitAvailable: boolean
  isKitSellable: boolean
  kitItems: any
  loading: boolean
  bundlePdfUrl: string
  selectedCard: number
  setSelectedCard: any
}

const BundlesContext = createContext<Context>({} as Context)

export const BundlesContextProvider: React.FC = ({ children }) => {
  const { product } = useProduct()
  const [kitItems, setKitItems]: any = useState()
  const [selectedCard, setSelectedCard] = useState<number>(0);
  const kitItemsProduct: any[] = product?.items?.[0].kitItems
  const bundlePdfUrl: string = product?.properties?.find(
    (prop: any) => prop.name == 'pdf-bundle-url'
  )?.values[0]

  /*---------------- SORTING ---------------*/
  const itemsSorting = (item1: any, item2: any) => {
    return (
      +(item1?.itemId || item1?.items[0]?.itemId) -
      +(item2?.itemId || item2?.items[0]?.itemId)
    )
  }

  /*--- QUERY ---*/
  // @getKitItems
  const [getKitItemsQuery, { data: kitItemsData }] = useLazyQuery(getKitItems, {
    onCompleted: () => {
      const kitItemsMock =
        kitItemsData?.productsByIdentifier?.[0]?.items?.[0]?.kitItems //Variabile d'appoggio
      setKitItems(kitItemsMock?.sort(itemsSorting))
    },
  })

  useEffect(() => {
    if (!kitItems) {
      if (product && !kitItemsProduct) {
        getKitItemsQuery({
          variables: { field: 'sku', values: product?.items?.[0]?.itemId },
        })
      } else {
        setKitItems(kitItemsProduct?.sort(itemsSorting))
        getProductSpecificationsQuery({
          variables: {
            field: 'sku',
            values: kitItemsProduct?.map((item: any) => item.itemId),
          },
        })
      }
    }
  }, [product?.items])

  useEffect(() => {
    if (kitItems) {
      getProductSpecificationsQuery({
        variables: {
          field: 'sku',
          values: kitItems?.map((item: any) => item.itemId),
        },
      })
    }
  }, [kitItems])

  // @getProductSpecifications
  const [
    getProductSpecificationsQuery,
    { data: specificationsData, loading, error },
  ] = useLazyQuery(getProductSpecifications)

  error && console.error(error)

  console.log(
    specificationsData?.productsByIdentifier,
    'specificationsData?.productsByIdentifier'
  )

  /*---------------- SPECIFICATIONS ---------------*/

  const specifications = specificationsData?.productsByIdentifier
    .sort(itemsSorting)
    .map((prop: any) => {
      return {
        imageUrl: prop.properties.find(
          (spec: any) => spec.name == 'EnergyLogo_image'
        )?.values[0],
        pdfUrl: prop.properties.find((spec: any) => spec.name == 'energy-label' || spec.name == 'new-energy-label')
          ?.values[0],
        productDataSheetUrl: prop.properties.find(
          (spec: any) => /* spec.name == 'product-data-sheet' || */ spec.name == 'product-fiche' || spec.name == 'product-information-sheet'
        )?.values[0],
      }
    })

  console.log(specifications, 'specifications')

  /*---------------- AVAILABLE CONDITIONS ---------------*/
  const isKitAvailable =
    product?.items?.[0].sellers?.[0].commertialOffer?.AvailableQuantity > 0

  const isKitSellable = !specificationsData?.productsByIdentifier.some(
    (item: any) =>
      item.properties.some(
        (prop: any) => prop.name == 'sellable' && prop.values?.[0] == 'false'
      )
  )

  console.log(product, 'BUNDLE INFOS')

  const context = useMemo(
    () => ({
      specifications,
      isKitAvailable,
      isKitSellable,
      kitItems,
      loading,
      bundlePdfUrl,
      selectedCard,
      setSelectedCard
    }),
    [
      specifications,
      isKitAvailable,
      isKitSellable,
      loading,
      kitItems,
      bundlePdfUrl,
      selectedCard,
      useCallback(() => {
        setSelectedCard;
      }, [])
    ]
  )

  return (
    <BundlesContext.Provider value={{ ...context, selectedCard, setSelectedCard }}>
      {children}
    </BundlesContext.Provider>
  )
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useBundle = () => {
  const context = useContext(BundlesContext)

  if (context === undefined) {
    throw new Error('useLogin must be used within BundlesContextProvider')
  }

  return context
}

export default { BundlesContextProvider, useBundle }
