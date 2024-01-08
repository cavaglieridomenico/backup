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

export const hoursToMs = (hours: number) => (hours * 10 ** 3) * 36 * 10 ** 2

export const subtractHoursFromDate = (hours: number, date: Date = new Date()) => new Date(date.setHours(date.getHours() - hours))




