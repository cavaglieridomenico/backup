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
