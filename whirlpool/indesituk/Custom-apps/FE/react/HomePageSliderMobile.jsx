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
  "homeSliderMobile__image5",
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
                  Indesit – always <br /> here for you
                </p>
                <p
                  style={{ marginBottom: "40px" }}
                  className={handles.homeSliderMobile__paragraph}
                >
                  Trusted by generation after generation, Indesit is a partner
                  you can always rely on.
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
                  Products you can <br /> trust
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  Pratical and trustworthy: our products are <br />
                  so <b style={{ fontWeight: "bold" }}>easy to use</b> that
                  everyone can collaborate, <br />
                  to help modern real families cope with <br />
                  everyday life.
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
                  Be ready in just <br /> one gesture
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  Thanks to{" "}
                  <b style={{ fontWeight: "bold" }}>
                    Push&Go and Turn&Go Indesit <br />
                    technologies{" "}
                  </b>
                  you can manage daily <br />
                  household chores in only 1 action, with <br />
                  complete peace of mind.
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
                  Cooking made <br /> fun for families
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  With the new{" "}
                  <b style={{ fontWeight: "bold" }}>
                    Indesit Turn&Go Aria ovens
                  </b>{" "}
                  <br />
                  that simplify your daily cooking.
                </p>
                <ButtonPrimary
                  href={"/products/cooking/ovens"}
                  text={"Discover More"}
                  width={"209px"}
                  hasTargetBlank={false}
                />
              </div>
            </div>
          </div>
        </div>
        {/* ------------------------------ */}
        {/* //remove banner ended promo SCTASK0831954 */}
        <div className={handles.homeSliderMobile__imageContainer}>
          <div className={handles.homeSliderMobile__itemContainer}>
            <div className={handles.homeSliderMobile__item}>
              <div className={handles.homeSliderMobile__imageContainer}>
                <span className={handles.homeSliderMobile__image5}></span>
              </div>

              <div className={handles.homeSliderMobile__descriptionContainer}>
                <p className={handles.homeSliderMobile__title}>
                    Indesit & Ariel
                </p>
                <p className={handles.homeSliderMobile__paragraph}>
                  Claim 4 months free Ariel with selected laundry appliance purchases.
                </p>
                <ButtonPrimary
                  href={"/free-ariel"}
                  text={"Shop Range & Claim Now"}
                  width={"225px"}
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
