export const getUserOptin = (email: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const fetchUrl = "/_v/wrapper/api/user/email/userinfo?email=" + email;
  return fetch(fetchUrl, options).then((response) => response.json());
};

export const getUserAuthentication = () => {
  return fetch("/api/sessions?items=*", {
    method: "GET",
    headers: {},
  }).then((response) => response.json());
};

export const putNewUser = (userDatas: any, campaign: string) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userDatas?.email,
      name: userDatas?.name,
      surname: userDatas?.surname,
      optin: true,
      sourceCampaign: campaign,
    }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/campaigns/signup";
  return fetch(fetchUrlPatch, options).then((response: any) =>
    !response.ok ? Promise.resolve({ error: true }) : response.text()
  );
};
