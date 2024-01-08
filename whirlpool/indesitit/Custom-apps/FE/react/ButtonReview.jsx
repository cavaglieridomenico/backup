import React from "react";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = ["buttonReview__container", "buttonReview__label"];

const ButtonReview = ({ onClick }) => {
  const { handles } = useCssHandles(CSS_HANDLES);

  return (
    <button className={handles.buttonReview__container} onClick={onClick}>
      <span className={handles.buttonReview__label}>Read more reviews</span>
    </button>
  );
};

export default ButtonReview;
