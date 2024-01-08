import React from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

export interface ButtonEnergyClassCarouselProps {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
  energyClassImage?: string;
  href?: string;
  isButton?: boolean;
  text?: string;
}

const CSS_HANDLES = [
  "buttonEnergyClassCarousel__container",
  "buttonEnergyClassCarousel__image",
  "buttonEnergyClassCarousel__label",
] as const;

export default function ButtonEnergyClassCarousel({
  classes,
  energyClassImage,
  href,
  isButton = false,
  text = "Energy Class",
}: ButtonEnergyClassCarouselProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  return isButton ? (
    <button className={handles.buttonEnergyClassCarousel__container}>
      <img
        className={handles.buttonEnergyClassCarousel__image}
        src={energyClassImage}
      />
      <span className={handles.buttonEnergyClassCarousel__label}>{text}</span>
    </button>
  ) : (
    <a
      target="_blank"
      className={handles.buttonEnergyClassCarousel__container}
      href={href}
    >
      <img
        className={handles.buttonEnergyClassCarousel__image}
        src={energyClassImage}
      />
      <span className={handles.buttonEnergyClassCarousel__label}>{text}</span>
    </a>
  );
}
