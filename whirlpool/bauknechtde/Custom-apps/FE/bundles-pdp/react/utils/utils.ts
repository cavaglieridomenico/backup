export const formatPrice = (price: number | string | undefined) =>
  price ? `€ ${(+price).toFixed(2).replace('.', ',')}` : ''

export const formatSkuItems = (skuItems: any) => {
  return skuItems.map((item: any, index: number) => {
    return {
      brand: item.product?.brand,
      category: '',
      detailUrl: `/${item?.product?.linkText}/p`,
      ean: '',
      id: item.itemId,
      imageUrl: item.sku?.images?.[0].imageUrl,
      index: index,
      listPrice: item.sku?.sellers?.[0].commertialOffer?.ListPrice,
      measurementUnit: 'un',
      name: item.product?.productName,
      options: null,
      price: item.sku?.sellers?.[0].commertialOffer?.Price,
      productId: item.product?.productId,
      productRefId: item?.sku?.name,
      quantity: 1,
      referenceId: item?.sku?.name,
      seller: 1,
      sellerName: item?.sku?.sellers?.[0].sellerName,
      sellingPrice: item.sku?.sellers?.[0].commertialOffer?.Price,
      sellingPriceWithAssemblies: item.sku?.sellers?.[0].commertialOffer?.Price,
      skuName: item?.sku?.name,
      uniqueId: item?.sku?.name,
      variant: item?.sku?.name,
      skuId: item.itemId,
    }
  })
}
