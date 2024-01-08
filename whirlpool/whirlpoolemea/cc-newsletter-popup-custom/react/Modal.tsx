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
    if (!isModalOpen) {
      push({
        event: "popupInteraction",
        data: { eventAction: "newsletter-popup", eventLabel: "click" },
      });
      push({
        event: "popupInteraction",
        data: { eventAction: "newsletter-popup", eventLabel: "view" },
      });
    } else {
      push({
        event: "popupInteraction",
        data: { eventAction: "newsletter-popup", eventLabel: "close" },
      });
    }
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

  return (
    <>
      {textButton !== undefined ? (
        <Button onClick={modalClose}>{textButton}</Button>
      ) : null}
      <div id="ciao">
        <Modal centered isOpen={isModalOpen} onClose={modalClose}>
          {children}
        </Modal>
      </div>
    </>
  );
};

export default ModalNewsletter;
