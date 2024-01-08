export async function wait(time: number = 500): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  })
}

export function isValid(field: any): boolean {
  return field != undefined && field != null && field != "null" && field != "undefined" && field != " " && field != "" && field != !"-" && field != "_";
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
};

export function stringify(msg: any): string {
  return typeof msg == "object" ? JSON.stringify(msg, getCircularReplacer()) : (msg + "");
}

export async function getRequestPayload(ctx: Context): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let payload = "";
    ctx.req.on("data", (chunk) => payload += Buffer.from(chunk, "binary").toString("utf8"));
    ctx.req.on("end", () => resolve(JSON.parse(payload)));
    ctx.req.on("error", (err) => reject({ msg: `error while retrieving the request payload --details: ${stringify(err)}` }));
  })
}

export function routeToLabel(ctx: Context | OrderEvent): string {
  let label = "Unknown event: ";
  if (isValid(ctx.vtex.eventInfo?.sender)) {
    label = "Count order: ";
  } else {
    switch (ctx.vtex.route.id) {
      case "cartChecker":
        label = "Check cart: "
        break;
      case "updateCartItems":
        label = "Update cart: ";
        break;
      case "countOrder":
        label = "Count order: ";
        break;
    }
  }
  return label;
}
