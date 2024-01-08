import push from './push'
import {
  // Order,
  PixelMessage,
  // ProductOrder,
  // Impression,
  // CartItem,
} from '../typings/events'

export async function sendCartAndCheckoutEcommerceEvents(e: PixelMessage) {
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
            item_brand: 'Hotpoint',
            item_variant: getValuefromSpecifications(spec, 'Colour'),
            item_category: category.AdWordsRemarketingCode,
            price: value.isGift ? 0 : value.sellingPrice / 100,
            quantity: value.quantity,
            // also known as dimension4
            sellable_status:
              getValuefromSpecifications(spec, 'sellable') === 'true'
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
            price: item.isGift ? 0 : orderForm.value / 100,
            brand: item.seller,
            category: category.AdWordsRemarketingCode,
            variant: item?.properties?.find(
              (prop: any) => prop.name == 'Colour:' || prop.name == 'Colour'
            )?.values?.[0],
            quantity: item.quantity,
            dimension4: 'Sellable Online',
            dimension5: item?.properties?.find(
              (prop: any) => prop.name == 'constructionType'
            )?.values?.[0],
            dimension6:
              item.listPrice != item.price ? 'In Promo' : 'Not in Promo',
          }
          products.push(obj)
        })
      )
      if (e.data.step == 'step 1') {
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
      } else {
        push({
          event: 'eec.checkout',
          ecommerce: {
            checkout: {
              actionField: {
                step: e.data.step,
              },
              products: products,
            },
          },
        })
      }

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
    case 'vtex:eec.addToCart': {
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
    case 'vtex:eec.removeFromCart': {
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
      const items = e.data?.cartOrderForm?.items
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
/*------------- END FUNCTIONS-------------*/
