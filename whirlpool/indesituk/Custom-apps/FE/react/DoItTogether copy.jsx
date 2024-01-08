import React, { useEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";
import Slider from "react-slick";
import { useRef, useCallback } from "react";
import ButtonPrimary from "./ButtonPrimary";
import classnames from "classnames";

const writeIndexofSlide = (index) => {
  document.getElementById("slideIndex").innerHTML = index;
};

const getIndexofSlide = (index) => {
  return parseInt(document.getElementById("slideIndex").innerHTML);
};

export default function DoItTogether() {
  const CSS_HANDLES = [
    "doItTogether__container",
    "doItTogether__pushAndGoRow",
    "doItTogether__firstStaticContainer",
    "doItTogether__imageLiveTogether",
    "doItTogether__dotsPosition",
    "doItTogether__dotsStyle",
    "doItTogether__imageContainerPushAndGo",
    "doItTogether__maxiContainer",
    "doItTogether__columnPushAndGo",
    "doItTogether__textPushAndGo",
    "doItTogether__blankText",
    "doItTogether__textPushAndGoHidden",
    "doItTogether__textAppliances",
    "doItTogether__textAppliancesHidden",
    "doItTogether__textAppliancesContainer",
    "doItTogether__videoImageBoy",
    "doItTogether__videoImageBoyEmpty",
    "doItTogether__maxiContainerHidden",
    "doItTogether__pushAndGoRowHidden",
    "doItTogether__pushAndGoRowBlockTransition",
    "doItTogether__pushAndGoRowBlockTransitionHidden",
    "doItTogether__videoImageBoyAndGirl",
    "doItTogether__videoImagePan",
    "doItTogether__buttonPrimaryContainer",
    "doItTogether__videoImageBoySecondSlide",
    "doItTogether__videoImageBoySecondSlideHidden",
    "doItTogether__videoImageBoyAndGirlSecondSlide",
    "doItTogether__videoImageBoyAndGirlSecondSlideHidden",
    "doItTogether__columnPushAndGoHidden",
    "doItTogether__dotsStyle",
    // CSS MODAL
    "modalSpecialDoItTogether__background",
    "modalSpecialDoItTogether__background__open",
    "modalSpecialDoItTogether__container",
    "modalSpecialDoItTogether__container__open",
    "modalSpecialDoItTogether__buttonContainer",
    "modalSpecialDoItTogether__buttonClose",
    "modalSpecialDoItTogether__closeIcon",
    "modalSpecialDoItTogether__contentItems",
    "modalSpecialDoItTogether__titleWhere",
    "modalSpecialDoItTogether__subtitle",
    "modalSpecialDoItTogether__imageButtonContainer",
    "modalSpecialDoItTogether__scroller",
    "modalSpecialDoItTogether__scrollerOpen",
    "modalSpecialDoItTogether__modalOpenOverflow",
    "modalSpecialDoItTogether__buttonReviewContainer",
  ];
  const { handles } = useCssHandles(CSS_HANDLES);
  const slider = useRef();
  const [isBoyVisible, setIsBoyVisible] = useState(false);
  const [isBoyAndGirlVisible, setIsBoyAndGirlVisible] = useState(false);
  const [isPanVisible, setIsPanVisible] = useState(false);
  const [openModalReview, setOpenModalReview] = useState(false);
  const [videoFile, setvideoFile] = useState("");

  useEffect(() => {
    ////////////quando carifca il componente
    window.scrollTo(0, 0);
    history.scrollRestoration = 'manual';
    // window.slider1Scrolled = null;
    const m = disableScroll();
    return () => {
      /// quando il componente viene distrutto
      window.removeEventListener("scroll", m);
    };
  }, []);

  useEffect(() => {
    setOpenModalReview(openModalReview);
  }, [openModalReview]);

  const removeScrollToBodyInVtex = useCallback(() => {
    if (openModalReview) {
      document
        .querySelector("body")
        .classList.add(handles.modalSpecialDoItTogether__modalOpenOverflow);
    } else {
      document
        .querySelector("body")
        .classList.remove(handles.modalSpecialDoItTogether__modalOpenOverflow);
    }
  }, [openModalReview, handles.modalSpecialDoItTogether__modalOpenOverflow]);

  useEffect(() => {
    removeScrollToBodyInVtex();
  }, [openModalReview, removeScrollToBodyInVtex]);

  let scrollTop;
  let containerSlider;
  var timer = null;

  function disableScroll() {

    scrollTop = document.documentElement.scrollTop;
    containerSlider = window.document.getElementById("Carousel");

    if (containerSlider) {
      setTimeout(() => {
        scrollTop = containerSlider.getBoundingClientRect().top;
      }, 250);
    }
    setTimeout(() => {
      window.addEventListener("scroll", animazione);
      window.addEventListener("scroll", firstTimeScroll);
    }, 250);
    return metodoDaBindare;
  }

  function animazione() {
    if (
      window.pageYOffset >
      containerSlider.getBoundingClientRect().top - 100
    ) {
      setIsBoyVisible(true);
    }
  }

  function metodoDaBindare() {
    const index = getIndexofSlide();
    if ((index === 0 || index === 1) && window.pageYOffset > scrollTop) {
      //change slide next
      if (slider && slider.current /* && isFirstTime */) {
        slider.current.slickNext();
        window.scrollTo(0, scrollTop);
        postSwipe();
      }
    }
    if ((index === 2 || index === 1) && window.pageYOffset < scrollTop) {
      //disable scroll up
      window.scrollTo(0, scrollTop);
      //change slide prev
      if (slider && slider.current) {
        slider.current.slickPrev();
      }
    }
  }

  function firstTimeScroll() {
    const index = getIndexofSlide();
    if (timer !== null) {
      clearTimeout(timer);
    }
    if (index === 0 && window.pageYOffset >= scrollTop) {
      window.scrollTo(0, scrollTop);
    }
    timer = setTimeout(function () {
      if (index === 0 && window.pageYOffset >= scrollTop - 1) {
        window.removeEventListener("scroll", firstTimeScroll);
        window.addEventListener("scroll", metodoDaBindare);
      }
    }, 250);
  }

  function postSwipe() {
    let slickIndex = getIndexofSlide();
    if (slickIndex < 1) {
      setIsBoyAndGirlVisible(true);
    } else {
      setIsPanVisible(true);
    }
  }


  var settings = {
    infinite: false,
    dots: true,
    vertical: true,
    verticalSwiping: false,
    slidesToScroll: 1,
    slidesToShow: 1,
    accessibility: false,
    arrows: false,
    speed: 1000,
    nextArrow: <button type="button" class="slick-next"></button>,
    afterChange: (current) => {
      writeIndexofSlide(current);
    },
    appendDots: (dots) => (
      <div>
        <ul className={handles.doItTogether__dotsPosition}> {dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className={handles.doItTogether__dotsStyle}> {i + 1}</div>
    ),
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
          "\
            .slick-dots li.slick-active{\
             background-color: #005C92 !important; \
             height: 22px !important; \
             width: 8px !important; \
             border-radius: 13px !important; \
             transition: height 0.5s!important; \
            }\
            .slick-dots li{\
            height: 8px !important;\
            width: 8px !important;\
            background-color: #ffffff !important;\
            border-radius: 50% !important;\
            display: inline-block !important;\
            margin-top: 14px !important;\
            }\
            .slick-vertical .slick-slide{\
              border: 0px !important \
                }\
            .slick-arrow .slick-next{\
                display: none !important \
            }\
            .slick-dots{\
                width: 10% !important \
            }\
        \
        "
        }
      </style>
      <div style={{ display: "none" }} id="slideIndex">
        0
      </div>
      {/*  <div
                className={
           isBoyVisible ?   handles.doItTogether__pushAndGoRowBlockTransition  : handles.doItTogether__pushAndGoRowBlockTransitionHidden
                }
            /> */}
      <Slider ref={slider} {...settings}>
        {/* -------------------FIRST SLIDE CAROUSEL---------------------- */}
        <div className={handles.doItTogether__maxiContainer} id="Carousel">
          <div
            style={{ cursor: " pointer" }}
            onClick={() => {
              setOpenModalReview(!openModalReview);
              setvideoFile(
                "https://whirlpool-cdn.thron.com/shared/plugins/embed/current/whirlpool/vi-5ae35fcf-7a97-449f-b4c7-70d3ae0492a3/sckne7?filename=Indesit_LFLS_Laundry_15s_UK_20201116_v1.mp4"
              );
            }}
            className={
              isBoyVisible
                ? handles.doItTogether__videoImageBoy
                : handles.doItTogether__videoImageBoyEmpty
            }
          />

          <div
            className={
              isBoyVisible
                ? handles.doItTogether__pushAndGoRow
                : handles.doItTogether__pushAndGoRowHidden
            }
          >
            <div
              className={
                isBoyVisible
                  ? handles.doItTogether__columnPushAndGo
                  : handles.doItTogether__columnPushAndGoHidden
              }
            >
              <div
                className={handles.doItTogether__imageContainerPushAndGo}
              ></div>
              <div>
                <h2 className={handles.doItTogether__textPushAndGo}>
                  {" "}
                  It only takes one push to set a good example{" "}
                </h2>
              </div>
            </div>
          </div>
          <div className={handles.doItTogether__textAppliancesContainer}>
            <div
              className={
                isBoyVisible
                  ? handles.doItTogether__textAppliances
                  : handles.doItTogether__textAppliancesHidden
              }
            >
              <p style={{ marginTop: "0px" }}>
                {" "}
                With our{" "}
                <b style={{ fontWeight: "bold" }}>
                  easy-to-use Push&Go appliances&nbsp;
                </b>
                creating a happier and healthier family environment where
                <b style={{ fontWeight: "bold" }}>
                  {" "}
                  participation is encouraged has never been so simple
                </b>
                . Thanks to this collaborative method, your children will adopt
                the same approach to housework later on in their lives.{" "}
              </p>
              <div className={handles.doItTogether__buttonPrimaryContainer}>
                <ButtonPrimary
                  text={"Discover the Innex range"}
                  href="/products/laundry/washing-machines"
                  hasTargetBlank={false}
                />
              </div>
            </div>
          </div>
        </div>
        {/* -------------------SECOND SLIDE CAROUSEL---------------------- */}
        <div className={handles.doItTogether__maxiContainer}>
          <div
            style={{ cursor: " pointer" }}
            onClick={() => {
              setOpenModalReview(!openModalReview);
              setvideoFile(
                "https://whirlpool-cdn.thron.com/shared/plugins/embed/current/whirlpool/vi-baf84f6a-a2db-48ef-9466-57ba4324a423/sckne7?filename=INDESIT_DIT_Y4_DW_15s_20201217.mp4"
              );
            }}
            className={
              isBoyAndGirlVisible
                ? handles.doItTogether__videoImageBoySecondSlideHidden
                : handles.doItTogether__videoImageBoySecondSlide
            }
          />

          <div
            style={{ cursor: " pointer" }}
            onClick={() => {
              setOpenModalReview(!openModalReview);
              setvideoFile(
                "https://whirlpool-cdn.thron.com/shared/plugins/embed/current/whirlpool/vi-baf84f6a-a2db-48ef-9466-57ba4324a423/sckne7?filename=INDESIT_DIT_Y4_DW_15s_20201217.mp4"
              );
            }}
            className={handles.doItTogether__videoImageBoyAndGirl}
          />

          <div className={handles.doItTogether__pushAndGoRow}>
            <div className={handles.doItTogether__columnPushAndGo}>
              <div
                className={handles.doItTogether__imageContainerPushAndGo}
              ></div>
              <div>
                <h2
                  className={
                    isBoyAndGirlVisible
                      ? handles.doItTogether__textPushAndGo
                      : handles.doItTogether__textPushAndGoHidden
                  }
                >
                  {" "}
                  Enjoy time together, with a total peace of mind
                </h2>
              </div>
            </div>
          </div>

          <div className={handles.doItTogether__textAppliancesContainer}>
            <div
              className={
                isBoyAndGirlVisible
                  ? handles.doItTogether__textAppliances
                  : handles.doItTogether__textAppliancesHidden
              }
            >
              <p style={{ marginTop: "0px" }}>
                {" "}
                Push&Go has been created for{" "}
                <b style={{ fontWeight: "bold" }}>
                  optimal results with minimal fuss{" "}
                </b>{" "}
                – ensuring clean and dry dishes with no need to prewash{" "}
                <b style={{ fontWeight: "bold" }}>in just one push</b>.The
                modern, fuss-free user interface has a dedicated{" "}
                <b style={{ fontWeight: "bold" }}>Push&Go button</b>{" "}
                to start a daily 85-minute cycle. It’s so intuitive that
                everyone in the family can help with the dishes.{" "}
              </p>
              <div className={handles.doItTogether__buttonPrimaryContainer}>
                <ButtonPrimary
                  text={"Discover the dish range"}
                  href="/products/dishwashing/dishwashers/fast-clean?initialMap=c,c,c&initialQuery=products/dishwashing/dishwashers&map=category-1,category-2,category-3,special-features-"
                  hasTargetBlank={false}
                ></ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
        {/* -------------------THIRD SLIDE CAROUSEL---------------------- */}
        <div className={handles.doItTogether__maxiContainer}>
          <div
            style={{ cursor: " pointer" }}
            onClick={() => {
              setOpenModalReview(!openModalReview);
              setvideoFile(
                "https://whirlpool-cdn.thron.com/shared/plugins/embed/current/whirlpool/vi-edf8ab74-87d2-4af3-80ea-3c6809c55c86/sckne7?filename=Indesit_LFLS_Hob_Boiling_15s_UK_20201113.mp4"
              );
            }}
            className={
              isPanVisible
                ? handles.doItTogether__videoImageBoyAndGirlSecondSlideHidden
                : handles.doItTogether__videoImageBoyAndGirlSecondSlide
            }
          />

          <div
            style={{ cursor: " pointer" }}
            onClick={() => {
              setOpenModalReview(!openModalReview);
              setvideoFile(
                "https://whirlpool-cdn.thron.com/shared/plugins/embed/current/whirlpool/vi-edf8ab74-87d2-4af3-80ea-3c6809c55c86/sckne7?filename=Indesit_LFLS_Hob_Boiling_15s_UK_20201113.mp4"
              );
            }}
            className={handles.doItTogether__videoImagePan}
          ></div>

          <div className={handles.doItTogether__pushAndGoRow}>
            <div className={handles.doItTogether__columnPushAndGo}>
              <div
                className={handles.doItTogether__imageContainerPushAndGo}
              ></div>
              <div>
                <h2
                  className={
                    isPanVisible
                      ? handles.doItTogether__textPushAndGo
                      : handles.doItTogether__textPushAndGoHidden
                  }
                >
                  {" "}
                  Experience a new generation of hob cooking{" "}
                </h2>
              </div>
            </div>
          </div>
          <div className={handles.doItTogether__textAppliancesContainer}>
            <div
              className={
                isPanVisible
                  ? handles.doItTogether__textAppliances
                  : handles.doItTogether__textAppliancesHidden
              }
            >
              <p style={{ marginTop: "0px" }}>
                With just one push, experience a new generation of hob cooking
                with&nbsp;
                <b style={{ fontWeight: "bold" }}>
                  fast and responsive heat control
                </b>
                . A set of three automatic functions: <b style={{ fontWeight: "bold" }}>Push&Boil</b>,{" "} <b style={{ fontWeight: "bold" }}>Push&Warm</b>,{" "}
                <b style={{ fontWeight: "bold" }}>Push&Moka</b>,{" "} offering an{" "}
                <b style={{ fontWeight: "bold" }}>
                  easy solution to boil, reheat and make a great moka coffee
                </b>{" "}
                at the touch of a button.{" "}
              </p>
              <div className={handles.doItTogether__buttonPrimaryContainer}>
                <ButtonPrimary
                  text={"Discover the hob range"}
                  href="/products/cooking/hobs"
                  hasTargetBlank={false}
                ></ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </Slider>
      {/*MODAL FOR THE IMAGES*/}
      <div
        className={classnames(
          handles.modalSpecialDoItTogether__background,
          openModalReview
            ? handles.modalSpecialDoItTogether__background__open
            : ""
        )}
      />
      <div
        className={classnames(
          handles.modalSpecialDoItTogether__scroller,
          openModalReview ? handles.modalSpecialDoItTogether__scrollerOpen : ""
        )}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpenModalReview(false);
        }}
      >
        <div className={handles.modalSpecialDoItTogether__buttonContainer}>
          <button
            className={handles.modalSpecialDoItTogether__buttonClose}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenModalReview(!openModalReview);
              setvideoFile("");
            }}
          >
            <span className={handles.modalSpecialDoItTogether__closeIcon} />
          </button>
        </div>
        <div>
          {/* Modal content */}
          <div className={handles.modalSpecialDoItTogether__contentItems}>
            <iframe
              width="997"
              height="431"
              frameBorder="0"
              src={videoFile}
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}


  // function disableScroll() {
  //   let scrollTop = document.documentElement.scrollTop;
  //   const containerSlider = window.document.getElementById("Carousel");
  //   if (containerSlider) {
  //     setTimeout(() => {
  //       scrollTop = containerSlider.getBoundingClientRect().top;
  //     }, 250);
  //   }

  //   const animazione = function () {
  //     const index = getIndexofSlide();
  //     if (
  //       window.pageYOffset >
  //       containerSlider.getBoundingClientRect().top - 100
  //     ) {
  //       setIsBoyVisible(true);
  //     }
  //   };

  //   // if any scroll is attempted, set this to the previous value
  //   const metodoDaBindare = function () {
  //     const index = getIndexofSlide();
  //     if ((index === 0 || index === 1) && window.pageYOffset > scrollTop) {
  //       //change slide next
  //       if (slider && slider.current /* && isFirstTime */) {
  //         slider.current.slickNext();

  //         window.scrollTo(0, scrollTop);
  //         postSwipe();
  //       }
  //     }

  //     if ((index === 2 || index === 1) && window.pageYOffset < scrollTop) {
  //       //disable scroll up
  //       window.scrollTo(0, scrollTop);
  //       //change slide prev
  //       if (slider && slider.current) {
  //         slider.current.slickPrev();
  //       }
  //     }
  //   };

  //   var timer = null;
  //   const firstTimeScroll = function () {
  //     const index = getIndexofSlide();

  //     if (timer !== null) {
  //       clearTimeout(timer);
  //     }
  //     if (index === 0 && window.pageYOffset >= scrollTop) {
  //       window.scrollTo(0, scrollTop);
  //     }

  //     timer = setTimeout(function () {
  //       if (index === 0 && window.pageYOffset >= scrollTop - 1) {
  //         window.removeEventListener("scroll", firstTimeScroll);
  //         window.addEventListener("scroll", metodoDaBindare);
  //       }
  //     }, 250);
  //   };

  //   const postSwipe = function () {
  //     let slickIndex = getIndexofSlide();
  //     if (slickIndex < 1) {
  //       setIsBoyAndGirlVisible(true);
  //     } else {
  //       setIsPanVisible(true);
  //     }
  //   };


  //   setTimeout(() => {
  //     window.addEventListener("scroll", animazione);
  //     window.addEventListener("scroll", firstTimeScroll);
  //   }, 250);
  //   return metodoDaBindare;
