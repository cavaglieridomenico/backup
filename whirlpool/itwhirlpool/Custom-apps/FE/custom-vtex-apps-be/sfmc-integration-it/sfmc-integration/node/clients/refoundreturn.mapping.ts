export function refundMapping(product: any): Promise<{
    To: {};
}> {
    return new Promise((resolve) => {
        let object: {
            To: any;
        } = {
            To: {
                Address: product.email,
                SubscriberKey: product.email,
                ContactAttributes: {
                    SubscriberAttributes: {
                        FirstName: product.name,
                        Surname: product.surname,
                        City: product.city,
                        Address: product.address,
                        ClientEmail: product.email,
                        PhoneNumber: product.phoneNumber,
                        PickupAddress: product.pickUpAddress,
                        OrderNumber: product.orderNumber,
                        ProductCode: product.productCode,
                        DeliveredDate: product.deliveredDate,
                        DocumentTransportNumber: product.documentTransportNumber,
                        RefundReason: product.refundReason,
                        Note: product.note,
                        Country: product.country,
                        Zip: product.zip
                    }
                }
            }
        }
        resolve(object)
    })
}

export function returnMapping(product: any): Promise<any> {
    return new Promise((resolve) => {
           let object: {
            To: any;
        } = {
            To: {
                Address: product.email,
                SubscriberKey: product.email,
                ContactAttributes: {
                    SubscriberAttributes: {
                        FirstName: product.name,
                        Surname: product.surname,
                        City:product.city,
                        Address: product.address,
                        ClientEmail: product.email,
                        PhoneNumber: product.phoneNumber,
                        OrderNumber: product.orderNumber,
                        ProductCode: product.productCode,
                        DeliveredDate: product.deliveredDate,
                        DocumentTransportNumber: product.documentTransportNumber,
                        ReturnReason: product.returnReason ,
                        Note: product.note,
                        Country: product.country,
                        Zip: product.zip
                    }
                }
            }
        }
        resolve(object)
    })
}
