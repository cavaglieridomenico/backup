import React, { useEffect, useState } from "react";

export default function EmbeddedExtendedWarranty() {
  const [value, setValue] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    getEmbeddedExtendedWarrantyData();
  }, []);

  function getEmbeddedExtendedWarrantyData() {
    const script = document.createElement("script");
    script.id = "booking-ref-bootstrap";
    script.src = "//icb.prod.wpsandwatch.com/static/bootstrap.js";
    script.type = "text/javascript";
    document.body.appendChild(script);
  }

  function analyticsCallback() {
    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "ESerrorMessage",
      eventAction: "0021",
      eventLabel: value ? value : "Error during login",
    };
    window.dataLayer.push(analyticsJson);
  }

  useEffect(() => {
    let errorMessage = document.querySelectorAll(".icb-form__error");
    if (
      errorMessage &&
      errorMessage.length &&
      errorMessage[0]["style"]["display"] !== "none"
    ) {
      setTextErrMessage(errorMessage[0].text);
    }
  }, [isChecking]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      let buttonForm = document.querySelectorAll(".icb-form__btn");
      let errorMessage = document.querySelectorAll(".icb-form__error");
      // verficare che non sia none
      if (buttonForm && buttonForm.length) {
        setValue(errorMessage[0].innerHTML);

        buttonForm[0].addEventListener("click", function () {
          setIsChecking(true);
          analyticsCallback();
        });
      }

      if (
        errorMessage &&
        errorMessage.length &&
        errorMessage[0]["style"]["display"] !== "none"
      ) {
        setTextErrMessage(errorMessage[0].text);
      }
      clearInterval(timeout);
    }, 3000);
  }, []);

  return (
    <>
      <style>
        {
          "\
          .icb-container__wrapper{\
            display: flex;\
            flex-direction: column;\
            align-items: center;\
          }\
          .icb-header, .icb-form__container.icb-form__container--login{\
            width: 900px !important;\
            background: #ffffff;\
            padding: 0 15px 15px;\
          }\
          .flex.flex-grow-1.w-100.flex-column{\
            background: #F8FBFD;\
          }\
          .brand-theme-id {\
            padding: 0 !important;\
          }\
          .icb-form__btn {\
            border-radius: 5px;\
            color: #fff;\
            padding: 16px 28px;\
            position: relative;\
            font-size: 16px;\
            cursor: pointer;\
            text-align: center;\
            border: none;\
            background: #0090d0;\
          }\
          .icb-form__btn:hover {\
            background: #005c92;\
          }\
          .brand-theme-id .icb-form__button[data-v-502b47d9]{\
            padding: 0;\
            background: unset;\
            text-decoration: none;\
          }\
          .brand-theme-id .icb-form__button[data-v-502b47d9]:hover{\
            background: unset;\
          }\
          .brand-theme-id .icb-form__button[data-v-036d17f0]{\
            background: unset;\
            padding: 0;\
            border-radius: 0;\
            text-decoration: none;\
          }\
          .icb-container.icb-container--step1.step1, .flex.flex-grow-1{\
            background: #F8FBFD;\
          }\
          .icb-header{\
            padding: 25px 15px 0;\
          }\
          .icb-header__title {\
            font-family: 'Roboto';\
            margin-bottom: 3rem;\
            font-size: 26px;\
          }\
          .icb-header__subtitle {\
            font-family:'Roboto-Light';\
          }\
          .icb-form__label{\
            font-family:'Roboto-Light';\
          }\
          .icb-container[data-v-036d17f0]{\
            padding: 75px;\
          }\
          .brand-theme-id .icb-container[data-v-036d17f0] {\
            width: 100%;\
            justify-content: center;\
          }\
          .icb-container__wrapper[data-v-036d17f0] {\
            padding-right: 0;\
          }\
          /* AMEND CANCEL */\
          .brand-theme-id .icb-container__wrapper[data-v-036d17f0]:last-child {\
            border-top: none;\
          }\
          @media screen and (max-width: 1024px) {\
            .icb-header, .icb-form__container.icb-form__container--login{\
              width: 90% !important;\
            }\
            .brand-theme-id .icb-container__wrapper[data-v-036d17f0] {\
              border-bottom: none;\
            }\
          }\
          \
          "
        }
      </style>

      <div
        id="booking-ref-app"
        data-brand="ID"
        data-country="FR"
        data-locale="fr_FR"
      ></div>
    </>
  );
}
