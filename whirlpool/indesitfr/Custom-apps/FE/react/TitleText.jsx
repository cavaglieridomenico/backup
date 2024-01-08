import React from "react";
import { useCssHandles } from "vtex.css-handles";

export default function TitleText({ title }) {
  const CSS_HANDLES = ["TitleText_containerTitle", "TitleText_title"];

  const { handles } = useCssHandles(CSS_HANDLES);

  return (
    <>
      <div className={handles.TitleText_containerTitle}>
        <h1 className={handles.TitleText_title}>{title}</h1>
      </div>
    </>
  );
}

TitleText.schema = {
  title: "Titolo della landing page",
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Titolo della landing page",
      title: "Primo titolo",
      default: "temporary empty",
    },
  },
};
