import { CatalogUpdateEvent } from "..";

export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => { resolve(true) }, time);
  })
}

export const saveEventRecord = async (ctx: CatalogUpdateEvent, skuId: string) => {
  return await ctx.clients.masterdata.createDocument({
    dataEntity: "PU",
    fields: { id: skuId },
  })
}

export const deleteEventRecord = async (ctx: any, skuId: string) => {
  return await ctx.clients.masterdata.deleteDocument({
    dataEntity: "PU",
    id: skuId,
  })
}

export const removeWER = (sku12NC: string) => sku12NC.includes("WER") ? sku12NC.split("-")[0] : sku12NC

