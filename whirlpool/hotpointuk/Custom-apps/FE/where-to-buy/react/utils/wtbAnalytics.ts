function isPlpPage(url: string) {
    return url?.includes("appliances")
}

export function sendIntentionToBuyEvent(dataLayer: any, url: string, productCode: string, productName: string) {
    const isBothPresent = productCode && productName
    const productLabel = isBothPresent && `${productCode} - ${productName}`
    const isPlp = isPlpPage(url)
    const eventLabel = isPlp ? 'Product From Product List' : productLabel;
    return dataLayer.push({ 'event': 'intentionToBuy', 'eventCategory': 'Intention to Buy','eventAction': 'Pop Retail List', 'eventLabel': eventLabel })
}

export function sendIntentionToBuyEventOnBuyNow(dataLayer: any, url: string, productCode: string, productName: string, merchantName: string) {
    const isBothPresent = productCode && productName
    const productLabel = isBothPresent && `${productCode} - ${productName}`
    const isPlp = isPlpPage(url)
    const eventLabel = isPlp ? 'Product From Product List' : productLabel;
    return dataLayer.push({ 'event': 'intentionToBuy', 'eventCategory': 'Intention to Buy', 'eventAction': `Buy now - ${merchantName}`, 'eventLabel': eventLabel })
}