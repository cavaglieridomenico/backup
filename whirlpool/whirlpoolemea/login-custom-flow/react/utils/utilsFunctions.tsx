/*
  Register new User in VTEX
*/
export const putNewUser = (
  email: string,
  optin: boolean,
  profOptin: boolean,
  name?: string,
  surname?: string,
) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      firstName: name,
      lastName: surname,
      isNewsletterOptIn: optin,
      isProfilingOptIn: profOptin
    }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/user";
  return fetch(fetchUrlPatch, options).then((response) => response.json());
};
/*
  Get User info from email
*/
export const getIdUser = (email: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const fetchUrl = "/_v/wrapper/api/user/email/userinfo?email=" + email;
  return fetch(fetchUrl, options).then((response) => response.json());
};
