export function safelyGetBlockClass(blockClass: string) {
  return blockClass ? blockClass.split(" ")[0] : "";
}

export function generateBlockClass(baseClass: string, blockClass?: string) {
  return blockClass
    ? `${baseClass} ${baseClass}--${safelyGetBlockClass(blockClass)}`
    : baseClass;
}

export interface BlockClass {
  blockClass?: string;
}

export const CSS_HANDLES = [
  "container",
  "container__timer",
  "container__loader",
  "container__timer-number",
  "container__timer-first",
  "container__timer-second",
  "font__size-mobile",
  "timer__span",
  "timer__span-dots",
  "timer__span-label",
  "loader__width",
  "loader__form",
  "effect__opacity-on",
] as const;
