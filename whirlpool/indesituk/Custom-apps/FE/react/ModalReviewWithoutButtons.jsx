import React, { useState, useEffect, useCallback } from "react";
import classnames from "classnames";

import { useCssHandles } from "vtex.css-handles";
import { useProduct } from "vtex.product-context";

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

export default function ModalReviewWithoutButtons({
  isOpenProduct,
  closeModal,
}) {
  const [openModalReviewWithoutButtons, setOpenModalReviewWithoutButtons] =
    useState(isOpenProduct);
  const { handles } = useCssHandles(CSS_HANDLES);

  const { product } = useProduct();

  const productFcode = product.items[0].name;

  /*  useEffect(() => {
    getProductReviewFromReevoo();
  }, []);

  function getProductReviewFromReevoo() {
    const script = document.createElement("script");

    script.defer = "defer";
    script.src = "https://mark.reevoo.com/assets/reevoo_mark.js";
    script.id = "reevoo-loader";
    script.type = "text/javascript";

    document.body.appendChild(script);
  } */

  useEffect(() => {
    setOpenModalReviewWithoutButtons(openModalReviewWithoutButtons);
  }, [openModalReviewWithoutButtons]);

  /*  const removeScrollToBodyInVtex = useCallback(() => {
         if (openModalReviewWithoutButtons) {
             document
                 .querySelector('body')
                 ?.classList.add(handles.modalSpecialReview__modalOpenOverflow)
         } else {
             document
                 .querySelector('body')
                 ?.classList.remove(handles.modalSpecialReview__modalOpenOverflow)
         }
     }, [openModalReviewWithoutButtons, handles.modalSpecialReview__modalOpenOverflow])

     useEffect(() => {
         removeScrollToBodyInVtex()
     }, [openModalReviewWithoutButtons, removeScrollToBodyInVtex]) */

  return (
    <>
      <div
        className={classnames(
          handles.modalSpecialReview__background,
          openModalReviewWithoutButtons
            ? handles.modalSpecialReview__background__open
            : ""
        )}
      />
      <div
        className={classnames(
          handles.modalSpecialReview__scroller,
          openModalReviewWithoutButtons
            ? handles.modalSpecialReview__scrollerOpen
            : ""
        )}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpenModalReviewWithoutButtons(!openModalReviewWithoutButtons);
          closeModal();
        }}
      >
        <div
          className={classnames(
            handles.modalSpecialReview__container,
            openModalReviewWithoutButtons
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
                setOpenModalReviewWithoutButtons(
                  !openModalReviewWithoutButtons
                );

                closeModal();
              }}
            >
              <span className={handles.modalSpecialReview__closeIcon} />
            </button>
          </div>
          {/* Modal content */}
          <div className={handles.modalSpecialReview__contentItems}>
          <reevoo-embedded-tabbed 
              style={{ width: "90vw" }}
              type="tabbed"
              trkref="IN4"
              sku={productFcode}
              locale="en-GB"
              per-page={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
