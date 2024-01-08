// Format the price in the format X,XXX.XX
export const formatPrice = (price: number, currency: string) => {
	return `${currency}${(price / 100)
		?.toFixed(2)
		.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
}
export const formatPriceWithoutCurrency = (price: number) => {
  return (price / 100)?.toFixed(2)
}
