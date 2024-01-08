import React, { useEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";
import Slider from "react-slick";
import { useRef, useCallback } from "react";
import ButtonPrimary from "./ButtonPrimary";
import classnames from "classnames";
import ReactPlayer from "react-player";


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
  const [tracked, setTracked] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [isSec, setIsSec] = useState("")




  const analyticsCallBack = () => {

    let idVideo = videoFile
      .split("vi-")[1]
    if (idVideo.includes("/")) {
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventLabel: `Product Experience Video - ${videoFile ? idVideo : ""}`,
    }
    window.dataLayer.push(analyticsJson);
  }

  // ON PLAY
  const analyticsCallBackPLAY = () => {
    let idVideo = videoFile
      .split("vi-")[1]
    if (idVideo.includes("/")) {
      idVideo.substr(0, idVideo.indexOf("/"));
    }
    if (!isSeeking) {
      window.dataLayer = window.dataLayer || [];
      let analyticsJson = {
        event: "thronVideo",
        eventCategory: "Product Experience",
        eventLabel: "Product Experience Video - " + idVideo,
        eventAction: "View a Video - Play",
      }
      window.dataLayer.push(analyticsJson);
    }
  }

  // ON PAUSE
  const analyticsCallBackPAUSE = () => {
    let idVideo = videoFile
      .split("vi-")[1]
    if (idVideo.includes("/")) {
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    if (!isSeeking) {
      window.dataLayer = window.dataLayer || [];
      let analyticsJson = {
        event: "thronVideo",
        eventCategory: "Product Experience",
        eventLabel: "Product Experience Video - " + idVideo,
        eventAction: "View a Video - Stop",
      }
      window.dataLayer.push(analyticsJson);
    }
  }
  // ON END
  const analyticsCallBackEND = () => {

    let idVideo = videoFile
      .split("vi-")[1]
    if (idVideo.includes("/")) {
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventCategory: "Product Experience",
      eventLabel: "Product Experience Video - " + idVideo,
      eventAction: "View a Video - Complete",
    }
    window.dataLayer.push(analyticsJson);
  }
  // ON SEEK
  const analyticsCallBackSEEK = (sec) => {
    let idVideo = videoFile
      .split("vi-")[1]

    if (idVideo.includes("/")) {
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventLabel: "Product Experience Video - " + idVideo,
      eventAction: "View a Video - Seeked to sec " + Math.round(sec),
    }
    window.dataLayer.push(analyticsJson);
    setIsSeeking(false)

  }
  //ON 10 SECS
  const analyticsCallBack10secs = () => {
    let idVideo = videoFile
      .split("vi-")[1]

    if (idVideo.includes("/")) {
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventLabel: "Product Experience Video - " + idVideo,
      eventAction: "View a Video -" + Math.round(isSec) + "secs",
    }
    window.dataLayer.push(analyticsJson);
  }

  useEffect(() => {
    setIsPaused(false);
    setTracked(false)

  }, [isSeeking])

  useEffect(() => {
    /* document.body.style.overflow = 'hidden'; */
    window.scrollTo(0, 0);
    history.scrollRestoration = 'manual';
    const m = disableScroll();
    return () => {
      window.removeEventListener("scroll", m);
    };
  }, []);

  useEffect(() => {
    if (openModalReview) {
      analyticsCallBack();
    }
  }, [openModalReview === true])

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
        scrollTop = parseInt(containerSlider.getBoundingClientRect().top);
        document.body.style.overflow = '';
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
      let index = getIndexofSlide();
      if (index === 0) {
        setIsBoyVisible(true);
      }
      else if (index === 1) {
        setIsBoyAndGirlVisible(true);
      }
      else if (index === 2) {
        setIsPanVisible(true);
      }
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
                width: 10% !important; \
                bottom: 50% !important;\
                position: absolute;\
                margin-bottom: 15px !important;\
            }\
        \
        "
        }
      </style>
      <div style={{ display: "none" }} id="slideIndex">
        0
      </div>
      <Slider ref={slider} {...settings}>
        {/* -------------------FIRST SLIDE CAROUSEL---------------------- */}
        <div className={handles.doItTogether__maxiContainer} id="Carousel">
          <div
            style={{ cursor: " pointer" }}
            onClick={() => {
              setOpenModalReview(!openModalReview);
              setvideoFile(
                "https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/544d5def-dc35-4ee4-8e5c-46d80f5c4452/sckne7/WEBHD/vi-0ad547cf-7472-4d97-9cbc-f7"
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
                  Basta un tasto per dare il buon esempio{" "}
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
                Condividi le faccende domestiche con un solo click. Con gli{" "}
                <b style={{ fontWeight: "bold" }}>
                  elettrodomestici Push&Go tutti possono aiutare&nbsp;
                </b>
                . Basta un veloce click e la tua Innex imposta e avvia subito, anche a macchina spenta, il programma di lavaggio. In soli 45 minuti avrai un bucato perfettamente pulito.
              </p>
              <div className={handles.doItTogether__buttonPrimaryContainer}>
                <ButtonPrimary
                  text={"Scopri la gamma Innex"}
                  href="/prodotti/lavare/lavatrici"
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
                "https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/fbed380a-d833-4eea-b066-5083f7289612/sckne7/WEBHD/vi-71b75861-d330-4178-8db2-d6"
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
                "https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/fbed380a-d833-4eea-b066-5083f7289612/sckne7/WEBHD/vi-71b75861-d330-4178-8db2-d6"
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
                  Goditi il tempo insieme, in totale tranquillità
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
                <b style={{ fontWeight: "bold" }}>
                  Risultati ottimali con il minimo sforzo{" "}
                </b>{" "}
                , con Push&Go garantiscono stoviglie pulite e asciutte senza prelavaggio{" "}
                <b style={{ fontWeight: "bold" }}>con un solo tocco</b>. Il{" "}
                <b style={{ fontWeight: "bold" }}>pulsante Push & Go</b>{" "}
                avvia un ciclo giornaliero di 85 minuti, così intuitivo che tutti possono aiutare.{" "}
              </p>
              <div className={handles.doItTogether__buttonPrimaryContainer}>
                <ButtonPrimary
                  text={"Scopri la gamma lavastoviglie"}
                  href="/prodotti/lavare-i-piatti/lavastoviglie"
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
                "https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/160d79e9-dbe5-4c47-86d1-55911558f115/sckne7/WEBHD/vi-0741a5f9-4c99-4c0f-9246-39"
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
                "https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/160d79e9-dbe5-4c47-86d1-55911558f115/sckne7/WEBHD/vi-0741a5f9-4c99-4c0f-9246-39"
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
                  La vita è servita con un solo tasto{" "}
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
                Imposta il&nbsp;
                <b style={{ fontWeight: "bold" }}>
                  livello di potenza ideale con un solo push
                </b>
                . Un insieme di tre funzioni automatiche: <b style={{ fontWeight: "bold" }}>Push&Boil</b>,{" "} <b style={{ fontWeight: "bold" }}>Push&Warm</b>,{" "}
                <b style={{ fontWeight: "bold" }}>Push&Moka</b>,{" "} che offrono{" "}
                <b style={{ fontWeight: "bold" }}>
                  una soluzione semplice per bollire, riscaldare e preparare un ottimo caffè moka
                </b>{" "}
                con il semplice tocco di un pulsante.{" "}
              </p>
              <div className={handles.doItTogether__buttonPrimaryContainer}>
                <ButtonPrimary
                  text={"Scopri la gamma piani cottura"}
                  href="/prodotti/cucina/piani-cottura"
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

            <ReactPlayer
              id="thronVideo"
              width="80%"
              height="80%"
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ overflow: "hidden" }}
              url={videoFile}
              playing={true}
              controls={true}
              loop={false}
              config={{
                file: {
                  attributes: {
                    disablepictureinpicture: "true",
                    controlsList: "nodownload",
                  },
                },
              }}
              onPlay={() => {
                setTracked(true);
                if (!isSeeking) {
                  analyticsCallBackPLAY();
                }
              }
              }
              onPause={() => {
                setIsPaused(true)
                if (!isSeeking) {
                  analyticsCallBackPAUSE();
                }
              }
              }
              onEnded={() => analyticsCallBackEND()}
              onSeek={(e) => {
                setIsSeeking(true);
                analyticsCallBackSEEK(e);
              }
              }
              onProgress={(e) => {
                setIsSec(Math.round(e.playedSeconds));
                if (isSec === 10) {
                  analyticsCallBack10secs()
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
