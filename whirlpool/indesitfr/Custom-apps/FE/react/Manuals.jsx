import React, { useEffect } from "react";

export default function Manuals() {
  useEffect(() => {
    getManualsData();
  }, []);

  useEffect(() => {
    let timeout = setTimeout(() => {
      let input = document.querySelectorAll(".docs-m-container-module__input");
      input[0]["placeholder"] = "Entrez votre code commercial";
      clearInterval(timeout);
    }, 1000);
  }, []);

  function getManualsData() {
    const script = document.createElement("script");
    script.id = "docs-bootstrap";
    script.src = "https://wpeu.docs.staging.wpsandwatch.com/js/bootstrap.js";
    script.type = "text/javascript";
    document.body.appendChild(script);
  }

  return (
    <>
      <style>
        {
          "\
          .docs-m-container{\
            background: transparent;\
          }\
          .docs-m-container-module__bar {\
            display: none;\
          }\
          .docs-m-container-module__bar.docs-m-container-module__search-bar {\
            display: none;\
            margin: 0;\
          }\
          #docs-container {\
            background: transparent;\
          }\
          .docs-m-container-module {\
            padding: 0;\
          }\
          .docs-m-container-module__search {\
            width: 100%;\
            background: transparent;\
            position: relative;\
            padding: 0;\
            display: flex;\
            flex-direction: column;\
            align-items: center;\
            border: none;\
            flex-wrap: nowrap !important;\
          }\
          .docs-m-container-module__input {\
            padding: 0 32px;\
            background: #ffffff;\
            border-radius: 16px;\
            border: none;\
            height: 54px;\
            width: 540px;\
            color: #0090d0;\
            font-family: 'Roboto-Light';\
            margin: 32px 0 0;\
          }\
          @media screen and (max-width: 756px) {\
            .docs-m-container-module-input {\
              width: 232px;\
            }\
            .docs-m-container-module__input {\
              width: 230px;\
            }\
            .docs-m-container-module__search-lens {\
              top: 26px !important;\
              left: -19px !important;\
            }\
            .docs-m-container-module__search::before {\
              left: 22px !important;\
            }\
          }\
          .docs-m-container-module__input::placeholder {\
            font-family: 'Roboto-Light';\
            font-size: 14px;\
            line-height: 16px;\
            color: rgba(0, 144, 208, 0.6);\
            position: relative;\
          }\
          .docs-m-container-module__search::before {\
            content: '';\
            position: absolute;\
            visibility: visible;\
            top: 48px;\
            left: -90px;\
            height: 20px;\
            width: 1px;\
            background: rgba(0, 144, 208, 0.6);\
          }\
          .docs-m-container-module__search-lens {\
            height: 44px;\
            width: 44px;\
            border-radius: 16px;\
            border: 1px solid #f0f0f5;\
            left: 94px;\
            top: 26px;\
            position: relative;\
          }\
          .docs-m-container-module__search-lens:before{\
            top: 9px;\
            left: 9px;\
            width: 16px;\
            height: 16px;\
          }\
          .docs-m-container-module__search-lens:after{\
            top: 26px;\
            left: 28px;\
            transform: rotate(43deg);\
            width: 4px;\
          }\
          .docs-m-autocomplete-module__results {\
            height: fit-content;\
            padding: 10px;\
          }\
          .docs-m-autocomplete-module__results--empty {\
            font-size: 14px;\
            font-family: 'Roboto-Light';\
            color: #43525a;\
          }\
          .docs-m-container-module__search-count {\
            margin: 0;\
          }\
          .docs-m-page-loader__loader::before, .docs-m-page-loader__loader::after{\
            top: 3px;\
            left: -15px;\
          }\
        \
        "
        }
      </style>
      <div
        id="docs-manual"
        data-language="fr"
        data-brand="ID"
        data-event-name="clickProductCodeManual"
      ></div>
    </>
  );
}
