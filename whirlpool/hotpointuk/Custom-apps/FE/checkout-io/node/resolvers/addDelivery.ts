import { APP } from "@vtex/api";
import { Clients } from "../clients";
import { getAppSetting } from "../utils/functions";
export const add_delivery_resolver = async (
  _: unknown,
  { orderFormId }: { orderFormId: string },
  ctx: any
): Promise<any> => add_delivery(ctx, orderFormId)




const add_delivery = async (ctx: Context, orderFormId: string): Promise<any> => {
  try {
    await getAppSetting(ctx)
    const { clients, cookies } = ctx
    const CheckoutOrderFormOwnershipCookie = cookies.get("CheckoutOrderFormOwnership") as string
    const [currentOrderForm, { delivery: { paidDeliveryConfig: { deliveryType: offeringType } } }] = await Promise.all([clients.vtexAPI.getOrderForm(ctx, orderFormId, CheckoutOrderFormOwnershipCookie), ctx.clients.apps.getAppSettings(APP.ID)])
    const { items } = currentOrderForm //all items
    await manageAddOfferings(clients, orderFormId, offeringType, items, CheckoutOrderFormOwnershipCookie)
    ctx.status = 200;
    return {
      message: "OrderForm: " + orderFormId + " items, have delivery been updated"
    }
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}

//add delivery to all the items that have the delivery offering
const manageAddOfferings = async (clients: Clients, orderFormId: string, offeringType: string, items: any, CheckoutOrderFormOwnership: string): Promise<any> => {
  const promiseItems: any = []

  items.forEach((item: any, index: number) => {
    if (item.offerings?.some((el: { type: string }) => el.type.toLowerCase() === offeringType.toLowerCase())) {
      const { id: offeringId } = item.offerings.find((el: { type: string }) => el.type.toLowerCase() === offeringType.toLowerCase())
      promiseItems.push(clients.vtexAPI.addOffering(orderFormId, index, offeringId, CheckoutOrderFormOwnership))
    }
  })
  let res: any = await Promise.all(promiseItems)
  //Items with delivery
  let arrOfItemsWithDelivery = res[res.length - 1].items.filter((el: any) => el.offerings.some((el: { type: string }) => el.type.toLowerCase() === offeringType.toLowerCase()))


  let stillWithoutDelivery = arrOfItemsWithDelivery.find((el: any) => el.bundleItems.every((el: any) => el.name != offeringType))
  if (res && res.length > 0 && stillWithoutDelivery)
    return await manageAddOfferings(clients, orderFormId, offeringType, res[res.length - 1].items, CheckoutOrderFormOwnership)
  else
    return res
}

