import { HDXCategories, HDXMeasures, ThresholdDimensions, VehicleType } from "../typings/hdx"
import { DeliveryService, DeliveryZone, DMRecord } from "../typings/md"
import { Item, Order } from "../typings/order"
import { ItemOF, OrderForm } from "../typings/orderForm"
import { ConstructionType, ModalType, SkuDimensions } from "../typings/types"
import { constructionTypeField, DMFields, stairsToggleValue, twoMenKeywords } from "./constants"
import { searchDocuments } from "./documentCRUD"
import { getNumericValue, isValid } from "./functions"

export function flagItemsOrderForm(ctx: Context | OrderEvent, orderForm: OrderForm): { orderForm: OrderForm, hasCGasAppliances: boolean } {
  let hasInStockCGas = false;
  let hasCGasAppliances = false;
  const productsWithoutSlots = ctx.state.appSettings.vtex?.productsWithoutSlots?.split(",") || []
  for (let i = 0; i < orderForm.items.length; i++) {
    if (orderForm.items[i].modalType == ModalType.WHITE_GOODS) {
      orderForm.items[i].ignore = true;
    } else {
      if (orderForm.items[i].modalType == ModalType.FURNITURE && orderForm.items[i].bundleItems?.find(bi => bi.additionalInfo.offeringTypeId == ctx.state.appSettings.vtex.additionalServicesData?.find(as => as.tradePolicyId == orderForm.salesChannel)?.installationId)) {
        orderForm.items[i].ignore = true;
        hasCGasAppliances = true;
        if (orderForm.shippingData?.logisticsInfo?.find(f => f.itemId == orderForm.items[i].id && f.slas.find(s => s.id.toLowerCase() == ctx.state.appSettings.vtex.inStockShippingPolicy.toLowerCase()))) {
          hasInStockCGas = true;
        }
      } else {
        let sla = orderForm.shippingData?.logisticsInfo?.find(f => f.itemId == orderForm.items[i].id && f.slas.find(s => s.id.toLowerCase() == ctx.state.appSettings.vtex.inStockShippingPolicy.toLowerCase()));
        if (sla) {
          if (productsWithoutSlots.includes(orderForm.items[i]?.productRefId)) {
            orderForm.items.forEach(item => item.ignore = true)
            break;
          }
          orderForm.items[i].ignore = false;
        } else {
          orderForm.items[i].ignore = true;
        }
      }
    }
  }
  if (hasInStockCGas) {
    orderForm.items.filter(i => !i.ignore)?.forEach(i => i.ignore = true);
  }
  return { orderForm: orderForm, hasCGasAppliances: hasCGasAppliances };
}

export function flagItemsOrder(ctx: Context | OrderEvent, order: Order): Order {
  const productsWithoutSlots = ctx.state.appSettings.vtex?.productsWithoutSlots?.split(",") || []
  for (let i = 0; i < order.items.length; i++) {
    let skuContext = ctx.state.skuContext?.find(f => (f.Id + "") == order.items[i].id);
    if (skuContext?.ModalType == ModalType.WHITE_GOODS) {
      order.items[i].ignore = true;
    } else {
      if (skuContext?.ModalType == ModalType.FURNITURE && order.items[i].bundleItems?.find(bi => bi.additionalInfo.offeringTypeId == ctx.state.appSettings.vtex.additionalServicesData?.find(as => as.tradePolicyId == order.salesChannel)?.installationId)) {
        order.items[i].ignore = true;
      } else {
        let sla = order.shippingData?.logisticsInfo?.find(f => f.itemIndex == i && f.selectedSla.toLowerCase() == ctx.state.appSettings.vtex.inStockShippingPolicy.toLowerCase());
        if (sla) {
          if (productsWithoutSlots.includes(order.items[i]?.refId)) {
            order.items.forEach(item => item.ignore = true)
            break;
          }
          order.items[i].ignore = false;
        } else {
          order.items[i].ignore = true;
        }
      }
    }
  }
  return order;
}

export async function getPostCode(ctx: Context | OrderEvent, orderForm: OrderForm | Order): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      let dmRecords: DMRecord[] = await searchDocuments(ctx, ctx.state.appSettings.vtex.deliveryMatrix.mdName, DMFields, `majorPostCode=${orderForm.shippingData.address.postalCode?.trim()?.split(" ")[0]}`, { page: 1, pageSize: 10 });
      if (dmRecords.length <= 0) {
        reject({ msg: `Delivery not available for the postal code: ${orderForm.shippingData.address.postalCode?.trim()}` });
      } else {
        let dmRecord = dmRecords[0];
        ctx.state.dmRecord = dmRecord;
        if (dmRecord.deliveryZone.toUpperCase() == DeliveryZone.XDEL) {
          reject({ msg: `Delivery not available for the postal code: ${orderForm.shippingData.address.postalCode?.trim()}` });
        } else {
          if (isValid(dmRecord.alternativePostCode)) {
            if (dmRecord.deliveryService.toUpperCase() == DeliveryService.CARRIER) {
              resolve(dmRecord.alternativePostCode!);
            } else {
              resolve(orderForm.shippingData.address.postalCode?.trim());
            }
          } else {
            resolve(orderForm.shippingData.address.postalCode?.trim());
          }
        }
      }
    } catch (err) {
      reject(err);
    }
  })
}

export function getVehicleType(ctx: Context | OrderEvent, orderForm: OrderForm | Order): string {
  let vehicle = undefined;
  let dmRecord = ctx.state.dmRecord;
  if (isValid(dmRecord?.alternativePostCode) && dmRecord?.deliveryService == DeliveryService.CARRIER) {
    if (dmRecord?.isDepot) {
      vehicle = VehicleType.VR09;
    } else {
      vehicle = VehicleType.VR01;
    }
  } else {
    if (areThere2MenKeywords(orderForm) || areThereBigProducts(ctx, orderForm)) {
      vehicle = VehicleType.VR02;
    } else {
      vehicle = VehicleType.VR01;
    }
  }
  return vehicle;
}

function areThere2MenKeywords(orderForm: OrderForm | Order): boolean {
  let stairs = orderForm.shippingData?.address?.reference?.toLowerCase()?.includes(stairsToggleValue.toLowerCase());
  stairs = stairs ? stairs : false;
  let twoMen = false;
  for (let i = 0; i < twoMenKeywords.length && !twoMen; i++) {
    if (orderForm.openTextField?.value?.toLowerCase()?.includes(twoMenKeywords[i].toLowerCase())) {
      twoMen = true;
    }
  }
  return (stairs || twoMen);
}

function areThereBigProducts(ctx: Context | OrderEvent, orderForm: OrderForm | Order): boolean {
  let bigProduct = false;
  for (let i = 0; i < orderForm.items.length && !bigProduct; i++) {
    if (!orderForm.items[i].ignore) {
      let skuDimensions = ctx.state.skuContext?.find((f: any) => (f.Id + "") == orderForm.items[i].id)?.Dimension;
      if (skuDimensions!.height >= ThresholdDimensions.HEIGHT || skuDimensions!.width >= ThresholdDimensions.WIDHT || skuDimensions!.weight >= ThresholdDimensions.WEIGHT) {
        bigProduct = true;
      }
    }
  }
  return bigProduct;
}

export function computeDeliveryMeasuresAndCollectMeasures(ctx: Context | OrderEvent, orderForm: OrderForm | Order): HDXMeasures {
  let measures: HDXMeasures = {
    deliveryMeasure1: 0,
    deliveryMeasure2: 0,
    deliveryMeasure3: 0,
    deliveryVariableTime: 0,
    collectMeasure1: 0,
    collectMeasure2: 0,
    collectMeasure3: 0,
    collectVariableTime: 0
  }
  let installationId = ctx.state.appSettings.vtex.additionalServicesData.find((as: any) => as.tradePolicyId == orderForm.salesChannel)?.installationId;
  let collectScrapId = ctx.state.appSettings.vtex.additionalServicesData.find((as: any) => as.tradePolicyId == orderForm.salesChannel)?.collectScrapId;
  (orderForm as any).items?.filter((i: Item | ItemOF) => !i.ignore)?.forEach((i: Item | ItemOF) => {
    let skuContext = ctx.state.skuContext?.find((f: any) => (f.Id + "") == i.id);
    let dimensions: SkuDimensions = {
      height: skuContext!.Dimension.height,
      width: skuContext!.Dimension.width,
      length: skuContext!.Dimension.length,
      weight: skuContext!.Dimension.weight
    }
    dimensions.height = dimensions.height / 1000;
    dimensions.width = dimensions.width / 1000;
    dimensions.length = dimensions.length / 1000;
    measures.deliveryMeasure1 += i.quantity;
    measures.deliveryMeasure2 += (dimensions.height * dimensions.width * dimensions.length * i.quantity);
    measures.deliveryMeasure3 += (dimensions.weight * i.quantity);
    if (i.bundleItems.find((b: any) => b.additionalInfo.offeringTypeId == installationId)) {
      let categories = skuContext?.ProductCategoryIds.split("/") as string[];
      let categoryId = categories[categories!.length - 2];
      let hdxKeyword = ctx.state.appSettings.vtex.categoriesMap?.find((c: any) => c.ids.split(",").includes(categoryId))?.keyword;
      let isBuiltIn: string | boolean | undefined = skuContext?.ProductSpecifications?.find((s: any) => s.FieldName.toLowerCase() == constructionTypeField.toLowerCase())?.FieldValues[0];
      isBuiltIn = isBuiltIn ? (isBuiltIn.toLowerCase() == ConstructionType.BUILTIN.toLowerCase() ? true : false) : false;
      if (hdxKeyword) {
        switch (hdxKeyword) {
          case HDXCategories.cookers:
          case HDXCategories.hobs:
          case HDXCategories.ovens:
            // i cannot be a GAS appliance with installation selected
            if (isBuiltIn) {
              measures.deliveryVariableTime += (getNumericValue(ctx.state.delTimeCalc?.timeCalOther1) * i.quantity)
            } else {
              measures.deliveryVariableTime += (getNumericValue(ctx.state.delTimeCalc?.timeCalElecConnVar) * i.quantity)
            }
            break;
          case HDXCategories.microwaves:
            // i cannot be a freestanding microwave (SDA)
            measures.deliveryVariableTime += (getNumericValue(ctx.state.delTimeCalc?.timeCalOther1) * i.quantity)
            break;
          case HDXCategories.dishwashing:
          case HDXCategories.washerDryers:
          case HDXCategories.washingMachines:
            if (isBuiltIn) {
              measures.deliveryVariableTime += (getNumericValue(ctx.state.delTimeCalc?.timeCalOther1) * i.quantity)
            } else {
              measures.deliveryVariableTime += (getNumericValue(ctx.state.delTimeCalc?.timeCalWetConnVar) * i.quantity)
            }
            break;
          case HDXCategories.tumbleDryers:
          case HDXCategories.refrigeration:
          case HDXCategories.freezers:
          case HDXCategories.fridgeFreezer:
          case HDXCategories.fridges:
            if (isBuiltIn) {
              measures.deliveryVariableTime += (getNumericValue(ctx.state.delTimeCalc?.timeCalOther1) * i.quantity)
            } else {
              measures.deliveryVariableTime += (getNumericValue(ctx.state.delTimeCalc?.timeCalOtherConnVar) * i.quantity)
            }
            break;
        }
      }
    }
    if (i.bundleItems.find((b: any) => b.additionalInfo.offeringTypeId == collectScrapId)) {
      measures.collectMeasure1 += i.quantity;
      measures.collectMeasure2 += (dimensions.height * dimensions.width * dimensions.length * i.quantity);
      measures.collectMeasure3 += (dimensions.weight * i.quantity);
      measures.collectVariableTime += (getNumericValue(ctx.state.delTimeCalc?.timeCalRemoveVar) * i.quantity);
    }
  })
  measures.deliveryVariableTime += ((measures.deliveryMeasure2 * getNumericValue(ctx.state.delTimeCalc?.timeCalVolVar)) + (measures.deliveryMeasure3 * getNumericValue(ctx.state.delTimeCalc?.timeCalWeightVar)));
  measures.deliveryVariableTime += (measures.deliveryMeasure1 * getNumericValue(ctx.state.delTimeCalc?.timeCalUnitVar));
  measures.deliveryVariableTime = Math.ceil(measures.deliveryVariableTime);
  measures.deliveryMeasure1 = Math.ceil(measures.deliveryMeasure1);
  measures.deliveryMeasure2 = Math.ceil(measures.deliveryMeasure2 * 1000);
  measures.deliveryMeasure3 = Math.ceil(measures.deliveryMeasure3);
  measures.collectMeasure1 = Math.ceil(measures.collectMeasure1);
  measures.collectMeasure2 = Math.ceil(measures.collectMeasure2 * 1000);
  measures.collectMeasure3 = Math.ceil(measures.collectMeasure3);
  measures.collectVariableTime = Math.ceil(measures.collectVariableTime);
  return measures;
}

export function applyOffsetRule(ctx: Context | OrderEvent, order: OrderForm | Order): string {
  let visitDate = new Date();
  let hasInstallation = false;
  let hasBIInstallation = false;
  for (let i = 0; i < order.items.length && (!hasInstallation || !hasBIInstallation); i++) {
    if (!order.items[i].ignore && order.items[i].bundleItems.find(b => b.additionalInfo.offeringTypeId == ctx.state.appSettings.vtex.additionalServicesData?.find(as => as.tradePolicyId == order.salesChannel)?.installationId)) {
      hasInstallation = true;
      let skuContext = ctx.state.skuContext?.find((s: any) => (s.Id + "") == order.items[i].id);
      let isBuiltIn = skuContext?.ProductSpecifications?.find((ps: any) => ps.FieldName.toLowerCase() == constructionTypeField.toLowerCase())?.FieldValues[0];
      if (!hasBIInstallation) {
        hasBIInstallation = isBuiltIn ? (isBuiltIn.toLowerCase() == ConstructionType.BUILTIN.toLowerCase() ? true : false) : false;
      }
    }
  }
  let offset = 0;
  // first rule
  if (hasInstallation) {
    if (isValid(ctx.state.offset?.adOffset) && ctx.state.offset!.adOffset > 0) {
      offset = ctx.state.offset!.adOffset;
    } else {
      offset = 2;
    }
  } else { // second rule
    if (isValid(ctx.state.offset?.stdOffset) && ctx.state.offset!.stdOffset > 0) {
      offset = ctx.state.offset!.stdOffset;
    } else {
      offset = 2;
    }
  }
  // third rule
  offset -= 1;
  //forth rule
  let time = visitDate.toISOString().split("T")[1]?.split("+")[0];
  if (ctx.state.isHoliday && time < ctx.state.appSettings.vtex.depotConfiguration.defaultEOD!) {
    offset += 1;
  }
  //fifth rule
  if (hasBIInstallation) {
    offset += 2;
  }
  visitDate.setDate(visitDate.getDate() + 1 + offset);
  return visitDate.toISOString()?.split("T")[0] + "T00:00:00";
}
