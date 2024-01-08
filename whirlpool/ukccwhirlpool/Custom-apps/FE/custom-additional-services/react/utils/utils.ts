export const formatPrice = (price: number, currency: string) => {
  return `${currency}${(price / 100)
    ?.toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const installationServiceName = "Installation"
export const removalServiceName = "Removal"
export const workspaceUrl = "ukccwhirlpool.myvtex.com"
