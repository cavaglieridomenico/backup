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
            margin: 0 0px !important\
          }\
          .slick-dots li button:before{\
            font-size: 8px;\
            color: #0090D0;\
            opacity: 1;\
          }\
          .slick-dots li.slick-active button:before{\
            width: 16px !important;\
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
                  Indesit - toujours <br />
                  là pour vous
                </p>
                <p
                  style={{ marginBottom: "40px" }}
                  className={handles.homeSliderMobile__paragraph}
                >
                  Reconnu de génération en génération, Indesit est un partenaire
                  sur lequel vous pouvez toujours compter.
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
                  Des produits de <br />
                  confiance
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  <b style={{ fontWeight: "bold" }}>Pratiques et fiables:</b>{" "}
                  nos produits sont si{" "}
                  <b style={{ fontWeight: "bold" }}>simple à utiliser</b> qu'ils
                  vous simplifient le quotidien.
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
                  Soyez prêt en un <br />
                  seul geste
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  Grâce aux
                  <b style={{ fontWeight: "bold" }}>
                    {" "}
                    technologies Indesit Push&Go et Turn&Go,
                  </b>{" "}
                  vous pouvez gérer au quotidien les tâches ménagères d'un seul
                  geste et en toute sérénité.
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
                  De beaux moments à cuisiner en famille
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  Avec les fours Indesit Turn&Go Aria qui vous simplifient la
                  cuisine au quotidien.
                </p>
                <ButtonPrimary
                  href={"/produits/cuisson/fours"}
                  text={"Découvrir plus"}
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
