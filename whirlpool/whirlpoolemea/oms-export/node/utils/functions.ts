export async function wait(timeout: number): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    setTimeout(() => {
      resolve(true)
    }, timeout);
  })
}

export async function resolvePromises(promises: Promise<any>[], maxPromises: number = 50, timeout: number = 1000): Promise<any[]> {
  let ret: any[] = [];
  for (let i = 0, j = maxPromises; i < i + j && i < promises.length; i = i + j) {
    ret = ret.concat(await Promise.all(promises.slice(i, i + j)))
    await wait(timeout);
  }
  return ret;
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

export function isValid(data: any): boolean {
  return data != undefined && data != null && data != "undefined" && data != "null" && data != "" && data != " " && data != "_" && data != "-" && data != ".";
}
