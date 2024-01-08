import React from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

export interface ButtonEnergyClassProps {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
  energyClassImage?: string;
  href?: string;
  isButton?: boolean;
  text?: string;
}

const CSS_HANDLES = [
  "buttonEnergyClass__container",
  "buttonEnergyClass__image",
  "buttonEnergyClass__label",
] as const;

export default function ButtonEnergyClass({
  classes,
  energyClassImage,
  href,
  isButton = false,
  text = "Energy Class",
}: ButtonEnergyClassProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  return isButton ? (
    <button className={handles.buttonEnergyClass__container}>
      <img
        className={handles.buttonEnergyClass__image}
        src={energyClassImage}
      />
      <span className={handles.buttonEnergyClass__label}>{text}</span>
    </button>
  ) : (
    <a
      target="_blank"
      className={handles.buttonEnergyClass__container}
      href={href}
    >
      <img
        className={handles.buttonEnergyClass__image}
        src={energyClassImage}
      />
      <span className={handles.buttonEnergyClass__label}>{text}</span>
    </a>
  );
}
