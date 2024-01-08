import React, { useState } from "react";
import style from './style.css'
import { FormattedMessage } from "react-intl";
import { Button } from "vtex.styleguide";

interface SocialLoginProps{
    iconFacebook?:string,
    iconGoogle?:string
}

const SocialLogin: StorefrontFunctionComponent<SocialLoginProps> = ({
    iconFacebook,
    iconGoogle
}) => {

    const [loading, setLoading] = useState(false);
    const [social, setSocial] = useState("");

    const onClickFacebook = () => {
        return setSocial("facebook")
    }
    const onClickGoogle = () => {
        return setSocial("google")
    }

    function putNewSocialUser(sc: string) {
        const query = new URLSearchParams(window.location.search);
        const fetchUrlPatch = "/v1/api/social-connector/oauth/getauthcode?" + new URLSearchParams({
            state: query.get("state") || "",
            redirect_uri: query.get("redirect_uri") || "",
            social: sc,
            acceptedTerms: "true",
            isNewsletterOptIn: "false",
        })
        console.log(fetchUrlPatch);
        window.location.href = fetchUrlPatch;
    }

    const handleSubmit = (e: any) => {
        setLoading(!loading);
        e.preventDefault();
        e.stopPropagation();
        putNewSocialUser(social);
    };

    return (
        <div className={style.containerSocialPage}>
            <form onSubmit={handleSubmit}>
                <h3 className={style.title}><FormattedMessage id="store/scelta-social" /></h3>
                <div className={style.containerButtonSocial}>
                    <Button isActiveOfGroup={social === "facebook"} onClick={onClickFacebook}>
                        <span className={style.socialName}><FormattedMessage id="store/facebook" /></span>
                        <img src={iconFacebook} width="24px"></img>
                    </Button>
                    <Button isActiveOfGroup={social === "google"} onClick={onClickGoogle}>
                        <span className={style.socialName}><FormattedMessage id="store/google" /></span>
                        <img src={iconGoogle} width="24px"></img>
                    </Button>
                </div>
                <div className={style.containerTermini}>
                    <label><FormattedMessage id="store/intro-informativa" />
                        <a className={style.testoInformativa} href="/pagine/informativa-sulla-privacy" target="_blank">
                            <FormattedMessage id="store/informativa" /></a>
                    </label>
                </div>
                <div className={style.containerButtonSocial}>
                    {!loading ? (
                        <Button type="submit" disabled={social === ""}>
                            <span> <FormattedMessage id="store/registrati" /></span>
                        </Button>
                    ) : (
                        <div className={style.loaderForm}></div>
                    )}
                </div>
            </form>
        </div>
    )
}

SocialLogin.schema = {
    title: 'editor.SocialLogin.title',
    description: 'editor.SocialLogin.description',
    type: 'object',
    properties:{
        iconFacebook:{
            type:"string",
            default:''
        },
        iconGoogle:{
            type:"string",
            default:''
        }
    }
}

export default SocialLogin