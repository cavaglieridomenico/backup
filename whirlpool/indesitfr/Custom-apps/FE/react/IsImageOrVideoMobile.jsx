import React, { useState, useEffect, useCallback } from "react";
import { useCssHandles } from "vtex.css-handles";
import classnames from "classnames";

export default function IsImageOrVideoMobile({
  isVideo,
  videoFileCms,
  imageFileCms,
  imageVideoFileCms,
}) {
  const CSS_HANDLES = [
    "isImageOrVideo__image",
    "modalSpecialDoItTogether__buttonContainer",
    "modalSpecialDoItTogether__modalOpenOverflow",
    "modalSpecialDoItTogether__background",
    "modalSpecialDoItTogether__background__open",
    "modalSpecialDoItTogether__scroller",
    "modalSpecialDoItTogether__scrollerOpen",
    "modalSpecialDoItTogether__closeIcon",
    "modalSpecialDoItTogether__contentItems",
    "isImageOrVideo__imageContainer",
    "modalSpecialDoItTogether__buttonClose",
    "isImageOrVideo__playButton",
    "isImageOrVideo__imageVideoContainer",
    "isImageOrVideo__playButtonContainer",
    "isImageOrVideo__imageVideoFileCms",
    "isImageOrVideo__imageCms"

  ];
  const { handles } = useCssHandles(CSS_HANDLES);
  const [updateVideoFileCms, setUpdateVideoFileCms] = useState(videoFileCms);

  const [openModalReview, setOpenModalReview] = useState(false);

  useEffect(() => {
    setOpenModalReview(openModalReview);
  }, [openModalReview]);
  useEffect(() => {
    removeScrollToBodyInVtex();
  }, [openModalReview, removeScrollToBodyInVtex]);

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
  return (
    <>
      {isVideo ? (
        <>
          <div>
            <div className={handles.isImageOrVideo__playButtonContainer}>
              <span
                className={handles.isImageOrVideo__playButton}
                style={{ cursor: " pointer" }}
                onClick={() => {
                  setOpenModalReview(!openModalReview);
                  setUpdateVideoFileCms(videoFileCms)
                }}
              ></span>
            </div>
            <div className={handles.isImageOrVideo__imageVideoContainer}>
              <img
                className={handles.isImageOrVideo__imageVideoFileCms}
                src={imageVideoFileCms}
              ></img>
            </div>
          </div>
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
              openModalReview
                ? handles.modalSpecialDoItTogether__scrollerOpen
                : ""
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
                  setUpdateVideoFileCms(" ");
                }}
              >
                <span className={handles.modalSpecialDoItTogether__closeIcon} />
              </button>
            </div>
            <div>
              {/* Modal content */}
              <div className={handles.modalSpecialDoItTogether__contentItems}>
                {
                  <iframe
                    width="330"
                    height="295"
                    frameBorder="0"
                    src={updateVideoFileCms}
                  ></iframe>
                }
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={handles.isImageOrVideo__imageContainer}>
            <img  className={handles.isImageOrVideo__imageCms} src={imageFileCms}></img>
          </div>
        </>
      )}
    </>
  );
}

IsImageOrVideoMobile.schema = {
  title: "cambio immagine o video",
  type: "object",
  properties: {
    isVideo: {
      type: "boolean",
      description: "scegli se video o immagine",
      title: "video o immagine",
      default: true,
    },
    videoFileCms: {
      type: "string",
      description: "link al video",
      title: "link al video",
    },
    imageVideoFileCms: {
      type: "string",
      description: "immagine per il video",
      title: "immagine per il video",
    },
    imageFileCms: {
      type: "string",
      description: "immagine",
      title: "carica file",
    },
  },
};
