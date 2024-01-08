import { MasterDataEntity, OfferingToRemove } from "../typings/cartFix";
import { getAppSetting } from "../utils/functions";


export const isServedPC_resolver = async (_: any, orderFormId: any, ctx: Context) => {
  const { cookies } = ctx
  await getAppSetting(ctx);
  const CheckoutOrderFormOwnershipCookie = cookies.get("CheckoutOrderFormOwnership") as string

  let installation: Installation = {
    orderFormId: orderFormId.orderFormId,
    isServed: true,
    removedItems: 0
  }

  let orderForm = await ctx.clients.vtexAPI.getOrderForm(ctx, orderFormId.orderFormId ?? undefined, CheckoutOrderFormOwnershipCookie);

  if (orderForm.shippingData && orderForm.shippingData.selectedAddresses.length !== 0) {

    let postalCode = orderForm.shippingData.selectedAddresses[0].postalCode;
    postalCode = postalCode.toUpperCase();

    console.log("pc -> ", postalCode);


    postalCode = await splitPostalCode(postalCode);

    try {

      //get postalcode with no installation from masterdata
      let postalCodeMD: any = await ctx.clients.masterdata.searchDocuments({
        dataEntity: MasterDataEntity.PC,
        fields: ["postalCode"],
        pagination: { page: 1, pageSize: 1000 },
        where: `postalCode=${postalCode}`
      });

      let found = false;
      if (postalCodeMD.length > 0) {
        found = true;
      };

      let removedItems = 0;

      if (found === true) { //installation FALSE
        ctx.status = 200;
        installation.isServed = false;

        let flag = false;
        let items = orderForm.items;

        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {

          let bundleIndex = 0;
          while (bundleIndex < items[itemIndex].bundleItems.length && flag == false) {

            if (items[itemIndex].bundleItems[bundleIndex]?.name == OfferingToRemove.Installation) {

              let offeringId = items[itemIndex].bundleItems[bundleIndex].id;
              installation.orderFormId = await ctx.clients.vtexAPI.removeOffering(installation.orderFormId, itemIndex, offeringId, CheckoutOrderFormOwnershipCookie);
              flag = true;
              removedItems++;
            }
            bundleIndex++;
          }
          flag = false;
        }

        installation.removedItems = removedItems;

        return installation;
      } else { //installation YES
        ctx.status = 200;
        return installation;
      }
    } catch (err) {
      return installation;
    }

  } else {
    //when there is no shipping data
    return installation;
  }

}

export async function filterPostalCodeUK(postalCode: string) {
  switch (postalCode.length) {
    case 7: {
      postalCode = postalCode.substring(0, 4) + ' ' + postalCode.substring(4);
      break;
    }
    case 6: {
      postalCode = postalCode.substring(0, 3) + ' ' + postalCode.substring(3);
      break;
    }
    case 5: {
      postalCode = postalCode.substring(0, 2) + ' ' + postalCode.substring(2);
      break;
    }
    default: {
      break;
    }
  }
  return postalCode;
}


const splitPostalCode = async (postalCode: string) => {

  //Transform postalcode and remove everything after the space
  if (postalCode.indexOf('%20') >= 0) { //percentage in between
    postalCode = postalCode.split("%")[0].toUpperCase();
  } else if (postalCode.indexOf(' ') >= 0) {
    postalCode = postalCode.split(" ")[0].toUpperCase();// with space in betwee
  } else {
    postalCode = await filterPostalCodeUK(postalCode); // no space in between
    postalCode = postalCode.split(" ")[0].toUpperCase();

  }

  return postalCode;
}

type Installation = {
  orderFormId: string,
  isServed: boolean,
  removedItems: number
}

