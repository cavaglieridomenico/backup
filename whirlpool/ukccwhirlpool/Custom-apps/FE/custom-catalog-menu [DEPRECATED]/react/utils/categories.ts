import { sessionAPI, brandsAPI, categoryAPI } from "./constants";


export async function getUserSession(): Promise<any> {
  return fetch(`${sessionAPI}?items=*`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function editUserSession(newChannel: string): Promise<any> {
  const body = JSON.stringify({ public: { region: { value: newChannel } } });
  return fetch(`${sessionAPI}`, {
    method: "PATCH",
    credentials: "same-origin",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
}

export async function getCategories(): Promise<any> {
  return fetch(`${categoryAPI}`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
  });
}

export async function getBrands(): Promise<any> {
  return fetch(`${brandsAPI}`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
  });
}