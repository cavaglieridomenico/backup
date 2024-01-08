import React from "react";
import Slider from "react-slick";
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
  "homeSlider__image5",
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

function SampleNextArrow(props) {
  const { onClick } = props;
  const { handles } = useCssHandles(CSS_HANDLES);
  return (
    <div className={handles.homeSlider__leftArrowContainer}>
      <a className={handles.homeSlider__leftArrow} onClick={onClick}></a>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  const { handles } = useCssHandles(CSS_HANDLES);
  return (
    <div className={handles.homeSlider__rightArrowContainer}>
      <a className={handles.homeSlider__rightArrow} onClick={onClick}></a>
    </div>
  );
}

export default function HomePageSlider({ classes }) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });
  const settings = {
    centerMode: true,
    dots: false,
    fade: false,
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
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
        .slick-list{\
            padding:0 !important\
        }\
        .slick-slide.slick-active {\
            transition: 0.2s all;\
          }\
        @media screen and (min-width: 1280px) and (max-width: 1360px) {\
          .slick-slide.slick-active {\
            width: 1263px !important;\
          }\
        }\
        @media screen and (min-width: 1360px) and (max-width: 1366px) {\
          .slick-slide.slick-active {\
            width: 1343px !important;\
          }\
        }\
        @media screen and (min-width: 1366px) and (max-width: 1400px) {\
          .slick-slide.slick-active {\
            width: 1349px !important;\
          }\
        }\
        @media screen and (min-width: 1400px) and (max-width: 1440px) {\
          .slick-slide.slick-active {\
            width: 1383px !important;\
          }\
        }\
        @media screen and (min-width: 1440px) and (max-width: 1600px) {\
          .slick-slide.slick-active {\
            width: 1423px !important;\
          }\
        }\
        @media screen and (min-width: 1600px) and (max-width: 1680px) {\
          .slick-slide.slick-active {\
            width: 1583px !important;\
          }\
        }\
        @media screen and (min-width: 1680px) and (max-width: 1920px) {\
          .slick-slide.slick-active {\
            width: 1663px !important;\
          }\
        }\
        @media screen and (min-width: 1920px) {\
          .slick-slide.slick-active {\
            width: 1903px !important;\
          }\
        }\
        '
        }
      </style>

      <Slider {...settings}>
        <div className={handles.homeSlider__imageContainer}>
          <div className={handles.homeSlider__itemContainer}>
            <div className={handles.homeSlider__item}>
              <div className={handles.homeSlider__imageContainer}>
                <span className={handles.homeSlider__image1}></span>
              </div>

              <div className={handles.homeSlider__descriptionContainer}>
                <p className={handles.homeSlider__title}>
                  Indesit – always <br /> here for you
                </p>
                <p className={handles.homeSlider__paragraph}>
                  Trusted by generation after generation, Indesit is a partner
                  you can always rely on.
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
                  Products you <br /> can trust
                </p>
                <p className={handles.homeSlider__paragraph}>
                  Practical and trustworthy: our products are <br /> so{" "}
                  <b style={{ fontFamily: "Roboto" }}>easy to use</b> and help
                  modern families <br />
                  cope with everyday life.
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
                  Be ready in just <br /> one gesture
                </p>
                <p className={handles.homeSlider__paragraph}>
                  Thanks to{" "}
                  <b style={{ fontFamily: "Roboto" }}>
                    Push&Go and Turn&Go Indesit <br />
                    technologies
                  </b>{" "}
                  you can manage daily <br />
                  household chores in just one 1 move, with <br />
                  complete peace of mind.
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
                  Cooking made <br /> fun for families
                </p>
                <p className={handles.homeSlider__paragraph}>
                  With the new{" "}
                  <b style={{ fontFamily: "Roboto" }}>
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
        <div className={handles.homeSlider__imageContainer}>
          <div className={handles.homeSlider__itemContainer}>
            <div className={handles.homeSlider__item}>
              <div className={handles.homeSlider__imageContainer}>
                <span className={handles.homeSlider__image5}></span>
              </div>

              <div className={handles.homeSlider__descriptionContainer}>
                <p className={handles.homeSlider__title}>
                    Indesit & Ariel
                </p>
                <p className={handles.homeSlider__paragraph}>
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
