/**
 * Get path from URL
 * @param {string} url - URL
 * @return {string} URL without path
 * Example input:  https://samplePage--itwhirlpool.myvtex.com/?gclwE&gclsrc=aw.ds
 * Returnns: https://samplePage--itwhirlpool.myvtex.com/
 */
export function getPathFromUrl(url: string) {
  return url?.split("?")[0];
}
