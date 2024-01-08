export const putNewUser = (
    email: string,
    campaign: string,
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
            name: name,
            surname: surname,
            optin: true,
            sourceCampaign: campaign,
        }),
    };
    const fetchUrlPatch = "/_v/wrapper/api/campaigns/signup";
    return fetch(fetchUrlPatch, options).then((response) => response.text()
    );
};



export const getIdUser = (email: string) => {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const fetchUrl = `/_v/wrapper/api/user/email/userinfo?email=${email}&checkInNL=true`;
    return fetch(fetchUrl, options).then((response) => response.json());
};