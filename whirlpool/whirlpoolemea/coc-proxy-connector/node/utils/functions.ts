export function stringify(data: any) {
  return typeof data == "object" ? JSON.stringify(data, getCircularReplacer()) : data + "";
}

export function getCircularReplacer() {
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