import React, { useState, useEffect, useCallback } from "react";
import classnames from "classnames";

import { useCssHandles } from "vtex.css-handles";
import { useProduct } from "vtex.product-context";
import { isFunction } from "lodash";

const CSS_HANDLES = [
  "modalSpecialReview__background",
  "modalSpecialReview__background__open",
  "modalSpecialReview__container",
  "modalSpecialReview__container__open",
  "modalSpecialReview__buttonContainer",
  "modalSpecialReview__buttonClose",
  "modalSpecialReview__closeIcon",
  "modalSpecialReview__contentItems",
  "modalSpecialReview__titleWhere",
  "modalSpecialReview__subtitle",
  "modalSpecialReview__imageButtonContainer",
  "modalSpecialReview__scroller",
  "modalSpecialReview__scrollerOpen",
  "modalSpecialReview__modalOpenOverflow",
  "modalSpecialReview__buttonReviewContainer",
];

export default function ModalReviewWithoutButtonsAao({
  isOpenAao,
  closeModal,
}) {
  const [
    openModalReviewWithoutButtonsAao,
    setOpenModalReviewWithoutButtonsAao,
  ] = useState(isOpenAao);
  const { handles } = useCssHandles(CSS_HANDLES);

  const { product } = useProduct();

  const productFcode = product.items[0].name;

  useEffect(() => {
    getProductReviewFromReevoo();
  }, []);

  function getProductReviewFromReevoo() {
    const script = document.createElement("script");

    script.defer = "defer";
    script.src = "https://widgets.reevoo.com/loader/IN4.js";
    script.id = "reevoo-loader";
    script.type = "text/javascript";

    document.body.appendChild(script);
  }

  useEffect(() => {
    setOpenModalReviewWithoutButtonsAao(openModalReviewWithoutButtonsAao);
  }, [openModalReviewWithoutButtonsAao]);

  /*  const removeScrollToBodyInVtex = useCallback(() => {
         if (openModalReviewWithoutButtonsAao) {
             document
                 .querySelector('body')
                 ?.classList.add(handles.modalSpecialReview__modalOpenOverflow)
         } else {
             document
                 .querySelector('body')
                 ?.classList.remove(handles.modalSpecialReview__modalOpenOverflow)
         }
     }, [openModalReviewWithoutButtonsAao, handles.modalSpecialReview__modalOpenOverflow])

     useEffect(() => {
         removeScrollToBodyInVtex()
     }, [openModalReviewWithoutButtonsAao, removeScrollToBodyInVtex]) */

  return (
    <>
      <div
        className={classnames(
          handles.modalSpecialReview__background,
          openModalReviewWithoutButtonsAao
            ? handles.modalSpecialReview__background__open
            : ""
        )}
      />
      <div
        className={classnames(
          handles.modalSpecialReview__scroller,
          openModalReviewWithoutButtonsAao
            ? handles.modalSpecialReview__scrollerOpen
            : ""
        )}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpenModalReviewWithoutButtonsAao(
            !openModalReviewWithoutButtonsAao
          );
          closeModal();
        }}
      >
        <div
          className={classnames(
            handles.modalSpecialReview__container,
            openModalReviewWithoutButtonsAao
              ? handles.modalSpecialReview__container__open
              : ""
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={handles.modalSpecialReview__buttonContainer}>
            <button
              className={handles.modalSpecialReview__buttonClose}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenModalReviewWithoutButtonsAao(
                  !openModalReviewWithoutButtonsAao
                );
                if (isFunction(closeModal)) {
                  closeModal();
                }
              }}
            >
              <span className={handles.modalSpecialReview__closeIcon} />
            </button>
          </div>
          {/* Modal content */}
          <div className={handles.modalSpecialReview__contentItems}>
            <reevoo-embeddable
              style={{ width: "90vw" }}
              type="tabbed"
              product-id={productFcode}
              locale="en-GB"
              per-page={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
