import React from "react";
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = ["aboutRevoo__label"];

const AboutRevoo = ({ onClick }) => {
  const { handles } = useCssHandles(CSS_HANDLES);

  return (
    <label
      style={{ cursor: "pointer" }}
      className={handles.aboutRevoo__label}
      onClick={onClick}
    >
      About Reevoo
    </label>
  );
};

export default AboutRevoo;
