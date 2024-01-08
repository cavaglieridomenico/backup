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

      {/*  <style>
          {
            '\
          .slick-initialized{\
              width: inherit !important;\
            }\
          .slick-list{\
              padding:0 !important\
          }\
          .slick-initialized{\
              display:flex;\
          }\
          .slick-cloned{\
              margin-right: 24px !important;\
              width: 1281px !important;\
          }\
          .slick-active{\
              width: 1297px !important;\
              margin-right: 12.361vw!important;\
          }\
          .slick-current{\
              width: 43.229vw !important;\
            }\
          '
          }
        </style>
      */}

      <Slider {...settings}>
        <div className={handles.homeSlider__imageContainer}>
          <div className={handles.homeSlider__itemContainer}>
            <div className={handles.homeSlider__item}>
              <div className={handles.homeSlider__imageContainer}>
                <span className={handles.homeSlider__image1}></span>
              </div>

              <div className={handles.homeSlider__descriptionContainer}>
                <p className={handles.homeSlider__title}>
                  Expert of <br /> real families
                </p>
                <p className={handles.homeSlider__paragraph}>
                  A sixty-year long expertise, which has made <br />
                  Indesit familiar across generations and a <br />
                  <b style={{ fontWeight: "bold" }}>
                    reliable partner of real families,
                  </b>{" "}
                  always up <br />
                  with the times.
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
                  Togetherness <br /> makes all <br /> beautiful
                </p>
                <p className={handles.homeSlider__paragraph}>
                  Pratici e affidabili: i nostri prodotti sono <br />
                  <b style={{ fontWeight: "bold" }}>facili da usare</b> per
                  aiutare le famiglie <br />
                  ad affrontare la vita di tutti i giorni.
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
                  Tutto pronto in <br />
                  un solo gesto
                </p>
                <p className={handles.homeSlider__paragraph}>
                  Grazie alle{" "}
                  <b style={{ fontWeight: "bold" }}>
                    tecnologie Push&Go and Turn&Go <br /> Indesit
                  </b>{" "}
                  puoi gestire le
                  <br />
                  faccende in un solo gesto, in <br />
                  tutta tranquillità.
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
                  Cucina in modo <br /> divertente in famiglia
                </p>
                <p className={handles.homeSlider__paragraph}>
                  Con i forni{" "}
                  <b style={{ fontWeight: "bold" }}>Indesit Turn&Go</b> <br />
                  che semplificano la tua cucina quotidiana.
                </p>
                <ButtonPrimary
                  text={"Odkryj więcej"}
                  href={"/produkty/gotowanie/kuchenki"}
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
