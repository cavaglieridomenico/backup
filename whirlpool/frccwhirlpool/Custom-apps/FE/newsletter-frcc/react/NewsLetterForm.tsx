import React, { useState, useContext, useEffect, useRef } from "react";
import { Input, Checkbox } from "vtex.styleguide";
import { CampaignContext } from "./CampaignContext";
import style from "./style.css";
import FetchFunction from "./UtilityFunction";
import getUserInfos from "./graphql/getUserInfos.graphql";
import { useQuery } from "react-apollo";
import { usePixel } from "vtex.pixel-manager";

interface NewsLetterFormProps {
  title?: string;
  description?: boolean;
  textButton?: string;
  // linkPrivacy: string;
  name: boolean;
  surname: boolean;
}

const addOrUpdateUser = (
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
  return fetch(fetchUrlPatch, options).then((response) =>
    !response.ok ? Promise.resolve({ error: true }) : response.json()
  );
};

const getIdUser = (email: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const fetchUrl = "/_v/wrapper/api/user/email/userinfo?email=" + email;
  return fetch(fetchUrl, options).then((response) => response.json());
};

const NewsLetterForm: StorefrontFunctionComponent<NewsLetterFormProps> = ({
  title,
  description,
  textButton,
  // linkPrivacy = "/pagine/informativa-sulla-privacy",
  name = true,
  surname = true,
}: NewsLetterFormProps) => {
  const { loading: infoDataLoading, data } = useQuery(getUserInfos);
  const { push } = usePixel();

  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [isSurnameValid, setIsSurnameValid] = useState(true);
  const [isMailValid, setIsMailValid] = useState(true);
  const [surnameValue, setSurnameValue] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAlreadyRegistred, setAlreadyRegister] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);
  const [messageSuccess, setMessage] = useState(
    "Vous avez été enregistré avec succès à la newsletter"
  );

  //GA4FUNREQ60
  const analyticsPopupWrapper: any = useRef(null);
  useEffect(() => {
    if (!analyticsPopupWrapper) return;
    const ga4Data = {
      event: "popup",
      popupId: analyticsPopupWrapper.current.id,
    };
    push({ ...ga4Data, action: "view" });
    analyticsPopupWrapper.current.addEventListener("click", () =>
      push({ ...ga4Data, action: "click" })
    );
    return () => {
      push({ ...ga4Data, action: "close" });
      analyticsPopupWrapper.current.removeEventListener("click", () =>
        push({ ...ga4Data, action: "click" })
      );
    };
  }, [analyticsPopupWrapper]);

  const pushOptinEvent = () => {
    push({
      event: "LeadGeneration",
      data: "newsletter_subscription",
    });

    // GA4FUNREQ23
    push({
      event: "ga4-personalArea",
      section: "Newsletter form",
      type: "registration",
    });

    //GA4FUNREQ53
    push({
      event: "ga4-form_submission",
      type: "newsletter",
    });

    //GA4FUNREQ61
    push({
      event: "ga4-optin",
    });
  };

  useEffect(() => {
    if (!infoDataLoading && data) {
      setEmailValue(data?.loggedInUserInfo?.email || "");
      setNameValue(data?.loggedInUserInfo?.firstName);
      setSurnameValue(data?.loggedInUserInfo?.lastName);
    }
  }, [infoDataLoading]);

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const formIsValid =
    nameValue !== "" && surnameValue !== "" && validateEmail(emailValue);
  const campaign = useContext(CampaignContext);

  const handleSubmit = (e: any) => {
    setLoading(true);
    getIdUser(emailValue).then((User: any) => {
      if (User.length > 0 && !User[0].isNewsletterOptIn) {
        FetchFunction.getUser().then((response: any) => {
          if (
            response.namespaces.profile == undefined ||
            response.namespaces.profile.isAuthenticated.value == "false"
          ) {
            setMessage("Vous êtes déjà enregistré.");
          } else {
            addOrUpdateUser(emailValue, campaign.campaignState, nameValue, surnameValue);
            pushOptinEvent();
          }
          setLoading(false);
          setSuccess(true);
        });
      } else if (User.length > 0 && User[0].isNewsletterOptIn) {
        setLoading(false);
        setSuccess(true);
        setAlreadyRegister(true);
        push({ event: "errorMessage", data: "Vous êtes déjà enregistré" });
        //GA4FUNREQ58
        const ga4Data = {
          event: "ga4-custom_error",
          type: "error message",
          description: "Error user already registered",
        };
        push({ ...ga4Data });
      } else {
        addOrUpdateUser(
          emailValue,
          campaign.campaignState,
          nameValue,
          surnameValue
        ).then((response: any) => {
          setAlreadyRegister(false);
          setLoading(false);
          if (response.Message == undefined && !response.error) {
            setSuccess(true);
            pushOptinEvent();
          } else if (response.error) {
            setSuccess(true);
            setLoading(false);
            setIsFetchError(true);
            push({
              event: "errorMessage",
              data: "Quelque chose s'est mal passé. Merci d'essayer plus tard",
            });
            //GA4FUNREQ58
            const ga4Data = {
              event: "ga4-custom_error",
              type: "error message",
              description: "Error submitting form",
            };
            push({ ...ga4Data });
          }
        });
      }
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleNameBlur = (e: any) => {
    if (e.target.value !== "") {
      setIsNameValid(true);
    } else {
      setIsNameValid(false);
      push({ event: "errorMessage", data: "Complétez le champ" });
      //GA4FUNREQ58
      const ga4Data = {
        event: "ga4-custom_error",
        type: "error message",
        description: "Name not entered",
      };
      push({ ...ga4Data });
    }
  };
  const handleSurnameBlur = (e: any) => {
    if (e.target.value !== "") {
      setIsSurnameValid(true);
    } else {
      setIsSurnameValid(false);
      push({ event: "errorMessage", data: "Complétez le champ" });
      //GA4FUNREQ58
      const ga4Data = {
        event: "ga4-custom_error",
        type: "error message",
        description: "Surname not entered",
      };
      push({ ...ga4Data });
    }
  };
  const handleMailBlur = (e: any) => {
    if (validateEmail(e.target.value)) {
      setIsMailValid(true);
    } else {
      setIsMailValid(false);
      push({ event: "errorMessage", data: "Complétez le champ" });
      //GA4FUNREQ58
      const ga4Data = {
        event: "ga4-custom_error",
        type: "error message",
        description: "Invalid email format",
      };
      push({ ...ga4Data });
    }
  };

  const generateForm = () => {
    return (
      //GA4FUNREQ60
      <div
        className="analytics-popup-wrapper"
        id="newletter_popup"
        ref={analyticsPopupWrapper}
      >
        <div className={style.containerForm}>
          <h2 className={style.titleForm}>{title}</h2>
          <h4 className={style.descriptionForm}>{description}</h4>
          <form onSubmit={handleSubmit}>
            <div className={style.fieldContainer}>
              {name ? (
                <Input
                  // label="Nom"
                  placeholder="Nom"
                  value={nameValue}
                  onChange={(e: any) => setNameValue(e.target.value)}
                  errorMessage={!isNameValid ? "Complétez le champ" : null}
                  required={true}
                  onBlur={handleNameBlur}
                />
              ) : // <Input
              //     onChange={(e: any) => setNameValue(e.target.value)}
              //     value={nameValue}
              //     // error={true}
              //     errorMessage={nameValue ? "Complétez le champ" : null}
              // />
              null}

              {surname ? (
                <Input
                  //label="Prénom"
                  placeholder="Prénom"
                  value={surnameValue}
                  onChange={(e: any) => setSurnameValue(e.target.value)}
                  onBlur={handleSurnameBlur}
                  errorMessage={!isSurnameValid ? "Complétez le champ" : null}
                  required={true}
                />
              ) : null}
            </div>

            <div
              className={`${style.fieldContainer} ${style.fieldContainerEmail}`}
            >
              <Input
                //label="prenom.nom@example.fr"
                placeholder="prenom.nom@example.fr"
                value={emailValue}
                type="email"
                onChange={(e: any) => {
                  !data?.loggedInUserInfo?.email
                    ? setEmailValue(e.target.value)
                    : null;
                }}
                disabled={data?.loggedInUserInfo?.email && true}
                onBlur={handleMailBlur}
                errorMessage={!isMailValid ? "Complétez le champ" : null}
              />
            </div>

            <div className={style.informativa}>
              <div>
                <label
                  htmlFor="default-checkbox-group"
                  style={{ marginLeft: "0", fontSize: "0.625rem" }}
                >
                  J'ai lu et compris le contenu de la{" "}
                  <a
                    target="_blank"
                    href="/pages/politique-de-protection-des-donnees-a-caractere-personnel"
                    style={{ textDecoration: "none", color: "#edb112" }}
                  >
                    Politique de protection des données à caractère personnel
                  </a>{" "}
                  et :
                </label>
                <div style={{ display: "flex" }}>
                  <div
                    style={{ margin: "0.2rem 0.5rem", fontSize: "0.625rem" }}
                  >
                    <Checkbox
                      checked={privacy}
                      id="privacy-check"
                      // label=""
                      name="default-checkbox-group"
                      onChange={(e: any) => setPrivacy(e.target.checked)}
                      required={true}
                      value={privacy}
                    />
                  </div>

                  <label
                    htmlFor="default-checkbox-group"
                    style={{
                      marginLeft: "0",
                      fontSize: "0.625rem",
                      textAlign: "justify",
                    }}
                  >
                    je consens au traitement de mes données personnelles pour
                    permettre à Whirlpool France S.A.S. de m'envoyer des
                    bulletins d'information/communications marketing (sous forme
                    électronique et non électronique, y compris par téléphone,
                    courrier traditionnel, e-mail, SMS, MMS, notifications push
                    sur des sites tiers, y compris sur les plateformes Facebook
                    et Google) concernant les produits et services de Whirlpool
                    France S.A.S. même achetés ou enregistrés par vous.
                  </label>
                </div>
              </div>
            </div>

            <div className={style.submitContainer}>
              {!loading ? (
                !success ? (
                  <div style={{ opacity: !formIsValid ? 0.4 : 1 }}>
                    <Input
                      disabled={!formIsValid}
                      type="submit"
                      value={textButton}
                    />
                  </div>
                ) : isAlreadyRegistred ? (
                  <>
                    <div style={{ opacity: !formIsValid ? 0.4 : 1 }}>
                      <Input
                        disabled={!formIsValid}
                        type="submit"
                        value={textButton}
                      />
                    </div>
                    <div style={{ marginBottom: "1rem" }} />
                    <div className={style.errorClass}>
                      Vous êtes déjà enregistré
                    </div>
                  </>
                ) : isFetchError ? (
                  <>
                    <div className={style.errorClass}>
                      Quelque chose s'est mal passé. Merci d'essayer plus tard
                    </div>
                  </>
                ) : (
                  <div className={style.successClass}>{messageSuccess}</div>
                )
              ) : (
                <div className={style.loaderForm}></div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  return generateForm();
};

NewsLetterForm.schema = {
  title: "NewsLetterFrom",
  description: "Newsletter form",
  type: "object",
  properties: {
    title: {
      title: "Modal title",
      description: "",
      default: undefined,
      type: "string",
    },
    description: {
      title: "Modal subtitle",
      description: "",
      default: undefined,
      type: "string",
    },
    textButton: {
      title: "Button label",
      description: "Label shown on the submit button",
      default: "",
      type: "string",
    },
    // linkPrivacy: {
    //   title: "Link to privacy page",
    //   description: "url privacy page",
    //   default: "",
    //   type: "string",
    // },
    name: {
      title: "Name field",
      description:
        "Boolean able to decide if the filed name should be visible or not",
      default: true,
      type: "boolean",
    },
    surname: {
      title: "Surname field",
      description:
        "Boolean able to decide if the filed surname should be visible or not",
      default: true,
      type: "boolean",
    },
  },
};

export default NewsLetterForm;
