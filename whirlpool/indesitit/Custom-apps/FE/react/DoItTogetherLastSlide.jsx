import React, { useEffect, useState, useLayoutEffect } from "react";
import { useCssHandles } from "vtex.css-handles";
import { useRef, useCallback } from "react";
import ButtonPrimary from "./ButtonPrimary";
import classnames from "classnames";
import ReactPlayer from "react-player";



export default function DoItTogetherSlide() {
  const CSS_HANDLES = [
    "doItTogether__pushAndGoRowLast",
    "doItTogether__imageContainerPushAndGoLast",
    "doItTogether__maxiContainerLast",
    "doItTogether__columnPushAndGoLast",
    "doItTogether__textPushAndGoLast",
    "doItTogether__textAppliancesLast",
    "doItTogether__textAppliancesLastHidden",
    "doItTogether__textAppliancesContainerLast",
    "doItTogether__videoImageBoyLast",
    "doItTogether__videoImageBoyEmptyLast",
    "doItTogether__pushAndGoRowLastHidden",
    "doItTogether__columnPushAndGoLastHidden",
    "doItTogether__buttonPrimaryContainerLast",
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
  const [isBoyVisibleLast, setIsBoyVisibleLast] = useState(false);
  const [openModalReview, setOpenModalReview] = useState(false);
  const [videoFile, setvideoFile] = useState("");
  const [tracked,setTracked]=useState(false)
  const [isSeeking,setIsSeeking]=useState(false)

  

  //ON OPEN 
  const analyticsCallBack=()=>{

    let idVideo= videoFile
    .split("vi-")[1]
    if(idVideo.includes("/")){
      idVideo.substr(0, idVideo.indexOf("/"));
    }
  
    window.dataLayer = window.dataLayer || [];
    let analyticsJson = {
      event: "thronVideo",
      // eventCategory: "Product Experience",
      eventLabel:  `Product Experience Video - ${videoFile?idVideo:""}`,
      // eventAction:  `View a Video - ${isPlay? "Play":"Stop"}`
    }
    window.dataLayer.push(analyticsJson);
  }
  // ON PLAY
  const analyticsCallBackPLAY=()=>{
    setIsSeeking(false)
    let idVideo= videoFile
    .split("vi-")[1]
    if(idVideo.includes("/")){
      idVideo.substr(0, idVideo.indexOf("/"));
    }
    if(!isSeeking){
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
  const analyticsCallBackPAUSE=()=>{
    setIsSeeking(false)
    let idVideo= videoFile
    .split("vi-")[1]
    if(idVideo.includes("/")){
      idVideo.substr(0, idVideo.indexOf("/"));
    }
    if(!isSeeking){
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
  const analyticsCallBackEND=()=>{

    let idVideo= videoFile
    .split("vi-")[1]
    if(idVideo.includes("/")){
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
  const analyticsCallBackSEEK=(sec)=>{
    let idVideo= videoFile
    .split("vi-")[1]

    if(idVideo.includes("/")){
      idVideo.substr(0, idVideo.indexOf("/"));
    }

    if(tracked){
      window.dataLayer = window.dataLayer || [];
      let analyticsJson = {
        event: "thronVideo",
        eventLabel: "Product Experience Video - " + idVideo,
        eventAction: "View a Video - Seeked to sec " + Math.round(sec),
      }
      window.dataLayer.push(analyticsJson);
      setTracked(false)
    }
    setIsSeeking(false)
  }

  useEffect(() => {
    if(openModalReview){
      analyticsCallBack();
    }
  }, [openModalReview===true])

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
              "https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/c10f97ac-63aa-4677-940a-a3932e39541e/sckne7/WEBHD/vi-8775429c-7d7a-4f23-b549-e4"
            );
          }}
          className={
            isBoyVisibleLast
              ? handles.doItTogether__videoImageBoyLast
              : handles.doItTogether__videoImageBoyEmptyLast
          }
        />

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
                Goditi piatti deliziosi pronti in solo un'ora{" "}
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
              Turn & Go - la soluzione di cottura più semplice. In un solo giro,
              <b style={{ fontWeight: "bold" }}>
                il forno Aria di Indesit imposta automaticamente il tempo
              </b>
                &nbsp;e la temperatura di cottura per oltre 100 ricette. Niente preriscaldamento, niente cene bruciate, solo semplici pasti in famiglia.
            </p>
            <div className={handles.doItTogether__buttonPrimaryContainerLast}>
              <ButtonPrimary
                text={"Scopri la gamma Aria"}
                href="/prodotti/cucina/forni"
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
              onPlay={() => {analyticsCallBackPLAY(); setTracked(true)}}
              onPause={() => analyticsCallBackPAUSE()}
              onEnded={() => analyticsCallBackEND()}
              onSeek={(e) =>{ analyticsCallBackSEEK(e),setIsSeeking(true)}}
            />
          </div>
        </div>
      </div>
    </>
  );
}
