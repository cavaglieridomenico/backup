import React, { useState } from "react";
import { useProduct } from "vtex.product-context";
import { useCssHandles } from "vtex.css-handles";

import ModalReviewWithoutButtons from "./ModalReviewWithoutButtons";
import ModalReviewWithoutButtonsAao from "./ModalReviewWithoutButtonsAao";

export default function ReevooBadgeDesk() {
  const CSS_HANDLES = [
    "reevooDesk__container",
    "readsReviewsDesk__container",
    "askAnOwnerDesk__container",
    "overButtonReevooReviews_style",
    "overButtonReevooAao_style",
  ];

  const { handles } = useCssHandles(CSS_HANDLES);
  const [openModal, setOpenModal] = useState(false);
  const [isAao, setIsAao] = useState(false);
  const { product } = useProduct();
  const productFcode = product.items[0].name;

  function selectAao() {
    const timeout = setInterval(() => {
      const paginator = document.querySelector("reevoo-embeddable");

      if (paginator) {
        if (paginator.shadowRoot) {
          if (
            paginator.shadowRoot.querySelector(".c_i.ah_iy.ah_hw.ah_ib.ah_il")
          ) {
            paginator.shadowRoot
              .querySelectorAll(".c_i.ah_iy.ah_hw.ah_ib.ah_il")
              .item(1)
              .click();
            clearInterval(timeout);
          }
        }
      }
    }, 300);
  }

  const closeModal = () => {
    setIsAao(false);
    setOpenModal(false);
  };

  return (
    <>
      <div className={handles.reevooDesk__container}>
        <div className={handles.readsReviewsDesk__container}>
          <div>
            <button
              className={handles.overButtonReevooReviews_style}
              onClick={(e) => {
                e.preventDefault();
                setOpenModal(!openModal);
              }}
            />
            <reevoo-badge
              click-action="no_action"
              type="product"
              variant="badge_2_longer"
              product-id={productFcode}
            />
          </div>
        </div>

        {/* <h3> badge_3_longer</h3> */}
        <div className={handles.askAnOwnerDesk__container}>
          <div>
            <button
              className={handles.overButtonReevooAao_style}
              onClick={(e) => {
                e.preventDefault();
                setIsAao(!isAao);
                selectAao();
              }}
            />
            <reevoo-badge
              type="aao"
              variant="badge_3_longer"
              product-id={productFcode}
            />
          </div>
        </div>
      </div>

      {openModal && (
        <ModalReviewWithoutButtons
          isOpenProduct={openModal}
          closeModal={closeModal}
        />
      )}

      {isAao && (
        <ModalReviewWithoutButtonsAao
          isOpenAao={isAao}
          closeModal={closeModal}
        />
      )}
    </>
  );
}
