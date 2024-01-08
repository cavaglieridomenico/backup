import {
    getCreationDate,
    getTimeFromDate,
    getShippingDeliveryDateFromCreationDate,
    getBusinessDays
} from './formatDate';
import { map } from 'lodash';

export function singleTypeOrder(order, additionalData,noReseravtion) {
    const { isGAs } = additionalData;
    if(isGAs === "true"){
        return "As you've chosen our connection service for a gas product, our customer support team will contact you to arrange suitable delivery and connection dates for that product. "
    } else {
        switch(order.selectedSla) {
            case "Special" : return "Your appliance will be delivered by Hotpoint Home Solutions. Our team will be in contact using the details supplied to arrange delivery";
            case "LeadTime" : return "Due to high demand, your order or part of it has delayed shipping. We will contact you to arrange delivery once your product is available";
            case "Bundle": return "As it wasn't possible to choose shipping method, we will contact you by phone to arrange delivery.";
            case "Scheduled" : return (

                noReseravtion ? "As it wasn't possible to choose shipping method, we will contact you by phone to arrange delivery." :
                "Your order will be delivered: " +
                (order.shippingEstimateDate !== null ?
                    getCreationDate(order.shippingEstimateDate)
                    :
                    "")
                +
                (" ["+ getTimeFromDate(order.deliveryWindow.startDateUtc) + " - " + getTimeFromDate(order.deliveryWindow.endDateUtc) +"]")
                );
            case "Next day" : return (
                "Your order will be delivered: " +
                (order.shippingEstimateDate !== null ?
                    getCreationDate(order.shippingEstimateDate)
                    :
                    "")
                );
            default : return "";
        }
    }

}

export function singleTypeOrder2(order, creationDate, additionalData, noReseravtion) {
    let bDays = getBusinessDays(order.shippingEstimate)
    let eDeliveryDays = bDays !== null ? getShippingDeliveryDateFromCreationDate(creationDate,bDays) : ""
    let sTime = order.deliveryWindow !== null ? order.deliveryWindow.startDateUtc : null
    let eTime = order.deliveryWindow !== null ? order.deliveryWindow.endDateUtc : null
    const { isGAs } = additionalData;
    if(isGAs === "true"){
        return "As you've chosen our connection service for a gas product, our customer support team will contact you to arrange suitable delivery and connection dates for that product. "
    } else {
        switch(order.selectedSla) {
            case "Special" : return "Your appliance will be delivered by Hotpoint Home Solutions. Our team will be in contact using the details supplied to arrange delivery";
            case "LeadTime" : return "Due to high demand, your order or part of it has delayed shipping. We will contact you to arrange delivery once your product is available.";
            case "Bundle": return "As it wasn't possible to choose shipping method, we will contact you by phone to arrange delivery.";
            case "Scheduled" : return (
                noReseravtion ? "As it wasn't possible to choose shipping method, we will contact you by phone to arrange delivery.":
                "Your order will be delivered: " +
                (order.shippingEstimateDate !== null ?
                    getCreationDate(order.shippingEstimateDate)
                    :
                    eDeliveryDays)
                +
                (" ["+ getTimeFromDate(sTime) + " - " + getTimeFromDate(eTime) +"]")
                );
            case "Next day" : return (
                "Your order will be delivered: " +
                (order.shippingEstimateDate !== null ?
                    getCreationDate(order.shippingEstimateDate)
                    :
                    eDeliveryDays)
                );
            default : return "";
        }
    }

}

export function checkShipTogether(product) {
    if(product.length === 0) {
        return false;
    }
    if(product["ModalType"] === "FURNITURE") {
        return false;
    }
    else {
        return true
    }
}

export function showDeliveryDate(order,creationDate) {
    let bDays = getBusinessDays(order.shippingEstimate)
    let eDeliveryDays = bDays !== null ? getShippingDeliveryDateFromCreationDate(creationDate,bDays) : ""
    let sTime = order.deliveryWindow !== null ? order.deliveryWindow.startDateUtc : null
    let eTime = order.deliveryWindow !== null ? order.deliveryWindow.endDateUtc : null
    if(order.selectedSla === "Scheduled") {
        return (
            (order.shippingEstimateDate !== null ?
                getCreationDate(order.shippingEstimateDate)
                :
                eDeliveryDays)
            +
            (" ["+ getTimeFromDate(sTime) + " - " + getTimeFromDate(eTime) +"].")
        );
    }
    if(order.selectedSla === "Next day") {
        return (
            order.shippingEstimateDate !== null ?
                getCreationDate(order.shippingEstimateDate)
                :
                eDeliveryDays
        );
    }
    return ""
}

export function checkShipping(deliveryParcels,creationDate,product, additionalData, order, noReseravtion ) {
    let kLeads = 0;
    let kNexts = 0;
    let kScheduleds = 0;
    let kSpecials = 0;
    let kStandard = 0;
    let orderLead, orderNext, orderScheduled, orderSpecial, orderStandard;
    let {shipTogether, tpErr, isGAs} = additionalData;

    map(deliveryParcels,(item) => {
        switch(item.selectedSla) {
            case "LeadTime": kLeads++; orderLead = item; break;
            case "Next day": kNexts++; orderNext = item; break;
            case "Scheduled": kScheduleds++; orderScheduled = item; break;
            case "Special": kSpecials++; orderSpecial = item; break;
            case "Standard free": kStandard++; orderStandard = item; break;
            case "Standard charged": kStandard++; orderStandard = item; break;
            case "Next day delivery": kStandard++; orderStandard = item; break;
            case "Second day delivery": kStandard++; orderStandard = item; break;

            default: break;
        }
    });

    let temp = "";

    if(shipTogether === "true" || tpErr === "true"){
        return "Due to high demand, your order or part of it has delayed shipping. We will contact you to arrange delivery once your product is available"
    } else if(isGAs === "true"){
        if(kLeads === 0 && kScheduleds === 0 && kSpecials === 0){
            return "As you've chosen our connection service for a gas product, our customer support team will contact you to arrange suitable delivery and connection dates for that product."

        } else {
            temp =  "As you've chosen our connection service for a gas product, our customer support team will contact you to arrange suitable delivery and connection dates for that product."

        }
    }

    if(kLeads === deliveryParcels.length) {
        return ("Due to high demand, your order or part of it has delayed shipping. We will contact you to arrange delivery once your product is available." + temp)
    }
    else if(kLeads !== deliveryParcels.length && kLeads !== 0) {

        if(kNexts !== 0) {
            temp +=noReseravtion ? "" : " The other part of the order will be delivered: " + showDeliveryDate(orderNext,creationDate);
        }
        if(kScheduleds !== 0 && !isGAs) {
            temp += noReseravtion ? "" : " The other part of the order will be delivered: " + showDeliveryDate(orderScheduled, creationDate);
        }
        if(kSpecials !== 0) {
            temp += " The other part of your order, that includes small domestic appliances, will be delivered following our team contacting you to arrange delivery."
        }
        if(product.length !== 0 && product["ModalType"] === "FURNITURE") {
            temp += " For the other part of the order our customer support team will contact you to arrange a convenient date for delivery and installation, which will be completed by one of our gas safe registered engineers."
        }
        return ("Due to high demand, your order or part of it has delayed shipping. We will contact you to arrange delivery once your product is available." + temp);
    }
    else if(kSpecials !== 0 && kScheduleds !==0){
        temp = "";
        temp += "Part of the order will be delivered: " + showDeliveryDate(orderScheduled, creationDate);
        temp+= "\n" + ". The other part of your order, that includes small domestic appliances, will be delivered following our team contacting you to arrange delivery.";
        return temp
    }
    else if(kLeads === 0 && kSpecials !== 0 && (kNexts !== 0 || kScheduleds !== 0)) {
        return(
            "Your appliance will be delivered by Hotpoint Home Solutions. Our team will be in contact using the details supplied to arrange delivery" +
            " The other part will be delivered: " + showDeliveryDate(orderNext,creationDate)
        )
    }
    else if(kStandard > 0 && kScheduleds > 0){
      return    "Your order will be delivered: " + getCreationDate(orderScheduled.shippingEstimateDate) +  (" ["+ getTimeFromDate(orderScheduled.deliveryWindow.startDateUtc) + " - " + getTimeFromDate(orderScheduled.deliveryWindow.endDateUtc) +"]")

    }
    else {
        return (creationDate + orderSpecial + orderLead)
    }


}
