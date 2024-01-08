export const formatPrice = (price: number, currency: string) => {
  return `${currency}${(price / 100)
    ?.toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const formatPriceMultilanguage = (price: number, currency: string) => {
  return `${currency}${(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
