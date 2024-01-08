import { StockInfo } from "../typings/sap-po";
import { getRequestPayload, isValid } from "../utils/functions";

export async function checkCNETPayload(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.reqPayload = await getRequestPayload(ctx);
    await checkPayload(ctx.state.reqPayload);
    await next();
  } catch (err) {
    console.error(err)
    ctx.status = 400;
    ctx.body = "Bad Request";
  }
}

async function checkPayload(payload: StockInfo[]): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (
      payload?.length > 0 &&
      !payload?.find(p => !isValid(p.productCode) || isNaN(p.stock) || isNaN(p.reserved)) &&
      !payload?.find(p => payload.filter(p1 => p1.productCode == p.productCode)?.length > 1)
    ) {
      resolve(true);
    } else {
      reject({ msg: "Bad Request" });
    }
  })
}
