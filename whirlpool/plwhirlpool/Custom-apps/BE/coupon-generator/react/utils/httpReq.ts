const execFetch = async (url: string, method: string, body?: any, headers?: any) => {
  return fetch(url, {
    method: method,
    body: typeof body != "string" ? JSON.stringify(body) : body,
    headers: headers
  }).then(res => res.json())
}


export { execFetch }
