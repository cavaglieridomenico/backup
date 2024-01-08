import React, { useEffect } from "react";

export default function EmbeddedExpiredWarranty() {
  useEffect(() => {
    getEmbeddedExpiredWarrantyData();
  }, []);

  function getEmbeddedExpiredWarrantyData() {
    const script = document.createElement("script");
    const scriptWorldPay = document.createElement("script");
    const link = document.createElement("link");


    script.id = "booking-ref-bootstrap";
    script.src = "//icb.prod.wpsandwatch.com/static/bootstrap.js";
    script.type = "text/javascript";

    //script worldPay
    scriptWorldPay.src='https://payments.worldpay.com/resources/hpp/integrations/embedded/js/hpp-embedded-integration-library.js'
    // link worldPay
    link.rel='stylesheet'
    link.href='https://payments.worldpay.com/resources/hpp/integrations/embedded/css/hpp-embedded-integration-library.css'
    document.body.appendChild(script);
    document.body.appendChild(scriptWorldPay);
    document.body.appendChild(link);
  }
  
  

  return (
    <>
      <style>
        {
          "\
          .flex.flex-grow-1{\
            background: #f9f9f9;\
          }\
          .icb-form.form-login.form-horizontal.form-flex, .icb-form__title, .icb-header{\
            width: 1100px;\
            margin: 0 auto;\
            background: #ffffff;\
          }\
          .brand-theme-id{\
            background: #f9f9f9 !important;\
          }\
          .icb-header {\
            padding: 32px 0 0;\
          }\
          .icb-header__title {\
            margin: 0 0 40px;\
          }\
          @media screen and (min-width: 350px) and (max-width: 414px) {\
            .icb-form.form-login.form-horizontal.form-flex, .icb-header, .icb-form__title, .icb-form__title {\
              width: 335px;\
            }\
          }\
          @media screen and (min-width: 320px) and (max-width: 350px){\
            .icb-form.form-login.form-horizontal.form-flex, .icb-header, .icb-form__title, .icb-form__title {\
              width: 280px;\
            }\
          }\
          @media screen and (max-width: 375px) {\
            .brand-theme-id .icb-form__input input[data-v-3c93fbf8] {\
              height: 3px;\
            }\
            .icb-form__msg-container {\
              margin: 15px 0 0;\
            }\
          }\
          @media screen and (min-width: 350px) and (max-width: 375px) {\
            .icb-form__item[data-v-3c93fbf8] {\
              width: 305px;\
              margin: 16px auto 0;\
            }\
          }\
          @media screen and (min-width: 320px) and (max-width: 350px) {\
            .icb-form__item[data-v-3c93fbf8] {\
              width: 250px;\
              margin: 16px auto;\
            }\
          }\
          @media screen and (min-width: 350px) and (max-width: 375px) {\
            .icb-form__item--baseline[data-v-3c93fbf8], .icb-form__msg-container, .icb-header[data-v-3c93fbf8] {\
              width: 305px;\
              margin: 0 auto;\
            }\
          }\
          @media screen and (min-width: 320px) and (max-width: 350px) {\
            .icb-form__item--baseline[data-v-3c93fbf8], .icb-form__item[data-v-3c93fbf8], .icb-form__msg-container, .icb-header[data-v-3c93fbf8] {\
              width: 250px;\
              margin: 0 auto;\
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
        data-type="OOW"
        data-layout="l-2023"
      ></div>
    </>
  );
}
