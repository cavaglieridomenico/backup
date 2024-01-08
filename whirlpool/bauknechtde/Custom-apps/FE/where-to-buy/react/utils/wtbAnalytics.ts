function isPlpPage(url: string) {
    return url?.includes("hausgeraete")
}

export function sendIntentionToBuyEvent(dataLayer: any, url: string, productCode: string, productName: string) {
    console.log('.....Generating IntentionToBuy event........')
    const isBothPresent = productCode && productName
    const productLabel = isBothPresent && `${productCode} - ${productName}`
    const isPlp = isPlpPage(url)
    const eventLabel = isPlp ? 'Product From Product List' : productLabel;
    console.log('........EventLabel: ' + eventLabel)
    return dataLayer.push({ 'event': 'intentionToBuy', 'eventCategory': 'Intention to Buy','eventAction': 'Pop Retail List', 'eventLabel': eventLabel })
}

export function sendIntentionToBuyEventOnBuyNow(dataLayer: any, url: string, productCode: string, productName: string, merchantName: string) {
    const isBothPresent = productCode && productName
    const productLabel = isBothPresent && `${productCode} - ${productName}`
    const isPlp = isPlpPage(url)
    const eventLabel = isPlp ? 'Product From Product List' : productLabel;
    return dataLayer.push({ 'event': 'intentionToBuy', 'eventCategory': 'Intention to Buy', 'eventAction': `Buy now - ${merchantName}`, 'eventLabel': eventLabel })
}