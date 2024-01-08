import React, { useState } from "react";
import classnames from "classnames";
/* @ts-ignore */
import type { CssHandlesTypes } from "vtex.css-handles";
/* @ts-ignore */
import { useCssHandles } from "vtex.css-handles";

export interface ButtonExperienceARProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className: string;
  disabled: boolean;
  id: string;
  text: string;
  classes: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
}

const CSS_HANDLES = [
  "buttonExperienceAR__container",
  "buttonExperienceAR__container",
  "buttonExperienceAR__label",
  "buttonExperienceAR__icon",
  "modalExperience__background",
  "modalExperience__background__open",
  "modalExperience__container",
  "modalExperience__buttonContainer",
  "modalExperience__buttonClose",
  "modalExperience__closeIcon",
] as const;

export default function ButtonExperienceAR({
  disabled = false,
  id,
  text = "Experience AR",
  classes,
}: ButtonExperienceARProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });
  const [openModalExperience, setOpenModalExperience] = useState(false);

  return (
    <>
      <button
        className={handles.buttonExperienceAR__container + " " + classes}
        disabled={disabled}
        id={id}
        onClick={() => {
          setOpenModalExperience(true);
        }}
      >
        <span className={handles.buttonExperienceAR__icon} />
        <span className={handles.buttonExperienceAR__label}>{text}</span>
      </button>

      <div
        className={classnames(
          handles.modalExperience__background,
          openModalExperience ? handles.modalExperience__background__open : ""
        )}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpenModalExperience(false);
        }}
      >
        <div
          className={handles.modalExperience__container}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className={handles.modalExperience__buttonContainer}>
            <button
              className={handles.modalExperience__buttonClose}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenModalExperience(false);
              }}
            >
              <span className={handles.modalExperience__closeIcon} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
