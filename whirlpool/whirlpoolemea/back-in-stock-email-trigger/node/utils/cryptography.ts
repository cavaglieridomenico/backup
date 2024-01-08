const crypto = require('crypto');

export function sha512(data: string): string {
  let hash = crypto.createHash('sha512');
  data = hash.update(data, 'utf-8').digest('hex');
  return data;
}
