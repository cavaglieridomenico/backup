export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return ({}, value: any) => {
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
  return typeof data == "object" ? JSON.stringify(data, getCircularReplacer()) : data+"";
}

export async function getRequestPayload(ctx: Context): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let payload = "";
    ctx.req.on("data", (chunk: any) => payload += Buffer.from(chunk, "binary").toString("utf8"));
    ctx.req.on("end", () => resolve(JSON.parse(payload)));
    ctx.req.on("error", (err: any) => reject({msg: "error while retrieving the request payload --details: "+stringify(err)}))
  })
}

export async function wait(time: number = 500): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  })
}
