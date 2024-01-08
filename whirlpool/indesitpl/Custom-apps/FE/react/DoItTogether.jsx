import React, { useEffect, useState, useRef, useCallback } from "react";
import { useCssHandles } from "vtex.css-handles";
import Slider from "react-slick";
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
    "DoItTogether__textAppliance",
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
  const [tracked, setTracked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isSec, setIsSec] = useState("");

  const analyticsCallBack = () => {
    let idVideo = videoFile.split("vi-")[1];
    if (idVideo.includes("/")) {
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventLabel: `Product Experience Video - ${videoFile ? idVideo : ""}`,
    };
    window.dataLayer.push(analyticsJson);
  };

  // ON PLAY
  const analyticsCallBackPLAY = () => {
    let idVideo = videoFile.split("vi-")[1];
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
      };
      window.dataLayer.push(analyticsJson);
    }
  };

  // ON PAUSE
  const analyticsCallBackPAUSE = () => {
    let idVideo = videoFile.split("vi-")[1];
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
      };
      window.dataLayer.push(analyticsJson);
    }
  };
  // ON END
  const analyticsCallBackEND = () => {
    let idVideo = videoFile.split("vi-")[1];
    if (idVideo.includes("/")) {
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventCategory: "Product Experience",
      eventLabel: "Product Experience Video - " + idVideo,
      eventAction: "View a Video - Complete",
    };
    window.dataLayer.push(analyticsJson);
  };
  // ON SEEK
  const analyticsCallBackSEEK = (sec) => {
    let idVideo = videoFile.split("vi-")[1];

    if (idVideo.includes("/")) {
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventLabel: "Product Experience Video - " + idVideo,
      eventAction: "View a Video - Seeked to sec " + Math.round(sec),
    };
    window.dataLayer.push(analyticsJson);
    setIsSeeking(false);
  };
  //ON 10 SECS
  const analyticsCallBack10secs = () => {
    let idVideo = videoFile.split("vi-")[1];

    if (idVideo.includes("/")) {
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      eventLabel: "Product Experience Video - " + idVideo,
      eventAction: "View a Video -" + Math.round(isSec) + "secs",
    };
    window.dataLayer.push(analyticsJson);
  };

  useEffect(() => {
    setIsPaused(false);
    setTracked(false);
  }, [isSeeking]);

  useEffect(() => {
    /* document.body.style.overflow = 'hidden'; */
    window.scrollTo(0, 0);
    history.scrollRestoration = "manual";
    const m = disableScroll();
    return () => {
      window.removeEventListener("scroll", m);
    };
  }, []);

  useEffect(() => {
    if (openModalReview) {
      analyticsCallBack();
    }
  }, [openModalReview === true]);

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
        document.body.style.overflow = "";
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
    if (slider && slider.current) {
      if (index < 2 && window.pageYOffset > scrollTop - 1) {
        slider.current.slickNext();
        window.scrollTo(0, scrollTop);
      } else if (index > 0 && window.pageYOffset < scrollTop + 1) {
        slider.current.slickPrev();
        window.scrollTo(0, scrollTop);
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
      } else if (index === 1) {
        setIsBoyAndGirlVisible(true);
      } else if (index === 2) {
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
            /* onClick={() => {
              setOpenModalReview(!openModalReview);
              setvideoFile(
                "https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/66e6d4f6-1d2a-437b-aa2f-d812e89d03ac/sckne7/WEBHD/vi-15ec774d-f43f-47fa-a9c5-a7"
              );
            }} */
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
                  Wystarczy jedno naciśnięcie, aby dać dobry przykład.
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
              <p
                className={handles.DoItTogether__textAppliance}
                style={{ marginTop: "0px" }}
              >
                {/* Grâce à la{" "}
                <b style={{ fontFamily: "Roboto" }}>
                  simplicité d'utilisation des appareils Push&Go
                </b>
                , retrouver le plaisir de vivre en harmonie et{" "}
                <b style={{ fontFamily: "Roboto" }}>
                  encourager la participation
                </b>{" "}
                n'a jamais été ausi simple. Vos enfants adopterons la même
                approche des tâches ménagères plus tard dans leur vie. */}
                Dzięki naszym łatwym w użyciu urządzeniom Push&Go, tworzenie
                szczęśliwszego i zdrowszego środowiska dla Twojej rodziny, w
                którym ważna jest partycypacja w obowiązkach, jest prostrze niż
                kiedykolwiek! Dzięki tej metodzie współpracy, Twoje dzieci
                nauczą się odpowiedniego podejścia do domowych prac.
              </p>

              <div className={handles.doItTogether__buttonPrimaryContainer}>
                <ButtonPrimary
                  text={"Odkryj linię Innex"}
                  href="/produkty/pranie/pralki"
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
            /* onClick={() => {
              setOpenModalReview(!openModalReview);
              setvideoFile(
                "https://whirlpool-cdn.thron.com/shared/plugins/embed/current/whirlpool/vi-d46ec0d3-2edb-47b1-8dcc-1801850ff7f4/sckne7?filename=Copie%20de%20INDESIT_MIL_01_ARIA_15s_FR_20190521_v01.mov"
              );
            }} */
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
                  Ciesz się w spokoju wspólnie spędzonym czasem.
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
              <p
                className={handles.DoItTogether__textAppliance}
                style={{ marginTop: "0px" }}
              >
                {/* <b style={{ fontFamily: "Roboto" }}>Des recettes savoureuses</b>
                , prêtes en un seul geste grâce à la fa{" "}
                <b style={{ fontFamily: "Roboto" }}>
                  fonction astucieuse Turn&Cook
                </b>
                . D'un simple geste,{" "}
                <b style={{ fontFamily: "Roboto" }}>Turn&Cook</b> permet à toute
                la famille de savourer de délicieux plats en une heure
                seulement, sans se soucier de régler{" "}
                <b style={{ fontFamily: "Roboto" }}>
                  le bon temps de cuisson et la bonne température
                </b>
                . */}
                Funkcja Push&Go została stworzona z myślą o optymalnych
                rezultatach przy minimalnym wysiłku. Funkcja ta zapewnia czyste
                i suche naczynia bez konieczności mycia wstępnego. Za jednym
                naciśnięciem przycisku. Nowoczesny interfejs ogranicza Twój
                wysiłek dzięki przyciskowi Push&Go, który rozpoczyna codzienny
                85-minutowy cykl zmywania.
              </p>
              <div className={handles.doItTogether__buttonPrimaryContainer}>
                <ButtonPrimary
                  text={"Odkryj zmywarki"}
                  href="/produkty/zmywanie/zmywarki"
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
            /* onClick={() => {
              setOpenModalReview(!openModalReview);
              setvideoFile(
                "https://whirlpool-cdn.thron.com/shared/plugins/embed/current/whirlpool/vi-0152bb06-c299-4149-bfde-ae10d72a4039/sckne7?filename=Copie%20de%20INDESIT_MIL_03_FRIDGE_15s_FR_20190521_v01.mov"
              );
            }} */
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
                  Poznaj nową generację gotowania na płycie
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
              <p
                className={handles.DoItTogether__textAppliance}
                style={{ marginTop: "0px" }}
              >
                {/* <b style={{ fontFamily: "Roboto" }}>Avoir de la place</b>, c’est
                essentiel pour une famille. C'est pourquoi le{" "}
                <b style={{ fontFamily: "Roboto" }}>
                  réfrigérateur Indesit Push&Go
                </b>{" "}
                vous offre une{" "}
                <b style={{ fontFamily: "Roboto" }}>
                  puissance de refoidissement supplémentaire
                </b>{" "}
                pour vos grandes courses hebdomadaires.{" "}
                <b style={{ fontFamily: "Roboto" }}>
                  Conçu pour être si simple, que tout le monde peut l'utiliser
                </b>
                . */}
                Wystarczy jedno naciśnięcie, aby poznać nową generację gotowania
                na płycie z szybką i responsywną kontrolą ciepła. Zestaw trzech
                automatycznych funkcji: Push&Boil, Push&Warm i Push&Moka,
                gwarantuje łatwe gotowanie, odgrzewanie potraw oraz parzenie
                wspaniałej kawy. A to wszystko za naciśnięciem jednego
                przycisku.
              </p>

              <div className={handles.doItTogether__buttonPrimaryContainer}>
                <ButtonPrimary
                  text={"Odkryj płyty kuchenne"}
                  href="/produkty/gotowanie/plyty"
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
              }}
              onPause={() => {
                setIsPaused(true);
                if (!isSeeking) {
                  analyticsCallBackPAUSE();
                }
              }}
              onEnded={() => analyticsCallBackEND()}
              onSeek={(e) => {
                setIsSeeking(true);
                analyticsCallBackSEEK(e);
              }}
              onProgress={(e) => {
                setIsSec(Math.round(e.playedSeconds));
                if (isSec === 10) {
                  analyticsCallBack10secs();
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
