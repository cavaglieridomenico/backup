import { orderFields } from '../utils/constants'
import { scrollDocuments } from "./getFilteredOrders";
import { parse } from 'json2csv';

export async function convertToCSV(ctx: Context) {
    try {
        const orders = await scrollDocuments(ctx, "orders", orderFields)
        const csv = parse(mapFields(orders), {
            delimiter: ';',
            quote: ""
        })
        return csv
    } catch (e) {
        console.log(e);
        return null
    }
}

const mapFields = (arrData: any[]) => {
    const arr: any = []
    arrData.forEach((data: any) => {
        for (const item of data.items) {
            arr.push({
                'Origin': data?.workflowData?.instances?.[0]?.name || "",
                'Order ID': data?.id || "",
                'Transaction ID': data?.transactionIds.join("") || "",
                'Creation Date': data?.workflowData?.instances?.[0]?.creationDate.substring(0, 10) || "",
                'ID_SKU': item?.id || "",
                'Reference Code': item?.refId || "",
                'SKU Name': item?.name || "",
                'Quantity_SKU': item?.seller || "",
                'UtmMedium': data?.marketingData?.utmMedium || "",
                'UtmSource': data?.marketingData?.utmSource || "",
                'UtmCampaign': data?.marketingData?.utmCampaign || "",
                'Coupon': data?.marketingData?.coupon ? data?.marketingData?.coupon : "",
                'Discounts Totals': data?.totals?.find((el: any) => el?.id == "Discounts")?.value || "",
                'Discounts Names': data?.ratesAndBenefitsName?.[0] || "",
                'Payment System Name': data?.paymentNames?.join(", ") || "",
                'Installments': data?.paymentData?.transactions?.[0]?.payments?.[0]?.installments || "",
                'Payment Value': prices(data?.value),
                'Estimate Delivery Date': data?.shippingData?.logisticsInfo?.[0]?.shippingEstimateDate || "",
                'SKU Value': prices(item?.price) || 0,
                'SKU Selling Price': prices(item?.sellingPrice) || 0,
                'SKU Total Price': prices(item?.priceDefinition?.total) || 0,
                'SKU Path': item?.detailUrl || "",
                'Item Attachments': "",
                'Service (Price/ Selling Price)': item?.bundleItems?.map((el: any) => `${el?.name} - ${el?.price}`).join(", ") || "",
                'Shipping List Price': data?.items?.shippingData?.logisticsInfo?.[0].listPrice || "",
                'Shipping Value': data?.totals?.find((el: any) => el?.id == "Shipping")?.value || 0,
                'Total Value': prices(data?.value) || "",
            })
        }
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


export async function wait(time: number): Promise<any> {
    return new Promise<any>((resolve) => {
        setTimeout(() => { resolve(true) }, time);
    })
}