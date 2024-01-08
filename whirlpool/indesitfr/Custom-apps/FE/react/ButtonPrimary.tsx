//@ts-ignore
import React from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
// @ts-ignore
import { useProduct } from "vtex.product-context";

export interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled: boolean;
  id: string;
  text: string;
  href: string;
  width: string;
  isButton: boolean;
  hasTargetBlank: boolean;
  classes: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
  isDiscontinued: boolean;
}

const CSS_HANDLES = [
  "buttonPrimary__container",
  "buttonPrimary__label",
] as const;

export default function ButtonPrimary({
  classes,
  disabled = false,
  id,
  hasTargetBlank = true,
  width = "max-content",
  href,
  text = "En savoir plus",
  isButton = false,
  isDiscontinued = false,
}: ButtonPrimaryProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  function returnToPLP() {
    const product = useProduct();
    const path =
      product.product.categories[0].split("/")[1] +
      "/" +
      product.product.categories[0].split("/")[2];
    const category = product.product.categories[0]
      .split("/")[3]
      .replace(/\s+/g, "-")
      .replace(/[èé]/g, "e");
    const url = window.location.origin + "/" + path + "/" + category;
    return url;
  }

  return isButton ? (
    <button
      className={handles.buttonPrimary__container}
      disabled={disabled}
      id={id}
      style={{ width }}
    >
      <span className={handles.buttonPrimary__label}>{text}</span>
    </button>
  ) : (
    <div id={id} className={handles.buttonPrimary__container} style={{ width }}>
      <a
        className={handles.buttonPrimary__label}
        href={isDiscontinued ? returnToPLP() : href}
        target={hasTargetBlank ? "_blank" : undefined}
      >
        {text}
      </a>
    </div>
  );
}
