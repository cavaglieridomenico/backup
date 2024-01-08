import React, { useEffect } from "react";

export default function EmbeddedTroubleShooting() {
  useEffect(() => {
    getTroubleShootingData();
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
        .wia-issue-container:hover, .wia-issue-container.selected{\
          background: #007d69 !important;\
        }\
        .wia-issue-container__static:hover {\
          background: transparent !important;\
        }\
        .wia-label__back:hover {\
          color: #007d69 !important;\
        }\
        .wia-form__button[data-v-f62eb730], .wia-form__button[data-v-f62eb730]:hover {\
          background: #007d69 !important;\
          border-color: #007d69 !important;\
        }\
        .wia-container *, .wia-label, .wia-label__back {\
          font-family: 'myriadLight' !important;\
        }\
        .wia-title {\
          font-family: 'myriadBold' !important;\
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
      <div
        id="booking-ref-app"
        data-brand="BK"
        data-country="DE"
        data-locale="de_DE"
        data-language="DE"
        data-platform="wia-vtex"
      ></div>
    </>
  );
}
