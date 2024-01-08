//@ts-ignore
//@ts-nocheck

/**
 * refundMapping 
 * @param product 
 * @returns 
 */
export function refundMapping(product: any): Object{
    let object = {
        To: {
            Address: product?.ContactAttributes?.SubscriberAttributes?.ClientEmail,
            SubscriberKey: product?.ContactAttributes?.SubscriberAttributes?.ClientEmail,
            ContactAttributes: {
                SubscriberAttributes: {
                    FirstName: product?.ContactAttributes?.SubscriberAttributes?.FirstName,
                    Surname: product?.ContactAttributes?.SubscriberAttributes?.Surname,
                    City: product?.ContactAttributes?.SubscriberAttributes?.City,
                    Address: product?.ContactAttributes?.SubscriberAttributes?.Address,
                    ClientEmail: product?.ContactAttributes?.SubscriberAttributes?.ClientEmail,
                    PhoneNumber: product?.ContactAttributes?.SubscriberAttributes?.PhoneNumber,
                    PickupAddress: product?.ContactAttributes?.SubscriberAttributes?.pickUpAdddress,
                    OrderNumber: product?.ContactAttributes?.SubscriberAttributes?.OrderNumber,
                    ProductCode: product?.ContactAttributes?.SubscriberAttributes?.ProductCode,
                    DeliveredDate: product?.ContactAttributes?.SubscriberAttributes?.DeliveredDate,
                    DocumentTransportNumber: product?.ContactAttributes?.SubscriberAttributes?.DocumentTransportNumber,
                    ReturnReason:  product?.ContactAttributes?.SubscriberAttributes?.RefundReason, // since the email templates have been swapped, also the related reasons need to be swapped //
                    Note:  product?.ContactAttributes?.SubscriberAttributes?.Note,
                    Country:  product?.ContactAttributes?.SubscriberAttributes?.Country,
                    Zip:  product?.ContactAttributes?.SubscriberAttributes?.Zip,
                    itemType:  product?.ContactAttributes?.SubscriberAttributes?.itemType
                }
            }
        }
    };
    return object;
}

/**
 * returnMapping
 * @param product 
 * @returns 
 */
export function returnMapping(product: any): Object {
    let object = {
        To: {
            Address: product?.ContactAttributes?.SubscriberAttributes?.ClientEmail,
            SubscriberKey: product?.ContactAttributes?.SubscriberAttributes?.ClientEmail,
            ContactAttributes: {
                SubscriberAttributes: {
                    FirstName:  product?.ContactAttributes?.SubscriberAttributes?.FirstName,
                    Surname:  product?.ContactAttributes?.SubscriberAttributes?.Surname,
                    City: product?.ContactAttributes?.SubscriberAttributes?.City,
                    Address:product?.ContactAttributes?.SubscriberAttributes?.Address,
                    ClientEmail: product?.ContactAttributes?.SubscriberAttributes?.ClientEmail,
                    PhoneNumber: product?.ContactAttributes?.SubscriberAttributes?.PhoneNumber,
                    OrderNumber: product?.ContactAttributes?.SubscriberAttributes?.OrderNumber,
                    ProductCode: product?.ContactAttributes?.SubscriberAttributes?.ProductCode,
                    PickupAddress: product?.ContactAttributes?.SubscriberAttributes?.pickUpAdddress, // not required in SFMC documentation //
                    DeliveredDate: product?.ContactAttributes?.SubscriberAttributes?.DeliveredDate,
                    DocumentTransportNumber: product?.ContactAttributes?.SubscriberAttributes?.DocumentTransportNumber, // since the email templates have been swapped, also the related reasons need to be swapped //
                    RefundReason: product?.ContactAttributes?.SubscriberAttributes?.RefundReason,
                    Note: product?.ContactAttributes?.SubscriberAttributes?.Note,
                    Country: product?.ContactAttributes?.SubscriberAttributes?.Country,
                    Zip: product?.ContactAttributes?.SubscriberAttributes?.Zip,
                    itemType: product?.ContactAttributes?.SubscriberAttributes?.itemType
                }
            }
        }
    };
    return object;
}
