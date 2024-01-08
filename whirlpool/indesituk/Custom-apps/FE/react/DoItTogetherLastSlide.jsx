import React, { useEffect, useState } from "react";
import { useCssHandles } from "vtex.css-handles";
import { useRef, useCallback } from "react";
import ButtonPrimary from "./ButtonPrimary";
import classnames from "classnames";
import ReactPlayer from "react-player";

export default function DoItTogetherSlide() {
  const CSS_HANDLES = [
    /* "doItTogether__container", */
    "doItTogether__pushAndGoRowLast",
    /*  "doItTogether__firstStaticContainer",
         "doItTogether__imageLiveTogether",
         "doItTogether__dotsPosition",
         "doItTogether__dotsStyle", */

    "doItTogether__imageContainerPushAndGoLast",
    "doItTogether__maxiContainerLast",
    "doItTogether__columnPushAndGoLast",
    "doItTogether__textPushAndGoLast",
    "doItTogether__textAppliancesLast",
    "doItTogether__textAppliancesLastHidden",
    "doItTogether__textAppliancesContainerLast",
    "doItTogether__videoImageBoyLastContainer",
    "doItTogether__videoImageBoyEmptyLastContainer",
    "doItTogether__videoImageBoyLast",
    "doItTogether__videoImageBoyEmptyLast",
    "doItTogether__videoImageBoyLastCircle",
    "doItTogether__videoImageBoyEmptyLastCircle",
    "doItTogether__videoImageBoyLastCircleBlur",
    "doItTogether__videoImageBoyEmptyLastCircleBlur",
    "doItTogether__pushAndGoRowLastHidden",
    "doItTogether__columnPushAndGoLastHidden",
    /*        "doItTogether__maxiContainerHidden",
               "doItTogether__pushAndGoRowHidden",
               "doItTogether__pushAndGoRowBlockTransition",
               "doItTogether__pushAndGoRowBlockTransitionHidden",
               "doItTogether__videoImageBoyAndGirl",
               "doItTogether__videoImagePan", */
    "doItTogether__buttonPrimaryContainerLast",
    "modalSpecialDoItTogether__iframeVideo",
    /*  "doItTogether__videoImageBoySecondSlide",
         "doItTogether__videoImageBoySecondSlideHidden",
         "doItTogether__videoImageBoyAndGirlSecondSlide",
         "doItTogether__videoImageBoyAndGirlSecondSlideHidden", */
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
    "modalSpecialDoItTogether__playButtonVideoIconVisible",
    "modalSpecialDoItTogether__playButtonVideoIconHidden",
  ];
  const { handles } = useCssHandles(CSS_HANDLES);
  const slider = useRef();
  const [isBoyVisibleLast, setIsBoyVisibleLast] = useState(false);
  /*   const [isBoyAndGirlVisible, setIsBoyAndGirlVisible] = useState(false);
      const [isPanVisible, setIsPanVisible] = useState(false);
      const [userScrolling, setUserScrolling] = useState(false); */
  const [openModalReview, setOpenModalReview] = useState(false);
  const [videoFile, setvideoFile] = useState("");

  useEffect(() => {
    const metodoDaBindare = init();
    return () => {
      window.removeEventListener("scroll", metodoDaBindare);
    };
  }, []);
  const init = () => {
    const metodoDaBindare = () => {
      /* let containerSlider2 = window.document.getElementById("SecondCarousel"); */
      if (
        window.pageYOffset >
        /*  containerSlider2.getBoundingClientRect().top */ 1800
      ) {
        //NUMERO FISSO, DA CAMBIARE !!!!!!!!!!!!!!!!!!!!!
        setIsBoyVisibleLast(true);
      }
    };
    setTimeout(() => {
      window.addEventListener("scroll", metodoDaBindare);
    });
    return metodoDaBindare;
  };

  useEffect(() => {
    setOpenModalReview(openModalReview);
  }, [openModalReview]);

  //for removing scroll from the background
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
  // if any scroll is attempted, set this to the previous value

  return (
    <>
      <div
        className={handles.doItTogether__maxiContainerLast}
        style={{ overflowX: "hidden !important", position: "relative" }}
        id="SecondCarousel"
      >
        <div
          style={{ cursor: " pointer" }}
          onClick={() => {
            setOpenModalReview(!openModalReview);
            setvideoFile(
              /*  "https://whirlpool-cdn.thron.com/shared/plugins/embed/current/whirlpool/vi-e89ab86e-282d-49c6-abb4-7505b9c7b730/sckne7?filename=Indesit_LFLS_Oven_15s_UK_20201113_v1.mp4" */
              "https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/0c8d4ae6-8297-4072-bbe7-0ee0ef5e2d0b/sckne7/WEBHD/vi-e89ab86e-282d-49c6-abb4-75"
            );
          }}
          className={
            isBoyVisibleLast
              ? handles.doItTogether__videoImageBoyLast
              : handles.doItTogether__videoImageBoyEmptyLast
          }
        >
        </div>
        <div
          className={
            isBoyVisibleLast
              ? handles.doItTogether__pushAndGoRowLast
              : handles.doItTogether__pushAndGoRowLastHidden
          }
        >
          <div
            className={
              isBoyVisibleLast
                ? handles.doItTogether__columnPushAndGoLast
                : handles.doItTogether__columnPushAndGoLastHidden
            }
          >
            <div
              className={handles.doItTogether__imageContainerPushAndGoLast}
            ></div>
            <div>
              <h2
                className={handles.doItTogether__textPushAndGoLast}
                style={{ marginBottom: "0px" }}
              >
                It's so easy that the whole family can share the chores{" "}
              </h2>
            </div>
          </div>
        </div>
        <div className={handles.doItTogether__textAppliancesContainerLast}>
          <div
            className={
              isBoyVisibleLast
                ? handles.doItTogether__textAppliancesLast
                : handles.doItTogether__textAppliancesLastHidden
            }
          >
            <p style={{ marginTop: "0px" }}>
              The clever Turn&Go function is ideal for busy families who don't
              have much time to spend in the kitchen. With one turn of the dial,{" "}
              <b style={{ fontWeight: "bold" }}>
                Turn&Go enables the whole family to enjoy delicious dishes in
                just one hour
              </b>
              , without worrying about setting the right cooking time and
              temperature.
            </p>
            <div className={handles.doItTogether__buttonPrimaryContainerLast}>
              <ButtonPrimary
                text={"Discover the Aria range"}
                href="/products/cooking/ovens"
                hasTargetBlank={false}
              />
            </div>
          </div>
        </div>
      </div>

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
          setvideoFile("");
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
            {/*  <iframe
            className={handles.modalSpecialDoItTogether__iframeVideo}
              frameBorder="0"
              autoplay="true"
              src={videoFile}
            ></iframe> */}
            <ReactPlayer
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
            />
          </div>
        </div>
      </div>
    </>
  );
}
