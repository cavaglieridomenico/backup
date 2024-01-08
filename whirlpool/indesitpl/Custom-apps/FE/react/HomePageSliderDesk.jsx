import React from "react";
import { Carousel } from "react-responsive-carousel";
import { useCssHandles } from "vtex.css-handles";
import ButtonPrimary from "./ButtonPrimary";

const CSS_HANDLES = [
  "homeSlider__imageContainer",
  "homeSlider__itemContainer",
  "homeSlider__item",
  "homeSlider__imageContainer",
  "homeSlider__image1",
  "homeSlider__image2",
  "homeSlider__image3",
  "homeSlider__image4",
  "homeSlider__descriptionContainer",
  "homeSlider__title",
  "homeSlider__paragraph",
  "homeSlider__button",
  "homeSlider__navigationContainer",
  "homeSlider__leftArrow",
  "homeSlider__rightArrow",
  "homeSlider__leftArrowContainer",
  "homeSlider__rightArrowContainer",
  "homeSlider__discoverMore",
];

export default function HomePageSliderDesk({ classes }) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  const carouselProps = {
    showDots: false,
    centerMode: false,
    autoPlay: false,
    dynamicHeight: false,
    emulateTouch: true,
    infiniteLoop: true,
    showArrows: true,
    showIndicators: false,
    showStatus: false,
    showThumbs: false,
    stopOnHover: true,
    swipeable: true,
    useKeyboardArrows: false,
    animationHandler: "fade",
    renderArrowNext: (onClickHandler) => {
      return (
        <div className={handles.homeSlider__leftArrowContainer}>
          <a
            className={handles.homeSlider__leftArrow}
            onClick={onClickHandler}
          ></a>
        </div>
      );
    },
    renderArrowPrev: (onClickHandler) => {
      return (
        <div className={handles.homeSlider__rightArrowContainer}>
          <a
            className={handles.homeSlider__rightArrow}
            onClick={onClickHandler}
          ></a>
        </div>
      );
    },
  };

  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        charset="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />

      <style>
        {
          '\
          .carousel .control-next.control-arrow, .carousel .control-next.control-arrow:hover{\
            background-color: transparent;\
            border:none;\
            right: -146px;\
          }\
          .carousel .control-prev.control-arrow, .carousel .control-prev.control-arrow:hover {\
            background-color: transparent;\
            left: -146px;\
          }\
          .carousel .control-arrow, .carousel.carousel-slider .control-arrow{\
            opacity: 1;\
          }\
          .carousel .control-next.control-arrow:before {\
            content: " ";\
            border: solid #0135AD;\
            border-width: 0 8px 8px 0;\
            display: inline-block;\
            padding: 14px;\
            transform: rotate(-45deg);\
          }\
          .carousel .control-prev.control-arrow:before {\
            content: " ";\
            border: solid #0135AD;\
            border-width: 0 8px 8px 0;\
            display: inline-block;\
            padding: 14px;\
            transform: rotate(135deg);\
            -webkit-transform: rotate(135deg);\
          }\
          .slide{\
            margin: 0 !important;\
          }\
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
            display: flex;\
            margin-left: -4.931vw; }\
          .carousel .slider-wrapper.axis-horizontal .slider .slide {\
            flex-direction: column;\
            flex-flow: column; }\
          .carousel .slider {\
            margin: 0;\
            padding-left: 0 !important;\
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
          .control-dots{\
            display:none\
          }\
          .carousel .control-dots .dot{\
            font-size: 8px;\
            background: #0090D0 !important;\
            opacity: 1;\
            box-shadow: unset !important;\
            cursor: pointer !important;\
          }\
          .carousel .control-dots .dot.selected{\
            width: 21px !important;\
            height: 8px!important;\
            background: #005C92 !important;\
            opacity: 1 !important;\
            top: 5px;\
            border-radius: 13px;\
          }\
      \
    '
        }
      </style>

      <Carousel {...carouselProps} animationHandler="fade">
        <div className={handles.homeSlider__imageContainer}>
          <div className={handles.homeSlider__itemContainer}>
            <div className={handles.homeSlider__item}>
              <div className={handles.homeSlider__imageContainer}>
                <span className={handles.homeSlider__image1}></span>
              </div>

              <div className={handles.homeSlider__descriptionContainer}>
                <p className={handles.homeSlider__title}>
                  Indesit - jesteśmy
                  <br />
                  tu dla Ciebie
                </p>
                <p className={handles.homeSlider__paragraph}>
                  Zaufało nam już kilka pokoleń, Indesit to marka warta
                  zaufania.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* ------------------------------ */}
        <div className={handles.homeSlider__imageContainer}>
          <div className={handles.homeSlider__itemContainer}>
            <div className={handles.homeSlider__item}>
              <div className={handles.homeSlider__imageContainer}>
                <span className={handles.homeSlider__image2}></span>
              </div>

              <div className={handles.homeSlider__descriptionContainer}>
                <p className={handles.homeSlider__title}>
                  Produkty, którym <br />
                  możesz zaufać
                </p>
                <p className={handles.homeSlider__paragraph}>
                  Nasze produkty są praktyczne, <br />
                  godne zaufania i łatwe w użyciu. <br />
                  Wspierają w życiu codziennym każdego dnia.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* ------------------------------ */}
        <div className={handles.homeSlider__imageContainer}>
          <div className={handles.homeSlider__itemContainer}>
            <div className={handles.homeSlider__item}>
              <div className={handles.homeSlider__imageContainer}>
                <span className={handles.homeSlider__image3}></span>
              </div>

              <div className={handles.homeSlider__descriptionContainer}>
                <p className={handles.homeSlider__title}>
                  Bądź gotowy w <br />
                  mgnieniu oka
                </p>
                <p className={handles.homeSlider__paragraph}>
                  Dzięki{" "}
                  <b style={{ fontFamily: "Roboto" }}>
                    {" "}
                    technologiom Indesit
                    <br />
                    Push&Go oraz Turn&Go{" "}
                  </b>
                  wystarczy <br />
                  jeden ruch, żeby każdego dnia w spokoju <br />
                  zarządzać pracami domowymi.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* ------------------------------ */}
        <div className={handles.homeSlider__imageContainer}>
          <div className={handles.homeSlider__itemContainer}>
            <div className={handles.homeSlider__item}>
              <div className={handles.homeSlider__imageContainer}>
                <span className={handles.homeSlider__image4}></span>
              </div>

              <div className={handles.homeSlider__descriptionContainer}>
                <p className={handles.homeSlider__title}>
                  Gotowanie stanie się rodzinną zabawą
                </p>
                <p className={handles.homeSlider__paragraph}>
                  Z piekarnikami Turn&Go Aria, gotujesz łatwiej każdego dnia
                </p>
                <ButtonPrimary
                  text={"Odkryj więcej"}
                  href={"/produkty/gotowanie/piekarniki"}
                  width={"209px"}
                  hasTargetBlank={false}
                />
              </div>
            </div>
          </div>
        </div>
      </Carousel>
    </>
  );
}
