//import { arrHeaders } from '../utils/CSVHeaders'
import { getOrdersFilteredByRangeTime } from "./getFilteredOrders";
const { parse } = require('json2csv');
export const convertIntoCSV = async (ctx: Context) => {
    let dataToConvert = await getOrdersFilteredByRangeTime(ctx)
    let data = await convertToCSV(dataToConvert, ctx)
    return data
}


async function convertToCSV(data: any, ctx: Context) {
    try {
        const csv = parse(await mapFields(data), {
            delimiter: ';',
            quote: ""
        })
        ctx.set("content-type", "text/csv;charser=utf-8")
        ctx.set("cache-control", "no-store")
        ctx.set("Content-Disposition", "attachment;order-report.csv")
        return csv
    } catch (e) {
        console.log(e);
    }
}

const mapFields = async (arrData: any) => {
    let arr: any = []
    arrData.map((data: any) => {
        if (!data?.id.startsWith("00")) {
            for (let i of data.items) {
                arr.push({
                    'Origin': data?.workflowData?.instances?.[0]?.name || "",
                    'Order': data?.id || "",
                    'Sequence': data?.sequence || "",
                    'Creation Date': data?.workflowData?.instances?.[0]?.creationDate.substring(0, 10) || "",
                    'Client Name': data?.clientProfileData?.firstName || "",
                    'Client Last Name': data?.clientProfileData?.lastName || "",
                    'Client Document': data?.clientProfileData?.document || "",
                    'Email': data?.clientProfileData?.email || "",
                    'Phone': data?.clientProfileData?.phone || "",
                    'UF': data?.shippingData?.address?.state || "",
                    'City': data?.shippingData?.address?.city || "",
                    'Address Identification': data?.shippingData?.address?.addressId || "",
                    'Address Type': data?.shippingData?.address?.addressType || "",
                    'Receiver Name': data?.shippingData?.address?.receiverName || "",
                    'Street': data?.shippingData?.address?.street || "",
                    'Number': data?.shippingData?.address?.number || "",
                    'Complement': data?.shippingData?.address?.complement || "",
                    'Neighborhood': data?.shippingData?.address?.neighborhood || "",
                    'Reference': "",
                    'Postal Code': data?.shippingData?.address?.postalCode,
                    'SLA Type': data?.shippingData?.logisticsInfo?.[0]?.selectedSla || "",
                    'Courrier': data?.shippingData?.logisticsInfo?.[0]?.deliveryIds?.[0]?.courierName || "",
                    'Estimate Delivery Date': data?.shippingData?.logisticsInfo?.[0]?.shippingEstimateDate || "",
                    'Delivery Deadline': data?.shippingData?.logisticsInfo?.[0]?.shippingEstimate || "",
                    'Status': data?.status || "",
                    'Last Change Date': data?.lastChange || "",
                    'UtmMedium': data?.marketingData?.utmMedium || "",
                    'UtmSource': data?.marketingData?.utmSource || "",
                    'UtmCampaign': data?.marketingData?.utmCampaign || "",
                    'Coupon': data?.marketingData?.coupon ? data?.marketingData?.coupon : "",
                    'Payment System Name': data?.paymentNames?.join(", ") || "",
                    'Installments': data?.paymentData?.transactions?.[0]?.payments?.[0]?.installments || "",
                    'Payment Value': prices(data?.value),
                    'Quantity_SKU': i?.seller || "",
                    'ID_SKU': i?.id || "",
                    'Category Ids Sku': i?.additionalInfo?.categoriesIds || "",
                    'Reference Code': i?.refId || "",
                    'SKU Name': i?.name || "",
                    'SKU Value': prices(i?.price) || 0,
                    'SKU Selling Price': prices(i?.sellingPrice) || 0,
                    'SKU Total Price': prices(i?.priceDefinition?.total) || 0,
                    'SKU Path': i?.detailUrl || "",
                    'Item Attachments': "",
                    'List Id': "",
                    'List Type Name': "",
                    'Service (Price/ Selling Price)': i?.bundleItems?.map((el: any) => `${el?.name} - ${el?.price}`) || "",
                    'Shipping List Price': data?.items?.shippingData?.logisticsInfo?.[0].listPrice || "",
                    'Shipping Value': data?.totals?.find((el: any) => el?.id == "Shipping")?.value || 0,
                    'Total Value': prices(data?.value) || "",
                    'Discounts Totals': data?.totals?.find((el: any) => el?.id == "Discounts")?.value || "",
                    'Discounts Names': data?.ratesAndBenefitsName?.[0] || "",
                    'Call Center Email': data?.callCenterOperatorData || "",
                    'Call Center Code': data?.callCenterOperatorData || "",
                    'Tracking Number': data?.packageAttachment?.packages?.[0]?.trackingNumber || "",
                    'Host': data?.hostname || "",
                    'GiftRegistry ID': "",
                    'Seller Name': data?.sellerNames.join("") || "",
                    'Status TimeLine': "Obsolete",
                    'Obs': data?.OpenTextField?.value || "",
                    'UtmiPart': data?.marketingData?.utmiPart || "",
                    'UtmiCampaign': data?.marketingData?.utmCampaign || "",
                    'UtmiPage': data?.marketingData?.utmipage || "",
                    'Seller Order Id': "",//non è valorizzato
                    'Acquirer': data?.paymentData?.transactions?.[0]?.payments?.[0]?.connectorResponses?.acquirer || "",
                    'Authorization Id': data?.paymentData?.transactions?.[0]?.payments?.[0]?.connectorResponses?.authId || "",
                    'TID': data?.pciTransactionId?.[0] || data?.paymentData?.transactions?.[0]?.payments?.[0]?.tid || "",
                    'NSU': data?.paymentNSU?.[0] || "",
                    'Card First Digits': "",//non dovremmo avere info sulla carta
                    'Card Last Digits': "",//non dovremmo avere info sulla carta
                    'Payment Approved By': "",//No value
                    'Cancelled By': data?.cancelledBy || "",
                    'Cancellation Reason': data?.cancelReason || "",//No value
                    'Gift Card Name': "",//data?.paymentData[i]
                    'Gift Card Caption': "",//data?.paymentData[i]
                    'Authorized Date': data?.authorizedDate || "",
                    'Corporate Name': data?.clientProfileData?.corporateName || "",
                    'Corporate Document': data?.clientProfileData?.corporateDocument || "",
                    'TransactionId': data?.transactionIds.join("") || "",
                    'PaymentId': data?.pciTransactionId.join("") || "",
                    'SalesChannel': data?.salesChannel || "",
                    'marketingTags': data?.marketingData?.marketingTags || "",
                    'Delivered': false,
                    'SKU RewardValue': data?.items?.rewardValue || 0,  //valorizzato a 0, ma so una sega io
                    'Is Marketplace cetified': data?.marketplace?.isCertified || "NA",//valorizzato a NA
                    'Is Checked In': data?.isCheckedIn || "NA",//valorizzato a NA
                    'Currency Code': data?.currencyCode || "",
                    'Taxes': i?.tax || "",
                    'Invoice Numbers': data?.packageAttachment?.packages?.[0]?.invoiceNumber || "", //ha lo stesso valore di input invoice numbers
                    'Country': data?.shippingData?.address?.country || "",
                    'Input Invoices Numbers': data?.packageAttachment?.packages?.[0]?.invoiceNumber || "",
                    'Output Invoices Numbers': "",
                    'Status raw value (temporary)': data?.status || "",
                    'Cancellation Data': data?.cancellationData || ""
                })

            } return

        } else
            return {}
    })
    return arr
}



const prices = (num: number) => {
    try {
        if (num.toString().split("").splice(-2, 2).join("") == "00") {
            let str: string = num.toString();
            let arr: string[] = str.split("")
            arr.splice(-2, 2)
            return parseInt(arr.join(""))
        } else {
            let str: string = num.toString();
            let arr: string[] = str.split("")
            arr.splice(-2, 0, ".")
            return parseInt(arr.join(""))
        }
    } catch (e) {
        console.log(e);
        return
    }
}