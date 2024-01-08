
import { CartItems, IndexArray, itemObject, simulationBody, UpdateCart, UpdateCartPayload } from "../typings/cartFix";
import { getAppSetting } from "../utils/functions";


export const cartFix_resolver = async (_: any, orderFormId: any, ctx: Context) => {
  const { cookies } = ctx
  await getAppSetting(ctx);
  const CheckoutOrderFormOwnershipCookie = cookies.get("CheckoutOrderFormOwnership") as string
  //get order form by private call
  let orderForm = await ctx.clients.vtexAPI.getOrderForm(ctx, orderFormId.orderFormId ?? undefined, CheckoutOrderFormOwnershipCookie);

  let items = orderForm.items;

  //number of item in the cart after the removal of OOS sp&acc
  let cartItems: CartItems = {
    cartItemNumber: 0,
    itemsRemoved: 0
  };

  //useful to save the index of relative products in the orderForm (needed in remove items from cart)
  let indexArray: IndexArray[] = [];

  let body: simulationBody = {
    postalCode: "",
    country: "",
    geoCoordinates: [0, 0],
    items: []
  };

  items.forEach((item: any) => {

    //
    let itemBody: itemObject = {
      id: item.id,
      quantity: item.quantity,
      seller: item.seller
    }

    let index: IndexArray = {
      id: item.id,
      index: cartItems.cartItemNumber,
      skuName: item.skuName
    }
    indexArray.push(index)
    body.items.push(itemBody)

    cartItems.cartItemNumber++;
  })

  if (cartItems.cartItemNumber > 0) {

    //call of cart simulation
    let cartSimulationResponse = await ctx.clients.vtexAPI.cartSimulation(body, CheckoutOrderFormOwnershipCookie);
    let messages = cartSimulationResponse.messages;

    let payload: UpdateCartPayload = {
      orderItems: []
    };


    for (let messageIndex = 0; messageIndex < messages.length; messageIndex++) {

      //index of relative item in orderForm
      let orderFormItemIndex = 0;

      if (messages[messageIndex].code == "withoutStock") {

        indexArray.forEach(index => {
          if (index.skuName == messages[messageIndex].fields?.skuName) {
            orderFormItemIndex = index.index;
          }
        })

        let itemToRemove: UpdateCart = {
          quantity: 0,
          index: orderFormItemIndex
        }
        payload.orderItems.push(itemToRemove);
        //update counters Items
        cartItems.cartItemNumber--;
        cartItems.itemsRemoved++;
      }

    }

    if (payload.orderItems.length > 0) {
      await ctx.clients.vtexAPI.updateCartItem(ctx, orderFormId.orderFormId, payload, CheckoutOrderFormOwnershipCookie);
    }

  }

  return cartItems;
}
