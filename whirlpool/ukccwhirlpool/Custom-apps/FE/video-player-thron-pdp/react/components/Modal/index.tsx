import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Carousel from "../Carousel";
import style from "./modal.css";

interface Props {
  slides: any;
  placeholder: any;
  position: any;
  zoomMode: any;
  maxHeight: any;
  zoomFactor: any;
  aspectRatio: any;
  ModalZoomElement: any;
  thumbnailMaxHeight: any;
  showPaginationDots: any;
  thumbnailAspectRatio: any;
  showNavigationArrows: any;
  thumbnailsOrientation: any;
  displayThumbnailsArrows: any;
  zoomProps: any;
  isVisible: any;
  setClose: any;
  thronPlayers: any;
  parentVideoPlayer: any;
  state: any;
}

export const ModalCarousel = ({
  slides,
  placeholder,
  position,
  zoomMode,
  maxHeight,
  zoomFactor,
  aspectRatio,
  ModalZoomElement,
  thumbnailMaxHeight,
  showPaginationDots,
  thumbnailAspectRatio,
  //showNavigationArrows,
  thumbnailsOrientation,
  displayThumbnailsArrows,
  zoomProps,
  isVisible,
  setClose,
  thronPlayers,
  parentVideoPlayer,
  state,
}: Props) => {

	const bodyScroll = () => {
		document.body.style.overflow = "auto";
    document.body.style.height = "auto";
	};

  const [visibility, setVIsibility] = useState(isVisible);


  useEffect(() => {
    return () => {
      parentVideoPlayer();
    };
  }, []);

  return (
    <div
      className={
        visibility
          ? style.modal + " " + style.displayBlock
          : style.modal + " " + style.displayNone
      }
    >

      <section className={style.modalMain}>
			<button
        type="button"
        onClick={() => {
          setClose();
          setVIsibility(!visibility);
					bodyScroll();
        }}
        className={style.button}
      >
        X
      </button>
        <Carousel
          activeIndex={state}
          slides={slides}
          placeholder={placeholder}
          position={position}
          zoomMode={zoomMode}
          maxHeight={maxHeight}
          zoomFactor={zoomFactor}
          aspectRatio={aspectRatio}
          ModalZoomElement={ModalZoomElement}
          thumbnailMaxHeight={thumbnailMaxHeight}
          showPaginationDots={showPaginationDots}
          thumbnailAspectRatio={thumbnailAspectRatio}
          showNavigationArrows={false}
          thumbnailsOrientation={thumbnailsOrientation}
          displayThumbnailsArrows={displayThumbnailsArrows}
          // Deprecated
          zoomProps={zoomProps}
          isChild={true}
          thronPlayers={thronPlayers}
        />
      </section>
    </div>
  );
};

type ModalWrapperProps = {
  modalState: boolean
  setClose: any
	children: React.ReactNode
	bodyScroll: any
}

export const ModalWrapper = ({
  modalState,
  children,
  setClose,
	bodyScroll
}:ModalWrapperProps) => {

  return children && modalState && (
    <div
      className={
        modalState
          ? style.modal + " " + style.displayBlock
          : style.modal + " " + style.displayNone
      }
    >
      <button
        type="button"
        onClick={() => {
          setClose();
					bodyScroll();
        }}
        className={style.button}
      >
        X
      </button>
      <section className={style.modalMain}> {children} </section>
    </div>
  )
};

