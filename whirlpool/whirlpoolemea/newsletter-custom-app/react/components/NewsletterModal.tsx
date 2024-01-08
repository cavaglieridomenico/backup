import React, { FC, useEffect, useState } from "react";
import { Modal } from "vtex.styleguide";
// import { useCssHandles } from "vtex.css-handles";
// import { CSS_HANDLES } from "../utils/utils";

interface NewsletterModalProp {
  children: any;
  time?: number;
}

const NewsletterModal: FC<NewsletterModalProp> = ({ children, time }) => {
  // const handles = useCssHandles(CSS_HANDLES);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (time) handleModal();
  }, []);

  const handleModal = () => {
    if (!localStorage.getItem("isAlreadyOpen")) {
      setTimeout(() => {
        setIsModalOpen(true);
        localStorage.setItem("isAlreadyOpen", "true");
      }, time);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <React.Fragment>
      <Modal centered isOpen={isModalOpen} onClose={closeModal}>
        {children}
      </Modal>
    </React.Fragment>
  );
};

export default NewsletterModal;
