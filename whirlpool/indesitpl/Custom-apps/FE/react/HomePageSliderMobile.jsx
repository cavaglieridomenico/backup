/* eslint-disable */
/* eslint-disable prefer-destructuring */
/* eslint-disable vtex/prefer-early-return */
import React from "react";
import Slider from "react-slick";
import { useCssHandles } from "vtex.css-handles";
import ButtonPrimary from "./ButtonPrimary";

const CSS_HANDLES = [
  "homeSliderMobile__imageContainer",
  "homeSliderMobile__itemContainer",
  "homeSliderMobile__item",
  "homeSliderMobile__imageContainer",
  "homeSliderMobile__image1",
  "homeSliderMobile__image2",
  "homeSliderMobile__image3",
  "homeSliderMobile__image4",
  "homeSliderMobile__descriptionContainer",
  "homeSliderMobile__title",
  "homeSliderMobile__paragraph",
  "homeSliderMobile__button",
  "homeSliderMobile__discoverMore",
];

export default function HomePageSliderMobile({ classes }) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });
  const settings = {
    fade: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
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

      {
        <style>
          {
            '\
          .slick-slider{\
            background:#F8FBFD; !important\
          }\
          .ot-floating-button__front {\
            display: none;\
          }\
          .slick-track{\
            height:540px; !important\
          }\
          .slick-dots {\
            position:unset !important\
          }\
          .slick-dots li {\
            margin: 0 0px !important;\
            width: 18px;\
            height: 18px;\
          }\
          .slick-dots li button:before{\
            font-size: 8px;\
            color: #0090D0;\
            opacity: 1;\
          }\
          .slick-dots li.slick-active button:before{\
            width: 18px !important;\
            height: 8px!important;\
            background: #005C92 !important;\
            opacity: 1 !important;\
            display: block;\
            content: " " !important;\
            top: 5px;\
            left: 1px;\
            border-radius: 13px;\
          }\
          '
          }
        </style>
      }
      <Slider {...settings}>
        <div className={handles.homeSliderMobile__imageContainer}>
          <div className={handles.homeSliderMobile__itemContainer}>
            <div className={handles.homeSliderMobile__item}>
              <div className={handles.homeSliderMobile__imageContainer}>
                <span className={handles.homeSliderMobile__image1}></span>
              </div>

              <div className={handles.homeSliderMobile__descriptionContainer}>
                <p className={handles.homeSliderMobile__title}>
                  Indesit - jesteśmy <br />
                  tu dla Ciebie
                </p>
                <p
                  style={{ marginBottom: "40px" }}
                  className={handles.homeSliderMobile__paragraph}
                >
                  Zaufało nam już kilka pokoleń, Indesit to marka warta
                  zaufania.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* ------------------------------ */}
        <div className={handles.homeSliderMobile__imageContainer}>
          <div className={handles.homeSliderMobile__itemContainer}>
            <div className={handles.homeSliderMobile__item}>
              <div className={handles.homeSliderMobile__imageContainer}>
                <span className={handles.homeSliderMobile__image2}></span>
              </div>

              <div className={handles.homeSliderMobile__descriptionContainer}>
                <p className={handles.homeSliderMobile__title}>
                  Produkty, którym
                  <br /> możesz zaufać
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  Nasze produkty są praktyczne, godne zaufania i łatwe w użyciu.
                  Wspierają w życiu codziennym każdego dnia.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* ------------------------------ */}
        <div className={handles.homeSliderMobile__imageContainer}>
          <div className={handles.homeSliderMobile__itemContainer}>
            <div className={handles.homeSliderMobile__item}>
              <div className={handles.homeSliderMobile__imageContainer}>
                <span className={handles.homeSliderMobile__image3}></span>
              </div>

              <div className={handles.homeSliderMobile__descriptionContainer}>
                <p className={handles.homeSliderMobile__title}>
                  Bądź gotowy w <br />
                  mgnieniu oka
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  Dzięki{" "}
                  <b style={{ fontWeight: "bold" }}>
                    technologiom Indesit Push&Go oraz Turn&Go
                  </b>{" "}
                  wystarczy jeden ruch, żeby każdego dnia w spokoju zarządzać
                  pracami domowymi.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* ------------------------------ */}
        <div className={handles.homeSliderMobile__imageContainer}>
          <div className={handles.homeSliderMobile__itemContainer}>
            <div className={handles.homeSliderMobile__item}>
              <div className={handles.homeSliderMobile__imageContainer}>
                <span className={handles.homeSliderMobile__image4}></span>
              </div>

              <div className={handles.homeSliderMobile__descriptionContainer}>
                <p className={handles.homeSliderMobile__title}>
                  Gotowanie stanie się rodzinną zabawą
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
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
      </Slider>
    </>
  );
}
