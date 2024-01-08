import push from '../utils/push'
import { Order, PixelMessage, ProductOrder } from '../../typings/events'
import { getData, getProductsFromOrderData } from '../utils/product-utils'
import { variantNames } from '../utils/product-utils'
import { getBinding } from '../utils/product-utils'
// import { Item } from '../../typings/ProductTypes'
import { AnalyticsEcommerceProduct } from '../../typings/gtm'

export async function sendCartAndCheckoutEcommerceEvents(e: PixelMessage) {

  const alternativeValue = ""

  switch (e.data.eventName) {
    case 'vtex:ga4-view_cart': {
      const { orderForm } = e.data
      var items = orderForm.items
      let cartItems: any[] = []

      await Promise.all(
        items.map(async (value: any) => {
          var categoryIdsSplitted = value.productCategoryIds.split('/')
          let spec = await getSpecificationFromProduct(value.id)

          let category = await getStringCategoryFromId(
            categoryIdsSplitted[categoryIdsSplitted.length - 2]
          )
          const promoStatus =
            value.price < value.listPrice ? 'In Promo' : 'Not in Promo'

          var obj = {
            item_id: value.refId,
            item_name: remove12ncName(value.name, value.refId),
            currency: e.data.currency,
            item_brand: 'Hotpoint',
            item_variant: getValuefromSpecifications(spec, 'Colour'),
            item_category: category.AdWordsRemarketingCode,
            price: value.isGift ? 0 : value.sellingPrice / 100,
            quantity: value.quantity,
            // also known as dimension4
            sellable_status:
              getValuefromSpecifications(spec, `sellable${getBinding(window)}`) === 'true'
                ? 'Sellable Online'
                : 'Not Sellable Online',
            product_type: getValuefromSpecifications(spec, 'field5'), // also known as dimension5
            promo_status: promoStatus, // also known as dimension6
          }

          cartItems.push(obj)
        })
      )

      window.dataLayer.push({ ecommerce: null })
      window.dataLayer.push({
        event: 'view_cart',
        ecommerce: {
          items: cartItems,
        },
      })
      // End of GA4FUNREQ73
      break
    }

    case 'vtex:ga4-coupon': {
      push({
        event: 'coupon_add',
        coupon_validity: e.data.isValid,
        name: e.data.eventAction,
      })
      break
    }
    case 'vtex:eec.checkout': {
      const orderForm = e?.data?.orderForm

      const items = orderForm?.items
      let products: any[] = []

      await Promise.all(
        items.map(async (item: any) => {
          var categoryIdsSplitted = item.productCategoryIds.split('/')
          let category = await getStringCategoryFromId(
            categoryIdsSplitted[categoryIdsSplitted.length - 2]
          )

          var obj = {
            name: item.name,
            id: item.productId,
            price: item.isGift ? 0 : item.price / 100,
            brand: item.seller,
            category: category.AdWordsRemarketingCode,
            variant: getData(
              item.properties?.find((prop: any) =>
                variantNames.includes(prop.name?.toLowerCase())
              )?.values?.[0], alternativeValue
            ), // prod variant
            quantity: item.quantity,
            dimension4: 'Sellable Online',
            dimension5: getData(item?.properties?.find(
              (prop: any) => prop.name == 'constructionType'
            )?.values?.[0], alternativeValue),
            dimension6:
              item.listPrice != item.price ? 'In Promo' : 'Not in Promo',
          }
          products.push(obj)
        })
      )

      push({
        event: 'eec.checkout',
        ecommerce: {
          currencyCode: 'GBP',
          checkout: {
            actionField: {
              step: e.data.step,
            },
            products: products,
          },
        },
      })

      break
    }
    case 'vtex:leadGeneration': {
      push({
        event: 'optin',
        eventCategory: 'Lead Generation',
        eventAction: 'Optin granted',
        eventLabel: 'checkout',
      })
      break
    }
    case 'vtex:addToCart': {
      console.log("new gtm app --- addToCart")
      const item = e.data.item
      push({
        event: 'eec.addToCart',
        ecommerce: {
          currencyCode: 'GBP',
          add: {
            actionField: {
              action: 'add',
            },
            products: [
              {
                name: item.name,
                id: item.productId,
                price: `${item.price}` == '0' ? '' : `${item.price}`,
                brand: item.additionalInfo.brandName,
                category:
                  '' /* values[1].AdWordsRemarketingCode */ /* Chiedere Per Categoria */,
                quantity: item.quantity,
                variant: item.colour,
                dimension4:
                  item?.sellable === 'true'
                    ? 'Sellable Online'
                    : 'Not Sellable Online',
                dimension5: item?.field5,
              },
            ],
          },
        },
      })
      break
    }
    case 'vtex:removeFromCart': {
      console.log("new gtm app ---> removeFromCart")
      const item = e.data.item
      push({
        event: 'eec.removeFromCart',
        ecommerce: {
          currencyCode: 'GBP',
          add: {
            actionField: {
              action: 'remove',
            },
            products: [
              {
                name: item.name,
                id: item.productId,
                price: `${item.price}` == '0' ? '' : `${item.price}`,
                brand: item.additionalInfo.brandName,
                category:
                  '' /* values[1].AdWordsRemarketingCode */ /* Chiedere Per Categoria */,
                quantity: item.quantity,
                variant: item.colour,
                dimension4:
                  item?.sellable === 'true'
                    ? 'Sellable Online'
                    : 'Not Sellable Online',
                dimension5: item?.field5,
              },
            ],
          },
        },
      })
      break
    }
    case 'vtex:cartState': {
      console.log("new gtm app ---> cartState")

      const items = e.data?.orderForm?.items
      let product = items?.map((item: any) => ({
        id: item.productId,
        price: item.isGift ? 0 : item.sellingPrice / 100,
        quantity: item.quantity,
      }))

      push({
        event: 'cartState',
        product,
      })

      break
    }

    case "vtex:servicesPurchase": {
      getProductsFromOrderData(
        e.data.data,
        e.data.data.transactionProducts,
        e.data.currency
      )

      const ecommerce = {
        purchase: {
          actionField: getPurchaseObjectData(e.data.data),
          products: e.data.data.transactionProducts.map(
            (product: ProductOrder) => getProductObjectData(product)
          ),
        },
      }

      // Backwards compatible event
      push({
        ecommerce,
        event: "pageLoaded",
      })

      return
    }
    case "vtex:cartChanged": {
      console.log("new gtm app ---> cartChanged")

      let products = e.data.items
      pushCartState(products)
      break
    }
    case "vtex:cartLoaded": {
      console.log("new gtm app ---> cartLoaded")
      const { orderForm } = e.data


      push({
        event: "eec.checkout",
        ecommerce: {
          checkout: {
            actionField: {
              step: 1,
            },
            products: orderForm.items.map(getCheckoutProductObjectData),
          },
        },
      })
      break
    }
  }
}


/*------------- FUNCTIONS-------------*/
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}

function getSpecificationFromProduct(productId: any) {
  return fetch(
    '/_v/wrapper/api/catalog_system/products/' + productId + '/specification',
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err))
}

function getStringCategoryFromId(categoryId: any) {
  return fetch('/_v/wrapper/api/catalog/category/' + categoryId, options).then(
    (response) => response.json()
  )
}
function remove12ncName(name: any, code: any) {
  if (name.indexOf(code) !== -1) {
    return name.replace(code, '').trim()
  } else {
    return name
  }
}
function getValuefromSpecifications(specifications: any, name: any) {
  const result = specifications.filter((s: any) => s.Name === name)
  if (result.length === 0) {
    return ''
  } else {
    return specifications.filter((s: any) => s.Name === name)[0].Value[0]
  }
}
function setPriceFormat(price: string) {
  let newPrice = parseInt(price) / 100 + ""
  if (newPrice.indexOf(".") == -1) {
    return parseInt(newPrice).toFixed(2)
  } else {
    let arrayPrice = newPrice.split(".")
    return parseInt(arrayPrice[1]) < 10 ? newPrice + "0" : newPrice
  }
}

function objectHasEmptyValue(objects: any) {
  let keys = Object.keys(objects[0])
  let flag = false
  objects.forEach((e: any) => {
    for (let i = 0; i < keys.length; i++) {
      if (e[keys[i]] === "") {
        flag = true
      }
    }
  })
  return flag
}

function checkCart(dataLayer: any, products: any) {
  let results = dataLayer.filter((e: any) => e.event === "cartState")
  if (results.length == 0) {
    return false
  } else {
    if (
      JSON.stringify(results[results.length - 1].products) ==
      JSON.stringify(products)
    ) {
      return true
    } else {
      return false
    }
  }
}

function pushCartState(products: any) {
  if (products.length !== 0) {
    if (objectHasEmptyValue(products)) {
      return
    }
  }
  let formatForProducts =
    products.length !== 0 ? getProductFromCartState(products) : []
  if (!checkCart(window.dataLayer, formatForProducts)) {
    push({
      event: "cartState",
      products: formatForProducts,
    })
  }
}

function getProductFromCartState(products: any) {
  let newProducts: any = []

  products.forEach((element: any) => {
    var obj = {
      id: element.referenceId,
      price:
        element.price == "0" || element.price == 0
          ? ""
          : setPriceFormat(`${element.price}`),
      quantity: element.quantity,
    }
    newProducts.push(obj)
  })
  return newProducts
}

function getCheckoutProductObjectData(
  item: AnalyticsEcommerceProduct
) {
  return {
    id: item.id,
    name: item.name,
    category: Object.keys(item.productCategories ?? {}).reduce(
      (categories, category) =>
        categories ? `${categories}/${category}` : category,
      ""
    ),
    brand: item.additionalInfo?.brandName ?? "",
    variant: item.skuName,
    price: item.sellingPrice / 100,
    quantity: item.quantity,
  }
}

function getPurchaseObjectData(order: Order) {
  return {
    affiliation: order.transactionAffiliation,
    coupon: order.coupon ? order.coupon : null,
    id: order.orderGroup,
    revenue: order.transactionTotal,
    shipping: order.transactionShipping,
    tax: order.transactionTax,
  }
}
function getProductObjectData(product: ProductOrder) {
  return {
    brand: product.brand,
    //@ts-ignore
    category: product.properties
      ? getCategoryID(product)
      : product.categoryId || "additionalServices",
    id: product.sku,
    name: product.name,
    price: product.price == 0 ? "" : product.price,
    quantity: product.quantity,
    variant: product.skuName,
    //dimension4: getDimension(product, 4),
    //dimension5: getDimension(product, 5),
    dimension6:
      product.sellingPrice === product.originalPrice
        ? "Not in promo"
        : "In promo",
  }
}
function getCategoryID(product: any) {
  const categoryId = product.properties.filter(
    (obj: any) => obj.name.toLowerCase() === "adwordsMarketingCode"
  )
  return categoryId
}
/*------------- END FUNCTIONS-------------*/
