import React, { useState, useEffect } from "react";
import { Input, Checkbox } from "vtex.styleguide";
import style from "./styles.css";

const sessionAPI = "/api/sessions";

interface RequestACallProps {}
interface WindowsGtm extends Window {
  dataLayer: any;
}

const RequestACall: StorefrontFunctionComponent<RequestACallProps> = ({}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [nameValue, setNameValue] = useState<string>("");
  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const [surnameValue, setSurnameValue] = useState<string>("");
  const [isSurnameValid, setIsSurnameValid] = useState<boolean>(true);
  const [phoneNumberValue, setPhoneNumberValue] = useState<any>("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean>(true);
  const [emailValue, setEmailValue] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [commentValue, setCommentValue] = useState<string>("");
  const [acceptedTermsCheck, setAcceptedTermsCheck] = useState<boolean>(false);
  const [optInCheck, setOptInCheck] = useState<boolean>(false);
  const [isAuthenticated, setAuthenticated] = useState<string>("");
  const [authUserEmail, setAuthUserEmail] = useState<string>("");
  const [authUserId, setAuthUserId] = useState<string>("");

  useEffect(() => {
    fetch(`${sessionAPI}?items=*`, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
    })
      .then((res: any) => res.json())
      .then(
        (res: any) =>
          res.namespaces.profile !== undefined &&
          res.namespaces.profile.isAuthenticated.value === "true" &&
          (setAuthenticated(res.namespaces.profile.isAuthenticated.value),
          setAuthUserEmail(res.namespaces.profile.email.value))
      );
  }, []);

  useEffect(() => {
    isAuthenticated &&
      fetch(
        `/api/dataentities/CL/search?_fields=id,isNewsletterOptIn,acceptedTerms&_where=email=${authUserEmail}`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-cache",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res: any) => res.json())
        .then((res: any) => {
          setOptInCheck(res[0].isNewsletterOptIn),
            setAuthUserId(res[0].id),
            setAcceptedTermsCheck(res[0].acceptedTerms);
        });
  }, [authUserEmail]);

  const handleOpenModal = () => {
    document.body.style.overflow = "hidden";
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    document.body.style.overflow = "auto";
    setIsModalOpen(false);
    setNameValue("");
    setSurnameValue("");
    setPhoneNumberValue(null);
    setEmailValue("");
    setCommentValue("");
    setAcceptedTermsCheck(false);
    setOptInCheck(false);
  };

  const validateEmail = (email: string) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (number: number) => {
    const phoneNumberRegex = /^(\d{10}|\d{12})$/;
    return phoneNumberRegex.test(String(number));
  };

  const handleNameBlur = (e: any) => {
    setIsNameValid(e.target.value !== "" ? true : false);
  };

  const handleSurnameBlur = (e: any) => {
    setIsSurnameValid(e.target.value !== "" ? true : false);
  };

  const handlePhoneNumberBlur = (e: any) => {
    setIsPhoneNumberValid(validatePhoneNumber(e.target.value));
  };

  const handleEmailBlur = (e: any) => {
    setIsEmailValid(validateEmail(e.target.value));
  };

  const patchBodyObj = {
    isNewsletterOptIn: optInCheck,
  };

  const postBodyObj = {
    name: `${nameValue} ${surnameValue}`,
    phoneNumber: phoneNumberValue,
    email: emailValue,
    message: commentValue,
  };

  const registrationBodyObj = {
    firstName: nameValue,
    lastName: surnameValue,
    phone: phoneNumberValue,
    email: emailValue,
    isNewsletterOptIn: optInCheck,
    acceptedTerms: acceptedTermsCheck,
  };

  const handleRequestACall = () => {
    const pushEvent = () => {
      let gtm = window as unknown as WindowsGtm;
      let dataLayer = gtm.dataLayer;

      dataLayer.push({
        event: "footerInteraction",
        interactionType: "CallMeBack",
        socialType: null,
      });
    };
    isAuthenticated === "true"
      ? fetch(`/api/dataentities/CU/documents`, {
          method: "POST",
          credentials: "same-origin",
          cache: "no-cache",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postBodyObj),
        })
          .then(() => {
            fetch(`/api/dataentities/CL/documents/${authUserId}`, {
              method: "PATCH",
              credentials: "same-origin",
              cache: "no-cache",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(patchBodyObj),
            });
          })
          .then(() => {
            pushEvent();
            handleCloseModal();
          })
      : fetch(
          `/api/dataentities/CL/search?_fields=id,isNewsletterOptIn,acceptedTerms&_where=email=${emailValue}`,
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-cache",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
          .then((res: any) => res.json())
          .then((res: any) =>
            res.length > 0
              ? fetch(`/api/dataentities/CU/documents`, {
                  method: "POST",
                  credentials: "same-origin",
                  cache: "no-cache",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(postBodyObj),
                })
              : fetch(`/_v/wrapper/api/user`, {
                  method: "POST",
                  credentials: "same-origin",
                  cache: "no-cache",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(registrationBodyObj),
                }).then(() =>
                  fetch(`/api/dataentities/CU/documents`, {
                    method: "POST",
                    credentials: "same-origin",
                    cache: "no-cache",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postBodyObj),
                  })
                )
          )
          .then(() => {
            pushEvent();
            handleCloseModal();
          });
  };

  const formIsValid =
    nameValue !== "" &&
    surnameValue !== "" &&
    validatePhoneNumber(phoneNumberValue) &&
    validateEmail(emailValue) &&
    acceptedTermsCheck;

  const isDesktop = window.innerWidth > 580;

  return (
    <>
      <button
        id="request-a-call-open"
        className={style.buttonOpenModal}
        onClick={() => handleOpenModal()}
      >
        {" "}
        Заказать звонок{" "}
      </button>
      {isModalOpen && (
        <div className={isDesktop ? style.modal : style.modalMobile}>
          <div
            className={
              isDesktop ? style.modalContent : style.modalContentMobile
            }
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "95%",
                  display: "flex",
                  justifyContent: "center",
                  paddingLeft: "30px",
                }}
              >
                <img
                  src="https://ruwhirlpoolqa.vtexassets.com/assets/vtex/assets-builder/reply.whl-theme/1.0.0/logoHeader___fbcf9a4fd6a042dff48d91ffd7fc357d.svg"
                  alt="logo"
                ></img>
              </div>
              <span
                style={{ width: "5%" }}
                onClick={() => handleCloseModal()}
                className={style.close}
              >
                {" "}
                &times;{" "}
              </span>
            </div>
            <h1 className={style.title}>Заказать обратный звонок</h1>
            <Input
              id="Name"
              name="Name"
              placeholder="Имя*"
              value={nameValue}
              onChange={(e: any) => setNameValue(e.target.value)}
              required={true}
              errorMessage={!isNameValid ? " " : null}
              onBlur={handleNameBlur}
            />
            <Input
              id="Surname"
              name="Surname"
              placeholder="Фамилия*"
              value={surnameValue}
              onChange={(e: any) => setSurnameValue(e.target.value)}
              required={true}
              errorMessage={!isSurnameValid ? " " : null}
              onBlur={handleSurnameBlur}
            />
            <Input
              id="Phone"
              name="Phone"
              placeholder="Телефон* (+7……)"
              value={phoneNumberValue}
              onChange={(e: any) =>
                e.target.value.length < 13
                  ? setPhoneNumberValue(e.target.value)
                  : false
              }
              required={true}
              errorMessage={!isPhoneNumberValid ? " " : null}
              onBlur={handlePhoneNumberBlur}
            />
            <Input
              id="Email"
              name="Email"
              placeholder="Электронная почта*"
              value={emailValue}
              onChange={(e: any) => setEmailValue(e.target.value)}
              required={true}
              errorMessage={!isEmailValid ? " " : null}
              onBlur={handleEmailBlur}
            />
            <Input
              id="Time"
              name="Time"
              placeholder="Комментарий/время звонка"
              value={commentValue}
              onChange={(e: any) => setCommentValue(e.target.value)}
            />
            <div style={{ width: "90%", fontSize: "12px", display: "flex" }}>
              <Checkbox
                checked={acceptedTermsCheck}
                id="terms"
                onChange={() => setAcceptedTermsCheck(!acceptedTermsCheck)}
                disabled={
                  isAuthenticated === "true" ? acceptedTermsCheck : false
                }
              />
              <label style={{ marginLeft: "1rem", fontSize: 11 }}>
                Я принимаю{" "}
                <a
                  style={{ textDecoration: "none", color: "#edb112" }}
                  href="/distance-selling-way"
                  target="_blank"
                >
                  Правила продажи товаров дистанционным способом
                </a>{" "}
                и ознакомлен с{" "}
                <a
                  style={{ textDecoration: "none", color: "#edb112" }}
                  href="/treatment-of-personal-data"
                  target="_blank"
                >
                  Политикой обработки персональных данных
                </a>
                .*
              </label>
            </div>
            <div style={{ width: "90%", fontSize: "12px", display: "flex" }}>
              <Checkbox
                checked={optInCheck}
                id="optin"
                onChange={() => setOptInCheck(!optInCheck)}
              />
              <label style={{ marginLeft: "1rem", fontSize: 11 }}>
                Я даю{" "}
                <a
                  target="_blank"
                  href="/legal/soglasie-na-obrabotku-personalnyh-dannyh"
                  style={{ textDecoration: "none", color: "#edb112" }}
                >
                  согласие
                </a>{" "}
                на обработку моих персональных данных с целью получения
                информационно-рекламных материалов и участия в опросах Whirlpool
                посредством рассылки на адрес электронной почты, SMS-рассылки,
                телефонных звонков.
              </label>
            </div>
            <button
              id="request-a-call-button"
              className={style.button}
              disabled={!formIsValid}
              style={{ opacity: formIsValid ? 1 : 0.6 }}
              onClick={() => handleRequestACall()}
            >
              Заказать звонок
            </button>
          </div>
        </div>
      )}
    </>
  );
};

RequestACall.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {},
};

export default RequestACall;
