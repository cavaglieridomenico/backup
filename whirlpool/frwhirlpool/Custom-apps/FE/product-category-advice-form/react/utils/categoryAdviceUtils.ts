export const postCategoryAdviceForm = (
  email: string,
  firstName: string,
  lastName: string,
  category: string
) => {
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      firstName,
      lastName,
      category,
    }),
  };
  const fetchUrlPatch = "/app/sfmc/categoryAdvise";
  return fetch(fetchUrlPatch, options).then((response) => response);
};
export const putNewOptinForUser = () => {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isNewsletterOptIn: true,
    }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/user/newsletteroptin";
  return fetch(fetchUrlPatch, options).then((response) => response.json());
};
export const getSessionData = () => {
  return fetch("/api/sessions?items=*")
    .then((res: any) => res.json())
    .then((data) => {
      return data.namespaces.profile;
    });
};
export const putNewUser = (
  campaign: string,
  optin: boolean,
  email: string,
  name?: string,
  surname?: string
) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      firstName: name,
      lastName: surname,
      campaign: campaign,
      isNewsletterOptIn: optin,
    }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/user?userId=true";
  return fetch(fetchUrlPatch, options).then((response) => response.json());
};

export const getIdUser = (email: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const fetchUrl = "/_v/wrapper/api/user/email/userinfo?email=" + email;
  return fetch(fetchUrl, options).then((response) => response.json());
};