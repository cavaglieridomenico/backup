export async function wait(time: number = 500): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  })
}

export function stringify(data: any): string {
  return typeof data == "object" ? JSON.stringify(data, getCircularReplacer()) == "{}" ? data : JSON.stringify(data, getCircularReplacer()) : data;
}

export function getCircularReplacer() {
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