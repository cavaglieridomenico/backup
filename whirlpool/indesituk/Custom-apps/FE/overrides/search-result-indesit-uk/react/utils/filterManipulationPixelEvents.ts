const getCategoryFromObjs = (products: Array<Record<string, unknown>>) => {
  if (products[0] === null || products[0] === undefined) {
    return ''
  }

  const [{ categoryId }] = products
  const result = products.every(
    (product: Record<string, unknown>) => product.categoryId === categoryId
  )

  return result ? categoryId : ''
}

interface PushFilterManipulationPixelEventParams {
  name: string
  value: unknown
  products: Array<Record<string, unknown>>
  checked: string | boolean
  push: (data: {
    event: string
    items: {
      filterProductCategory: unknown
      filterName: string
      filterValue: unknown,
      filterInteraction: string | boolean
    }
  }) => void
}

export const pushFilterManipulationPixelEvent = ({
  name,
  value,
  products,
  checked,
  push,
}: PushFilterManipulationPixelEventParams) => {
  push({
    event: 'filterManipulation',
    items: {
      filterProductCategory: getCategoryFromObjs(products),
      filterName: name,
      filterValue: value,
      filterInteraction: checked
    },
  })
}
