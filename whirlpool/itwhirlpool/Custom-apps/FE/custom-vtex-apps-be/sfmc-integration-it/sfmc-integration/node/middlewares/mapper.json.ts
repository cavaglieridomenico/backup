import VtexApiConfig from "../clients/vtex.Api.Config";

export function mapperMail(data: any, emailJson: any) {

    // let orderTotal = data.totals[0].value
    let shippingPrice = data.totals.find((t: { id: string; }) => t.id === "Shipping").value;
    let sum = 0
    let sumService = 0
    let quantityService = 0
    data.items.forEach((price: { price: number; quantity: number; bundleItems: [] }) => {
        sum += (price.price * price.quantity)
        if (price.bundleItems?.length > 0) {
            quantityService += price.bundleItems?.length
            price.bundleItems.forEach((item: any) => {
                sumService += (item?.price * item?.quantity)
            })


        }
    })
    let discount = (sum + sumService) - data.value;

    return {
        To: {
            Address: emailJson.email,
            SubscriberKey: emailJson.email,
            ContactAttributes: {
                SubscriberAttributes: {
                    orderId: data.orderId,
                    orderNumberSAP: '',
                    purchaseDate: data.creationDate,
                    paymentMethod: data.paymentData.transactions[0].payments[0].paymentSystemName,
                    creditCardNumber: data.paymentData.transactions[0].payments[0].lastDigits,
                    fiscalCode: getCfOrIva(data),
                    orderProductPrice: sum,
                    orderTotal: data.value,
                    servicePrice: sumService,
                    orderTotalAdjustment: discount,
                    orderShippingPrice: shippingPrice,
                    orderSubtotal: data.value,
                    serviceQuantity: quantityService,
                    shippingFirstName: data.shippingData.address.receiverName,
                    shippingLastName: '',
                    shippingAddress: data.shippingData?.address?.street + ' ' + data.shippingData?.address?.number == null ? '' : data.shippingData?.address?.number == null,
                    shippingZipCode: data.shippingData.address.postalCode,
                    shippingCity: data.shippingData.address.city,
                    shippingState: data.shippingData.address.state,
                    shippingCountry: data.shippingData.address.country,
                    shippingEmail: emailJson.email,
                    shippingPhone: data.clientProfileData.phone,
                    billingFirstName: data.clientProfileData.firstName,
                    billingLastName: data.clientProfileData.lastName,
                    billingAddress: getBillingAddress(data.paymentData.transactions[0].payments[0].billingAddress),
                    billingZipCode: data.paymentData.transactions[0].payments[0].billingAddress?.postalCode,
                    billingCity: data.paymentData.transactions[0].payments[0].billingAddress?.city,
                    billingState: data.paymentData.transactions[0].payments[0].billingAddress?.state,
                    billingCountry: data.paymentData.transactions[0].payments[0].billingAddress?.country,
                    billingEmail: emailJson.email,
                    billingPhone: data?.clientProfileData.phone,
                    billingOfficeAddress: '',
                    shipInstructions: data?.paymentData.transactions[0].payments[0].billingAddress?.complement,
                    redeemedPoints: 0,
                    gainedPoints: 0,
                    delivery: "INCLUSA",
                    estematedDeliveryDate: data?.shippingData.logisticsInfo[0]?.deliveryWindow != null ? parseDataFormat(data?.shippingData.logisticsInfo[0]?.deliveryWindow.startDateUtc, data?.shippingData.logisticsInfo[0]?.deliveryWindow.endDateUtc) : parseDataFormatSingle(data?.shippingData.logisticsInfo[0]?.shippingEstimateDate)
                },
            },
        }

    };

}

export function orderMapperLoad(data: any, baseUrl: any, vtexApi: VtexApiConfig) {
    let orders: any[] = [];
    data.items.forEach((item: { id: any, refId: any, uniqueId: any, quantity: any, productId: any; name: any; ean: any; price: any; detailUrl: any; imageUrl: any; additionalInfo: { brandName: any; }; }) => {
        vtexApi.getProductSkuAlternative(item.id).then((responseSku: any) => {
            const sku = JSON.parse(JSON.stringify(responseSku.data))
            vtexApi.getImagesMain(sku.Id).then(imageMain => {
                const images = JSON.parse(JSON.stringify(imageMain.data))
                const imageSingle = images.find((image: any) => image.IsMain)
                const image = sku.Images.find((i: any) => i.ImageName === imageSingle.Label)?.ImageUrl
                let order =
                    {
                        keys: {
                            orderId: data.orderId,
                            orderItemId: item.uniqueId
                        },
                        values: {
                            commercialCode: sku.ProductSpecifications.find((f: any) => f.FieldName === 'CommercialCode_field')?.FieldValues[0],
                            code12NC: item.refId,
                            orderItemQuantity: item.quantity,
                            price: item.price,
                            productUrl: ('https://' + baseUrl + item.detailUrl),
                            imageUrl: image,
                            brand: item.additionalInfo.brandName,
                            isSuccessfullyPurchased: true,
                            serviceName: getServiceName(item),
                            serviceQuantity: getServiceQuantity(item),
                            servicePrice: getServicePrice(item)
                        }
                    }
                orders.push(order)
            })
        })
    })
    return orders
}

function getCfOrIva(data: any): string {
    if (data?.clientProfileData.document == null) {
        return data?.clientProfileData.corporateDocument == null ? '' : data?.clientProfileData.corporateDocument
    } else {
        return ''
    }
}

export function getBackMeProductMapper(product: any, destination: string, ctx: Context, avalibility: boolean) {
    return {
        Address: destination,
        SubscriberKey: destination,
        ContactAttributes: {
            SubscriberAttributes: {
                ProductName: product.AlternateIds.RefId,
                ProductCode: product.ProductRefId,
                Availability: avalibility,
                ProductImage: product.ImageUrl,
                URL: ('https://' + ctx.vtex.host + product.DetailUrl)
            }
        }
    }

}

function getBillingAddress(address: any) {
    if (address == null) {
        return ''
    } else {
        return address.country == null ? '' : address.country + ' ' + address.city == null ? '' : address.city + ' ' + address.street == null ? '' : address.street + ' ' + address.number == null ? '' : address.number
    }
}

function getServiceName(item: any) {
    let service = null
    if (item?.bundleItems?.length > 0) {
        for (let i = 0; i < item.bundleItems?.length - 1; i++) {
            service = +item.bundleItems[i].name + '|'
        }
        service = item.bundleItems[item.bundleItems.length - 1].name
        return service
    } else {
        return service
    }
}

function getServiceQuantity(item: any) {
    let serviceQuantity = null
    if (item?.bundleItems?.length > 0) {
        for (let i = 0; i < item.bundleItems?.length - 1; i++) {
            serviceQuantity = +item.bundleItems[i].quantity + '|'
        }
        serviceQuantity = item.bundleItems[item.bundleItems.length - 1].quantity
        return serviceQuantity
    } else {
        return serviceQuantity
    }


}

function getServicePrice(item: any) {
    let servicePrice = null
    if (item?.bundleItems?.length > 0) {
        for (let i = 0; i < item.bundleItems?.length - 1; i++) {
            servicePrice = +item.bundleItems[i].sellingPrice + '|'
        }
        servicePrice = item.bundleItems[item.bundleItems.length - 1].sellingPrice
        return servicePrice
    } else {
        return servicePrice
    }
}

function parseDataFormat(data: string, data2: string) {
    let dataOriginal = new Date(data)
    let dataOriginal2 = new Date(data2)
    let dateMounth = dataOriginal.getDate() < 10 ? '0' + dataOriginal.getDate() : dataOriginal.getDate()
    let month = (dataOriginal.getMonth() + 1) < 10 ? '0' + (dataOriginal.getMonth() + 1) : (dataOriginal.getMonth() + 1)
    return '' + dateMounth + '/' + month + '/' + dataOriginal.getFullYear() + ' ' + dataOriginal.getHours() + ':' + (dataOriginal.getMinutes() === 0 ? '00' : dataOriginal.getMinutes()) + ' - ' + dataOriginal2.getHours() + ':' + (dataOriginal2.getMinutes() === 0 ? '00' : dataOriginal2.getMinutes())

}
function parseDataFormatSingle(data: string) {
    let dataOriginal = new Date(data)
      let dateMounth = dataOriginal.getDate() < 10 ? '0' + dataOriginal.getDate() : dataOriginal.getDate()
    let month = (dataOriginal.getMonth() + 1) < 10 ? '0' + (dataOriginal.getMonth() + 1) : (dataOriginal.getMonth() + 1)
    return '' + dateMounth + '/' + month + '/' + dataOriginal.getFullYear() + ' ' + dataOriginal.getHours() + ':' + (dataOriginal.getMinutes() === 0 ? '00' : dataOriginal.getMinutes()) +' verrai contattato dal trasportatore per concordare i dettagli della consegna'

}
