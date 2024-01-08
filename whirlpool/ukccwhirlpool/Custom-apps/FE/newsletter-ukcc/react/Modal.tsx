import React, { useState, useEffect } from "react";
import { Modal, Button } from "vtex.styleguide";
import { usePixel } from "vtex.pixel-manager";

interface idModal {
  time?: number;
  textButton?: string;
  children?: React.Component;
}

const ModalNewsletter: React.FC<idModal> = ({ children, textButton, time }) => {
  const { push } = usePixel();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalClose = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalToggle = () => {
    if (localStorage.getItem("isAlreadyOpen") == null) {
      setTimeout(() => {
        setIsModalOpen(!isModalOpen);
        localStorage.setItem("isAlreadyOpen", "true");
      }, (time || 1) * 60000);
    }
  };

  useEffect(() => {
    if (time !== undefined) {
      handleModalToggle();
    }
  }, []);

  //GA4FUNREQ60
  const handlePopupEvent = (type: string) => {
    push({ event: "popup", popupId: "newsletter_popup", action: type });
  };

  useEffect(() => {
    if (isModalOpen) {
      handlePopupEvent("view");
    }
  }, [isModalOpen]);

  return (
    <>
      {textButton !== undefined ? (
        <Button onClick={modalClose}>{textButton}</Button>
      ) : null}
      <div onClick={() => handlePopupEvent("click")}>
        <Modal
          centered
          isOpen={isModalOpen}
          onClose={() => {
            modalClose(),
              setTimeout(() => {
                handlePopupEvent("close");
              }, 200);
          }}
        >
          {children}
        </Modal>
      </div>
    </>
  );
};

export default ModalNewsletter;
