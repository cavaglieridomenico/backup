export const handleApi = async (
  method: Method,
  url: string,
  body?: { [key: string]: any }
) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  }
  const raw = await fetch(url, options)
  if (raw.ok) {
    if(raw?.headers?.get("content-type") && raw?.headers?.get("content-type")?.indexOf("application/json") !== -1)
      return await raw.json()
    else return await raw.text()
  }
  else throw new Error()
}
/**
 * appInfos const used in the GraphQL query
 * to get app settings
 */
export const appInfos = {
  vendor: "whirlpoolemea",
  appName: "black-friday-registration-form",
  version: "0.x",
};