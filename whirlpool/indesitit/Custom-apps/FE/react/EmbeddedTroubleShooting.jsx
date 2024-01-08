import React, { useEffect } from "react";

export default function EmbeddedTroubleShooting() {

  useEffect(() => {
    getTroubleShootingData()
  }, []);

  function getTroubleShootingData() {
    //Check if icb.prod script exist and remove it in order to prevent EasyService form shown in troubleshooting page
    let srcIcbScript = "//icb.prod.wpsandwatch.com/static/bootstrap.js";
    let icbScript = document?.querySelectorAll(
      `script[src="${srcIcbScript}"]`
    )[0];
    if (icbScript) {
      icbScript.parentNode?.removeChild(icbScript);
    }
    //Create and add troubleshooting script
      const script = document.createElement("script");
      script.id = "booking-ref-bootstrap";
      script.src = "//wia.prod.wpsandwatch.com/static/bootstrap.js";
      script.type = "text/javascript";
      document.body.appendChild(script);
  }

  return (
    <>
    <style>
      {
        "\
        .wia-container {\
          padding: 16px !important;\
          background: #ffffff;\
        }\
        .brand-theme-id[data-v-697edc82] {\
          background: #f9f9f9 !important;\
          margin: auto;\
          padding: 64px 0 !important;\
        }\
        .container.page{\
          width: 870px;\
          margin: 0 auto;\
        }\
        @media screen and (max-width: 756px) {\
          .container.page {\
            width: unset;\
          }\
          .brand-theme-id[data-v-697edc82] {\
            padding: 32px 16px 128px !important;\
          }\
          .wia-title[data-v-69978a3e] {\
            line-height: 48px;\
          }\
        }\
        .wia-title, .wia-label, a[data-v-69978a3e] {\
          font-family: 'Roboto-Light';\
          font-weight: 300;\
        }\
        .wia-label__back {\
          font-family: 'Roboto-Light'\
        }\
        .wia-label__strong {\
          font-family: 'Roboto-Medium'\
        }\
        .wia-container__btn {\
          font-family: 'Roboto-Light'\
        }\
        .wia-issue {\
          font-family: 'Roboto-Light'\
        }\
        .wia-label__selected {\
          font-family: 'Roboto-Light'\
        }\
        .wia-title__underline {\
          font-family: 'Roboto-Medium'\
        }\
        .wia-result__title {\
          font-family: 'Roboto'\
        }\
        .wia-result__description {\
          font-family: 'Roboto'\
        }\
        .wia-smile-icon-container {\
          font-family: 'Roboto'\
        }\
        .wia-autocomplete-description {\
          font-family: 'Roboto'\
        }\
        .btn.wia-form__button.button.btn.btn-primary {\
          width: 90px;\
          height: 45px;\
          font-family: 'Roboto-Light';\
          padding: 0;\
        }\
        a[data-v-69978a3e] {\
          color: #0090d0;\
          font-size: 15px;\
          text-decoration: none;\
        }\
        \
        "
      }
    </style>
    <div id="booking-ref-app" 
      data-brand="ID" 
      data-country="IT" 
      data-locale="it_IT"
      data-language="IT"
      data-platform="wia-vtex"
    ></div>
    </>
  );
}