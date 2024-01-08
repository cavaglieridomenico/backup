// Format the price in the format XX,XX
export const formatPrice = (price: number, currency: string) => {
  return `${currency} ${(price / 100)?.toFixed(2).replace(',', '.')}`
}
export const formatPriceWithoutCurrency = (price: number) => {
  return (price / 100)?.toFixed(2)
}