import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { useCssHandles } from "vtex.css-handles";
import PhoneSupportModalMobile from "./PhoneSupportModalMobile";
import ButtonAssistenza from "./ButtonAssistenza";

const CSS_HANDLES = [
  "contactUsCarousel__cardContainer",
  "contactUsCarousel__titleContainer",
  "contactUsCarousel__title",
  "contactUsCarousel__descContainer",
  "contactUsCarousel__description",
  "contactUsCarousel__descriptionAnchor",
  "contactUsCarousel__buttonContainer",
  "contactUsCarousel__buttonText",
  // "contactUsCarousel__augustDisclaimerTextContainer",
  // "contactUsCarousel__augustDisclaimerText",
  // "contactUsCarousel__augustDisclaimerDescriptionContainer",
  // "contactUsCarousel__augustDisclaimerDescription",
  "ButtonAssistenza__buttonWrapper",
  "ButtonAssistenza__buttonAnchorSecondary",
];

const ContactUsCarouselMobile = ({}) => {
  const carouselProps = {
    centerMode: false,
    autoPlay: false,
    dynamicHeight: false,
    emulateTouch: true,
    infiniteLoop: false,
    showArrows: false,
    showIndicators: true,
    showStatus: false,
    showThumbs: false,
    stopOnHover: false,
    swipeable: true,
    useKeyboardArrows: false,
  };

  const { handles } = useCssHandles(CSS_HANDLES);

  const [openModalSpecial, setOpenModalSpecial] = useState(false);

  return (
    <>
      <style>
        {
          '\
                        .carousel.carousel-slider{\
                            display:flex;\
                            flex-direction:column-reverse;\
                        }\
                        .carousel .control-arrow, .carousel.carousel-slider .control-arrow {\
                          -webkit-transition: all 0.25s ease-in;\
                          -moz-transition: all 0.25s ease-in;\
                          -ms-transition: all 0.25s ease-in;\
                          -o-transition: all 0.25s ease-in;\
                          transition: all 0.25s ease-in;\
                          cursor: pointer; }\
                          .carousel .control-arrow:focus, .carousel .control-arrow:hover {\
                            opacity: 1;\
                            filter: alpha(opacity=100); }\
                          .carousel .control-arrow:before, .carousel.carousel-slider .control-arrow:before {\
                            margin: 0 5px;\
                            display: inline-block;\
                            border-top: 8px solid transparent;\
                            border-bottom: 8px solid transparent;\
                            content: "";\
                            }\
                          .carousel .control-disabled.control-arrow {\
                            opacity: 0;\
                            filter: alpha(opacity=0);\
                            cursor: inherit;\
                            display: none; }\
                          .carousel .control-prev.control-arrow {\
                            left: 0; }\
                            .carousel .control-prev.control-arrow:before {\
                              border-right: 8px solid #fff; }\
                          .carousel .control-next.control-arrow {\
                            right: 0; }\
                            .carousel .control-next.control-arrow:before {\
                              border-left: 8px solid #fff; }\
                        .carousel-root {\
                          outline: none; }\
                        .carousel {\
                          position: relative;\
                          width: 100%; }\
                          .carousel * {\
                            -webkit-box-sizing: border-box;\
                            -moz-box-sizing: border-box;\
                            box-sizing: border-box; }\
                          .carousel img {\
                            width: 100%;\
                            display: inline-block;\
                            pointer-events: none; }\
                          .carousel .carousel {\
                            position: relative; }\
                          .carousel .control-arrow {\
                            outline: 0;\
                            border: 0;\
                            background: none;\
                            top: 50%;\
                            margin-top: -13px;\
                            font-size: 18px; }\
                          .carousel .thumbs-wrapper {\
                            margin: 20px;\
                            overflow: hidden; }\
                          .carousel .thumbs {\
                            -webkit-transition: all 0.15s ease-in;\
                            -moz-transition: all 0.15s ease-in;\
                            -ms-transition: all 0.15s ease-in;\
                            -o-transition: all 0.15s ease-in;\
                            transition: all 0.15s ease-in;\
                            -webkit-transform: translate3d(0, 0, 0);\
                            -moz-transform: translate3d(0, 0, 0);\
                            -ms-transform: translate3d(0, 0, 0);\
                            -o-transform: translate3d(0, 0, 0);\
                            transform: translate3d(0, 0, 0);\
                            position: relative;\
                            list-style: none;\
                            white-space: nowrap; }\
                          .carousel .thumb {\
                            -webkit-transition: border 0.15s ease-in;\
                            -moz-transition: border 0.15s ease-in;\
                            -ms-transition: border 0.15s ease-in;\
                            -o-transition: border 0.15s ease-in;\
                            transition: border 0.15s ease-in;\
                            display: inline-block;\
                            margin-right: 6px;\
                            white-space: nowrap;\
                            overflow: hidden;\
                            border: 3px solid #fff;\
                            padding: 2px; }\
                            .carousel .thumb:focus {\
                              border: 3px solid #ccc;\
                              outline: none; }\
                            .carousel .thumb.selected, .carousel .thumb:hover {\
                              border: 3px solid #333; }\
                            .carousel .thumb img {\
                              vertical-align: top; }\
                          .carousel.carousel-slider {\
                            position: relative;\
                            margin: 0;\
                            overflow: hidden; }\
                            .carousel.carousel-slider .control-arrow {\
                              top: 0;\
                              color: #fff;\
                              font-size: 26px;\
                              bottom: 0;\
                              margin-top: 0;\
                              padding: 5px; }\
                              .carousel.carousel-slider .control-arrow:hover {\
                                background: rgba(0, 0, 0, 0.2); }\
                          .carousel .slider-wrapper {\
                            overflow: hidden;\
                            margin: auto;\
                            width: 100%;\
                            -webkit-transition: height 0.15s ease-in;\
                            -moz-transition: height 0.15s ease-in;\
                            -ms-transition: height 0.15s ease-in;\
                            -o-transition: height 0.15s ease-in;\
                            transition: height 0.15s ease-in; }\
                            .carousel .slider-wrapper.axis-horizontal .slider {\
                              -ms-box-orient: horizontal;\
                              display: -webkit-box;\
                              display: -moz-box;\
                              display: -ms-flexbox;\
                              display: -moz-flex;\
                              display: -webkit-flex;\
                              display: flex; }\
                              .carousel .slider-wrapper.axis-horizontal .slider .slide {\
                                flex-direction: column;\
                                flex-flow: column; }\
                            .carousel .slider-wrapper.axis-vertical {\
                              -ms-box-orient: horizontal;\
                              display: -webkit-box;\
                              display: -moz-box;\
                              display: -ms-flexbox;\
                              display: -moz-flex;\
                              display: -webkit-flex;\
                              display: flex; }\
                              .carousel .slider-wrapper.axis-vertical .slider {\
                                -webkit-flex-direction: column;\
                                flex-direction: column; }\
                          .carousel .slider {\
                            margin: 0;\
                            padding: 0;\
                            position: relative;\
                            list-style: none;\
                            width: 100%; }\
                            .carousel .slider.animated {\
                              -webkit-transition: all 0.35s ease-in-out;\
                              -moz-transition: all 0.35s ease-in-out;\
                              -ms-transition: all 0.35s ease-in-out;\
                              -o-transition: all 0.35s ease-in-out;\
                              transition: all 0.35s ease-in-out; }\
                          .carousel .slide {\
                            min-width: 100%;\
                            margin: 0;\
                            position: relative;\
                            text-align: center; }\
                            .carousel .slide img {\
                              width: 100%;\
                              vertical-align: top;\
                              border: 0; }\
                            .carousel .slide iframe {\
                              display: inline-block;\
                              width: calc(100% - 80px);\
                              margin: 0 40px 40px;\
                              border: 0; }\
                            .carousel .slide .legend {\
                              -webkit-transition: all 0.5s ease-in-out;\
                              -moz-transition: all 0.5s ease-in-out;\
                              -ms-transition: all 0.5s ease-in-out;\
                              -o-transition: all 0.5s ease-in-out;\
                              transition: all 0.5s ease-in-out;\
                              position: absolute;\
                              bottom: 40px;\
                              left: 50%;\
                              margin-left: -45%;\
                              width: 90%;\
                              border-radius: 10px;\
                              background: #000;\
                              color: #fff;\
                              padding: 10px;\
                              font-size: 12px;\
                              text-align: center;\
                              opacity: 0.25;\
                              -webkit-transition: opacity 0.35s ease-in-out;\
                              -moz-transition: opacity 0.35s ease-in-out;\
                              -ms-transition: opacity 0.35s ease-in-out;\
                              -o-transition: opacity 0.35s ease-in-out;\
                              transition: opacity 0.35s ease-in-out; }\
                          .carousel .control-dots {\
                            margin: 0 0 0 0;\
                            padding: 0;\
                            text-align: center;\
                            width: 100%;\
                            z-index: 1; }\
                          .carousel .control-dots .dot {\
                            margin: 0 4px;\
                          }\
                            @media (min-width: 960px) {\
                              .carousel .control-dots {\
                                bottom: 0; } }\
                            .carousel .control-dots .dot {\
                              -webkit-transition: opacity 0.25s ease-in;\
                              -moz-transition: opacity 0.25s ease-in;\
                              -ms-transition: opacity 0.25s ease-in;\
                              -o-transition: opacity 0.25s ease-in;\
                              transition: opacity 0.25s ease-in;\
                              opacity: 0.3;\
                              filter: alpha(opacity=30);\
                              box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);\
                              background: #fff;\
                              border-radius: 50%;\
                              width: 7px;\
                              height: 7px;\
                              cursor: pointer;\
                              display: inline-block;\
                              margin: 0 px; }\
                              .carousel .control-dots .dot.selected, .carousel .control-dots .dot:hover {\
                                opacity: 1;\
                                filter: alpha(opacity=100); }\
                          .carousel .carousel-status {\
                            position: absolute;\
                            top: 0;\
                            right: 0;\
                            padding: 5px;\
                            font-size: 10px;\
                            text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.9);\
                            color: #fff; }\
                          .carousel:hover .slide .legend {\
                            opacity: 1; }\
                            .card-container-carousel{\
                              display: flex;\
                              justify-content: center;\
                              align-items: center;\
                              margin-bottom: 62px;\
                              height: 278px;\
                              text-align: start !important;\
                            }\
                            .selected .card-container-carousel .indesititqaqa-custom-apps-0-x-productCardCarousel__container{\
                              width: 603px !important;\
                              height: 278px !important;\
                            }\
                            .carousel .control-dots .dot{\
                              font-size: 8px;\
                              background: #0090D0 !important;\
                              opacity: 1;\
                              box-shadow: unset !important;\
                              cursor: pointer !important;\
                            }\
                            .carousel .control-dots .dot.selected{\
                              width: 16px !important;\
                              height: 7px!important;\
                              background: #005C92 !important;\
                              opacity: 1 !important;\
                              top: 5px;\
                              border-radius: 13px;\
                            }\
                            @media screen and (max-width: 1024px){\
                              .selected .card-container-carousel .indesititqaqa-custom-apps-0-x-productCardCarousel__container{\
                                width: 260px !important;\
                                height: 121px !important;\
                              }\
                              .card-container-carousel{\
                                height: 130px;\
                              }\
                            }\
                  \
                '
        }
      </style>

      <Carousel {...carouselProps}>
        {/* PHONE SUPPORT */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <div className={handles.contactUsCarousel__cardContainer}>
            <div className={handles.contactUsCarousel__titleContainer}>
              <span className={handles.contactUsCarousel__title}>
                {"Assistance téléphonique"}
              </span>
            </div>
            <div className={handles.contactUsCarousel__descContainer}>
              <span className={handles.contactUsCarousel__description}>
                {/* <a
                  className={handles.contactUsCarousel__descriptionAnchor}
                  href="tel:+330969391234"
                >
                  09.69.39.1234*
                </a> */}
                <br></br>
                {"Du lundi au vendredi de 9h à 19h Samedi de 9h à 17h*"}
                <br></br>
                {"*prix d'un appel local, non surtaxé"}
              </span>
            </div>
            {/* <div className={handles.contactUsCarousel__augustDisclaimerTextContainer}>
              <span className={handles.contactUsCarousel__augustDisclaimerText}>
                {"Horaires exceptionnels"}
                <br/>
                {"Août 2023 :"}
              </span>
              <div className={handles.contactUsCarousel__augustDisclaimerDescriptionContainer}>
                <span className={handles.contactUsCarousel__augustDisclaimerDescription}>
                  {"Du lundi au vendredi de 9h à 17h"}
                  <br/>
                  {"Fermeture le samedi et le dimanche."}
                </span>
              </div>
            </div> */}
            <a
              onClick={() => {
                setOpenModalSpecial(true);
              }}
            >
              <ButtonAssistenza
                isBlank={false}
                isPrimary={false}
                text="Contactez-nous"
                gaEvent="clickContactOptions"
                menuName="Assistance téléphonique"
                labelGa="Call now"
                isGa4={true}
                typeGA4="telephone"
              />
            </a>
          </div>
        </div>
        {/* CONTACT FORM */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <div className={handles.contactUsCarousel__cardContainer}>
            <div className={handles.contactUsCarousel__titleContainer}>
              <span className={handles.contactUsCarousel__title}>
                {"Ecrivez-nous"}
              </span>
            </div>
            <div className={handles.contactUsCarousel__descContainer}>
              <span className={handles.contactUsCarousel__description}>
                {
                  "Complétez le formulaire. Un conseiller vous contactera sous 48 heures pour répondre à votre demande."
                }
              </span>
            </div>
            <ButtonAssistenza
              src="/service/service-clients"
              isBlank={false}
              isPrimary={false}
              text="Ecrivez-nous"
              gaEvent="clickContactOptions"
              menuName="Contact us"
              labelGa="Fill the form"
              isGa4={true}
              typeGA4="email"
            />
          </div>
        </div>
        {/* WHATSAPP */}
        {/* <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div className={handles.contactUsCarousel__cardContainer}>
            <div className={handles.contactUsCarousel__titleContainer}>
              <span className={handles.contactUsCarousel__title}>
                {"Whatsapp"}
              </span>
            </div>
            <div className={handles.contactUsCarousel__descContainer}>
              <span className={handles.contactUsCarousel__description}>
                {"Da lunedì a venerdì dalle 9:00 alle 18:00"}
              </span>
            </div>
            <ButtonAssistenza
              src="/assistenza/canale-whatsapp"
              isBlank={false}
              isPrimary={false}
              text="Invia Whatsapp"
              gaEvent="clickContactOptions"
              menuName="Whatsapp"
              labelGa="Send whatsapp"
            />
          </div>
        </div> */}
        {/* ONLINE CHAT */}
        {/* <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div className={handles.contactUsCarousel__cardContainer}>
            <div className={handles.contactUsCarousel__titleContainer}>
              <span className={handles.contactUsCarousel__title}>
                {"Chat online"}
              </span>
            </div>
            <div className={handles.contactUsCarousel__descContainer}>
              <span className={handles.contactUsCarousel__description}>
                {
                  "La Live Chat Indesit è disponibile dal lunedì al venerdì, dalle 9 alle 18."
                }
              </span>
            </div>
            <a
              onClick={() => {
                setOpenModalSpecial(true);
              }}
            >
              <ButtonAssistenza
                src="/assistenza/servizio-clienti#genesys-chat"
                isBlank={false}
                isPrimary={false}
                text="Chatta ora"
                labelGa="Chat now"
                menuName="Chatta ora"
                gaEvent="clickContactOptions"
              />
            </a>
          </div>
        </div> */}
      </Carousel>
      <PhoneSupportModalMobile
        isOpen={openModalSpecial}
        handleClose={() => setOpenModalSpecial(false)}
      />
    </>
  );
};

export default ContactUsCarouselMobile;
