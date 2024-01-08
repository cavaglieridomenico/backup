/*
  Function to get User info passing the email
*/
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

export const putNewUserWEMEA = (
  email: string,
  firstName: string,
  lastName: string,
  campaign: string,
  isNewsletterOptIn: Boolean
) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      name: firstName,
      surname: lastName,
      sourceCampaign: campaign,
      optin: isNewsletterOptIn,
    }),
  };
  const fetchUrlPatch = "/_v/wrapper/api/campaigns/signup";
  return fetch(fetchUrlPatch, options).then((response) => response);
};

export const getOptinMessageWEMEA = async (
  loggedin: boolean,
  email: string,
  firstName: string,
  surname: string,
  campaign: string
) => {
  // If User isLoggedIn
  if (loggedin) {
    // Update Newsletter Status
    return await putNewUserWEMEA(
      email,
      firstName,
      surname,
      campaign,
      true
    ).then((response: any) => {
      if (response.status !== 200) return "errorRegisterToNL";
      else return "successRegisteredToNL";
    });
  } else {
    // Else --> User isn't loggedIn
    // Get User data from email
    const userData = await getIdUser(email);

    // If --> User is already registered and has isNewsletterOptin = false
    if (userData?.length > 0 && !userData[0]?.isNewsletterOptIn) {
      // User need to be logged to change its marketing preferences
      return "errorMustBeLogeedIn";
    }
    if (userData?.length > 0 && userData[0]?.isNewsletterOptIn) {
      // User previously optin click again optin, msg: success subscription
      return "successRegisteredToNL";
    } else {
      // Else --> New User so register the email
      return await putNewUserWEMEA(
        email,
        firstName,
        surname,
        campaign,
        true
      ).then((response: any) => {
        if (response.status !== 200) return "errorRegisterToNL";
        else return "successRegisteredToNL";
      });
    }
  }
};
