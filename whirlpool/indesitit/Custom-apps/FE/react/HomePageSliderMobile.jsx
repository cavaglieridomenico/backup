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
          .slick-track{\
            height:540px; !important\
          }\
          .slick-dots {\
            position:unset !important\
          }\
          .slick-dots li {\
            margin: 0 0 !important\
          }\
          .slick-dots li button:before{\
            font-size: 8px;\
            color: #0090D0;\
            opacity: 1;\
          }\
          .slick-dots li.slick-active button:before{\
            width: 21px !important;\
            height: 8px!important;\
            background: #005C92 !important;\
            opacity: 1 !important;\
            display: block;\
            content: " " !important;\
            top: 5px;\
            left: -2px;\
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
                  Indesit – sempre <br /> qui per te
                </p>
                <p
                  style={{ marginBottom: "40px" }}
                  className={handles.homeSliderMobile__paragraph}
                >
                  Scelto di generazione in generazione, Indesit è un partner su cui potrai sempre contare.
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
                  Prodotti di cui <br /> ti puoi fidare
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  Pratici ed affidabili: i nostri prodotti sono <br />
                  <b style={{ fontWeight: "bold" }}>facili da usare</b> per aiutare le
                  famiglie moderne<br /> ad affrontare la vita di tutti i giorni
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
                  Tutto pronto in <br /> un solo gesto
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  Grazie alle{" "}
                  <b style={{ fontWeight: "bold" }}>
                  tecnologie Push&Go and Turn&Go <br />
                  Indesit{" "}
                  </b>
                  puoi gestire le faccende domestiche<br /> con un solo gesto, in tutta tranquillità
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
                  Rakuten tv <br />
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  La recensione che ti premia!
                </p>
                <ButtonPrimary
                  href={"/rakuten-tv"}
                  text={"Scopri di più"}
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
