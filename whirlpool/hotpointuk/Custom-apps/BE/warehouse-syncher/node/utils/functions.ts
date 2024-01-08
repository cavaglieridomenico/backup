export async function wait(time: number = 500): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  })
}

export function isValid(field: any): Boolean {
  return field != undefined && field != null && field != "null" && field != "undefined" && field != " " && field != "" && field != !"-" && field != "_";
}

export function getNumericValue(data: any): number {
  return isValid(data) ? data : 0;
}

export async function isNotUndefined(data: any, error: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    data ? resolve(true) : reject({ msg: error });
  })
}

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return ({ }, value: any) => {
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
  return typeof data == "object" ? JSON.stringify(data, getCircularReplacer()) : data + "";
}

export async function getRequestPayload(ctx: Context): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let payload = "";
    ctx.req.on("data", (chunk) => payload += Buffer.from(chunk, "binary").toString("utf8"));
    ctx.req.on("end", () => resolve(JSON.parse(payload)));
    ctx.req.on("error", (err) => reject({ msg: "error while retrieving the request payload --details: " + stringify(err) }))
  })
}


export function routeToLabel(ctx: Context | OrderEvent): string {
  let label = "Unknown event: ";
  if (isValid(ctx.vtex.eventInfo?.sender)) {
    label = "Order " + (ctx as OrderEvent).body.orderId + ": ";
  } else {
    switch (ctx.vtex.route.id) {
      case "sync":
        label = "CNET Notification: ";
        break;
      case "notify":
        label = "Seller Notification: ";
        break;
      case "manualSync":
        label = "Order " + ctx.vtex.route.params.orderId + ": ";
        break;
    }
  }
  return label;
}

export function normalizeQuantity(quantity: number): number {
  return quantity <= 0 ? 0 : quantity;
}

export function compairQuantity(q0: number, q1: number): number {
  return q0 > q1 ? 1 : (q0 == q1 ? 0 : -1)
}

export async function resolvePromises(promises: Promise<any>[], maxPromises: number = 50, timeout: number = 200): Promise<any[]> {
  return new Promise<any[]>(async (resolve, reject) => {
    try {
      let result: any[] = [];
      for (let i = 0, j = maxPromises; i < promises.length; i = i + j) {
        result = result.concat(await Promise.all(promises.slice(i, i + j)))
        await wait(timeout);
      }
      resolve(result);
    } catch (err) {
      reject({ msg: "Error while resolving multiple promises --details: " + stringify(err) });
    }
  })
}
