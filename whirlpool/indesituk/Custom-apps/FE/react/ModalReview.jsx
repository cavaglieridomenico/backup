import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import classnames from "classnames";
import { useCssHandles } from "vtex.css-handles";
import { useProduct } from "vtex.product-context";

import ButtonReview from "./ButtonReview";
import AboutRevoo from "./AboutRevoo";

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

export default function ModalReview({ isOpen }) {
  const [openModalReview, setOpenModalReview] = useState(isOpen);
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
    setOpenModalReview(openModalReview);
    noReviews();
  }, [openModalReview]);

  useLayoutEffect(() => {
    noReviews();
  }, [noReviews()]);
  function noReviews() {
    const paginator = document.querySelector("reevoo-embedded-product-reviews");
    if (paginator) {
      if (paginator.querySelector(".explanatory-content")) {
        document.querySelector(
          ".indesituk-custom-apps-0-x-modalSpecialReview__buttonReviewContainer"
        ).style.display = "none";
        document.querySelector(
          ".indesituk-custom-apps-0-x-aboutRevoo__label"
        ).style.display = "none";
        document.querySelector(
          ".explanatory-content > h3"
        ).style.cssText = "font-weight: 400; font-family: 'Roboto'; letter-spacing: 0; text-transform: none;"
      }
    }
  }
  const removeScrollToBodyInVtex = useCallback(() => {
    if (openModalReview) {
      document
        .querySelector("body")
        .classList.add(handles.modalSpecialReview__modalOpenOverflow);
    } else {
      document
        .querySelector("body")
        .classList.remove(handles.modalSpecialReview__modalOpenOverflow);
    }
  }, [openModalReview, handles.modalSpecialReview__modalOpenOverflow]);

  useEffect(() => {
    removeScrollToBodyInVtex();
  }, [openModalReview, removeScrollToBodyInVtex]);

  return (
    <>
      <div className={handles.modalSpecialReview__buttonReviewContainer}>
        <ButtonReview
          onClick={() => {
            setOpenModalReview(!openModalReview);
          }}
        />
      </div>
      <div className={handles.modalSpecialReview__buttonReviewContainer}>
        <AboutRevoo
          onClick={() => {
            setOpenModalReview(!openModalReview);
          }}
        />
      </div>
      <div
        className={classnames(
          handles.modalSpecialReview__background,
          openModalReview ? handles.modalSpecialReview__background__open : ""
        )}
      />
      <div
        className={classnames(
          handles.modalSpecialReview__scroller,
          openModalReview ? handles.modalSpecialReview__scrollerOpen : ""
        )}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpenModalReview(false);
        }}
      >
        <div
          className={classnames(
            handles.modalSpecialReview__container,
            openModalReview ? handles.modalSpecialReview__container__open : ""
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
                setOpenModalReview(!openModalReview);
              }}
            >
              <span className={handles.modalSpecialReview__closeIcon} />
            </button>
          </div>
          {/* Modal content */}
          <div className={handles.modalSpecialReview__contentItems}>
            <reevoo-embedded-product-reviews
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
