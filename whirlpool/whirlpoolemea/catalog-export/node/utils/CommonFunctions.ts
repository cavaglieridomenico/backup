import { createHash } from 'crypto'

export const getCacheKey = (...args: (string | number)[]) =>
  createHash("sha256").update(args.join('_')).digest("hex")

