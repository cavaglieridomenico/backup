import { FormState } from "../MasterchefForm";

interface WindowGTM extends Window {
  dataLayer: any[]
}

const userInfoApi: string = '/_v/wrapper/api/user/email/userinfo?email=';
const postUserApi: string = '/_v/wrapper/api/user?userId=true';
const postFormDataApi: string = '/_v/wrapper/api/masterchef';

export const handleRegistration = async (form: FormState, customCampaign?: string, setSubmitStatus?: any, buttonLabel?: string) => {
    const dataLayer = ((window as unknown) as WindowGTM).dataLayer || []
    const newsletterUrl = window?.location?.href.split('?')[1]
    const targetCampaign = newsletterUrl?.toString().toUpperCase().replace('=', '') ?? customCampaign;
    const newsletterCheckbox = form.checkboxes?.find((item: any) => item.isNewsletter === true);
    const isNewsletterChecked = newsletterCheckbox.checked;

    const postMasterchefForm = async (form: FormState) => {
        const {name, surname, email, image} = form;
        // HANDLING THE INFOS AND FILE UPLOAD VIA FORMDATA API
        const formData = new FormData();
        formData.append("name", name);
        formData.append("surname", surname);
        formData.append("email", email);
        formData.append("optIn", isNewsletterChecked);
        formData.append("image", image);
        const postData = await fetch(postFormDataApi, {method: "POST", body: formData});
        if (!postData.ok) {
            return false;
        } else {
            return true;
        }
    }

    // NEWSLETTER OPTIN API CALL
    try {
        setSubmitStatus("LOADING");
        const userData = await fetch(`${userInfoApi}${form.email}`, {method: "GET", headers: {'Content-Type': 'application/json'}});
        if (!userData.ok) {
            setSubmitStatus("FAILED")
            throw new Error("Api get call failed");
        }
        const response = await userData.json();
        // IF USER ALREADY EXISTS (FOR THIS APP WE DON'T CARE IF HE HAS NEWSLETTER OPTIN OR NOT, WE JUST CHECK IF THE USER ALREADY EXISTS)
        if (response.length > 0) {
            // API CALL TO SAVE THE IMAGE AND USER IN MASTERDATA
            const dataIsSent = await postMasterchefForm(form);
            if (dataIsSent) {
                setSubmitStatus("SUCCESS")
                dataLayer.push({
                    event: 'cta_click',
                    eventCategory: 'CTA Click', // Fixed value
                    eventAction: 'Marketing', // dynamic value – please verify that this is equal to “Marketing”
                    eventLabel: 'subscription_masterchef', // fixed value
                    link_url: window?.location?.href, // actual url of the page
                    link_text: buttonLabel, // button value in original language
                    checkpoint: '1', // dynamic value - the position of the CTA in the page
                    area: 'Marketing', // dynamic value - will be populated like 'eventAction’
                    type: 'Subscribe now', // dynamic value - button value but in ENGLISH
                }) 
            } else {
                setSubmitStatus("FAILED")
                throw new Error("Api post image data call failed")
            }
        } else {
            // IF USER DOES NOT EXIST
            const body = {
                firstName: form.name,
                lastName: form.surname,
                email: form.email,
                isNewsletterOptIn: isNewsletterChecked,
                campaign: targetCampaign
            }
            // CREATE NEW USER AND PUSH DL EVENTS
            const postNewUser = await fetch(postUserApi, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
            if (!postNewUser.ok) {
                setSubmitStatus("FAILED")
                throw new Error("Api post user data call failed");
            } else {
                // API CALL TO SAVE THE IMAGE AND USER IN MASTERDATA
                const dataIsSent = await postMasterchefForm(form);
                if (!dataIsSent) {
                    setSubmitStatus("FAILED")
                    throw new Error("Api post image data call failed")
                } else {
                    dataLayer.push({
                        event: 'userRegistration',
                    })
                    dataLayer.push({
                        event: 'optin_granted',
                    })
                    dataLayer.push({
                        event: 'cta_click',
                        eventCategory: 'CTA Click', // Fixed value
                        eventAction: 'Marketing', // dynamic value – please verify that this is equal to “Marketing”
                        eventLabel: 'subscription_masterchef', // fixed value
                        link_url: window?.location?.href,
                        link_text: buttonLabel, // button value always in english so form Invia -> Send
                        checkpoint: '1', // dynamic value - will be populated like 'eventLabel’
                        area: 'Marketing', // dynamic value - will be populated like 'eventAction’
                        type: 'Subscribe now', // dynamic value
                    })    
                    dataLayer.push({
                        event: "leadGeneration",
                        eventCategory: "Lead Generation",
                        eventAction: "Optin granted",
                        eventLabel: "Lead from Newsletter",
                        email: form.email,
                    });
                    setSubmitStatus("SUCCESS")
                }
            }
        }
    } catch (e) {
        console.log(e)
        setSubmitStatus("FAILED");
    }
}