
export function stringify(data: any): string {
  if(typeof data=="object")
    return JSON.stringify(data, getCircularReplacer())
  return data+"";
}

const getCircularReplacer = () => {
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
