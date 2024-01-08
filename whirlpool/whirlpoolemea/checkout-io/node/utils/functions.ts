import { APP } from "@vtex/api";
import { UpdateCart } from "../typings/cartFix";
import { createHash } from 'crypto'
export async function getPostalCodeByAD(addressId: string, ctx: Context) {

  let postalCode = "";

  try {
    let postalCodeMD: any = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "AD",
      fields: ["postalCode"],
      pagination: { page: 1, pageSize: 10 },
      where: `addressName=${addressId}`
    });
    postalCode = postalCodeMD[0].postalCode;
    ctx.status = 200;
    return postalCode;

  } catch (error) {
    ctx.status = 500;
    return error;
  }

}

export async function simulateCart(ctx: Context, body: SimulationPayload): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {
      body.items.forEach(i => {
        i.seller = i.seller ? i.seller : (i.possibleSellers?.find(s => !i.sellerWithoutStock?.includes(s)) ?? i.originalSeller);
      })
      //console.info("items pre simulation:", body.items)
      let cartSimulationResponse = await ctx.clients.checkout.simulationWithAppCookie(body, ctx.state.CheckoutOrderFormOwnershipCookie);
      //console.info("simulation res:", cartSimulationResponse.messages)
      if (ctx.state.AppSettings.multiseller?.isEnabled) {
        let itemsWithoutStock = cartSimulationResponse.messages?.filter((m: any) => m.code?.toLowerCase() == "withoutstock")?.map((m: any) => m.fields.itemIndex);
        if (itemsWithoutStock.length > 0) {
          itemsWithoutStock?.forEach((i: any) => {
            if (!body.items[cartSimulationResponse.items[i].requestIndex].sellerWithoutStock?.includes(body.items[i].seller!)) {
              body.items[cartSimulationResponse.items[i].requestIndex].sellerWithoutStock?.push(body.items[i].seller!);
            }
            body.items[cartSimulationResponse.items[i].requestIndex].seller = null;
          })
          let possibleSellers = 0;
          let sellerWithoutStock = 0;
          body.items.filter(i => !i.seller)?.forEach(i => {
            possibleSellers += (i.possibleSellers?.length ?? 0);
            sellerWithoutStock += (i.sellerWithoutStock?.length ?? 0);
          })
          //console.info("items", body.items);
          if (possibleSellers != sellerWithoutStock) {
            //console.info("check other sellers")
            return simulateCart(ctx, body).then(res0 => resolve(res0)).catch(err0 => reject(err0));
          }
        }
        cartSimulationResponse.multiseller = true;
        cartSimulationResponse.computedItems = body.items;
      }
      resolve(cartSimulationResponse);
    } catch (err) {
      reject(err);
    }
  })
}


export async function fixCartSellersAndStock(ctx: Context, orderFormId: string, checkOutOfStock: boolean): Promise<{ initialItems: number, removedItems: number, messages: any[] }> {
  return new Promise<{ initialItems: number, removedItems: number, messages: any[] }>(async (resolve, reject) => {
    try {
      ctx.state.AppSettings = await ctx.clients.apps.getAppSettings(APP.ID);
      ctx.state.CheckoutOrderFormOwnershipCookie = ctx.state.CheckoutOrderFormOwnershipCookie ? ctx.state.CheckoutOrderFormOwnershipCookie : ctx.cookies.get("CheckoutOrderFormOwnership") as string
      let orderForm = await ctx.clients.checkout.orderForm(orderFormId, ctx.state.CheckoutOrderFormOwnershipCookie);
      let itemsToRemove: UpdateCart[] = [];
      let itemsToAdd: PayloadItem[] = [];
      let messages = [];
      if (orderForm.items.length > 0) {
        // Build simulation body
        // Commented the real address data because they need the user cookie to be read
        let simulationBody: SimulationPayload = {
          postalCode: /*orderForm.shippingData?.selectedAddresses[0]?.postalCode ??*/ "",
          country: /*orderForm.shippingData?.selectedAddresses[0]?.country ??*/ "",
          geoCoordinates: /*orderForm.shippingData?.selectedAddresses[0]?.geoCoordinates ??*/[0, 0],
          items: []
        };
        orderForm.items.forEach((item, itemIndex: any) => {
          let categories = item.productCategoryIds?.split("/")?.filter((c: string) => c.trim() != "") ?? [];
          let itemBody: PayloadItem = {
            id: item.id,
            index: itemIndex,
            quantity: item.quantity,
            seller: item.seller,
            originalSeller: item.seller,
            possibleSellers: ctx.state.AppSettings.multiseller?.sellers?.find(s => categories.includes(s.categoryId!))?.sellerList?.split(",") ?? [item.seller],
            sellerWithoutStock: [],
            offerings: item.bundleItems
          }
          simulationBody.items.push(itemBody)
        })
        // Simulate cart
        const simulation = await simulateCart(ctx, simulationBody);
        // Multi-seller: find items for which a seller switch is needed
        if (simulation.multiseller) {
          simulation.computedItems.filter((i: PayloadItem) => i.seller).forEach((i: PayloadItem) => {
            if (i.seller != i.originalSeller) {
              itemsToRemove.push({
                index: i.index,
                quantity: 0
              })
              itemsToAdd.push(i);
            }
          })
        }
        // Find out of stock items
        if (checkOutOfStock) {
          simulation.messages?.filter((m: any) => m.code?.toLowerCase() == "withoutstock")?.forEach((m: any) => {
            itemsToRemove.push({
              index: simulation.items[m.fields.itemIndex].requestIndex,
              quantity: 0
            })
          })
        }
        // Multi-seller: remove out of stock items
        if (itemsToRemove.length > 0) {
          //console.info("items to remove: ", itemsToRemove.length);
          await Promise.all([
            ctx.clients.checkout.updateItems(orderFormId, itemsToRemove, ctx.state.CheckoutOrderFormOwnershipCookie),
            ctx.clients.checkout.clearMessages(orderFormId, ctx.state.CheckoutOrderFormOwnershipCookie)
          ]);
        }
        // Multi-seller: add items from the new seller
        if (itemsToAdd.length > 0) {
          //console.info("items to add: ", itemsToAdd.length);
          await ctx.clients.checkout.addItem(orderFormId, itemsToAdd, ctx.state.CheckoutOrderFormOwnershipCookie);
        }
        // Multi-seller: add offerings => despite the source code is correct, it doesn't work properly for unclear reasons. While the issue is deep dived, the source code will be commented.
        /*if (itemsToAdd?.find(i => (i.offerings?.length ?? 0) > 0)) {
          orderForm = await ctx.clients.checkout.orderForm(orderFormId);
          let promises: Promise<any>[] = [];
          itemsToAdd?.filter(i => (i.offerings?.length ?? 0) > 0).forEach((i) => {
            let index = orderForm.items.indexOf(orderForm.items.find(item => item.id == i.id && item.seller == i.seller && item.bundleItems?.length == 0)!)
            //console.info("item", index, i.id, i.offerings?.map(o => o.id).join(","))
            i.offerings?.forEach(o => promises.push(ctx.clients.checkout.addOffering(orderFormId, index, o.id)))
          });
          //console.info("offerings to add: ", promises.length);
          await Promise.all(promises);
        }*/
        messages = simulation.messages;
      }
      resolve({ initialItems: orderForm.items.length, removedItems: (itemsToRemove.length - itemsToAdd.length), messages: messages })
    } catch (err) {
      reject(err);
    }
  })
}

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return ({ }, value: object | null) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

export function stringify(data: any): string {
  return typeof data == 'object' ? JSON.stringify(data, getCircularReplacer()) : (data + "");
}



export const getCacheKey = (...args: (string | number)[]) =>
  createHash("sha256").update(args.join('_')).digest("hex")


