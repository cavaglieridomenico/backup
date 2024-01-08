import React from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
import { useProduct } from "vtex.product-context";
import { useInterpolatedLink } from "./modules/useInterpolatedLink";

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
  text = "Discover More",
  isButton = false,
  isDiscontinued = false,
}: ButtonPrimaryProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  function formatInterpoletedLink(link: string) {
    if(link.charAt(link.length - 1) === '/') { //If last char / remove it
      return link.replace(/ /g,'-').substring(0,link.length - 1)
    }
    else {
      return link.replace(/ /g,'-')
    }
  }

  function returnToPLP() {
    const product = useProduct();
    let interpolatedLink = formatInterpoletedLink(product.product.categories[0])
    const url = useInterpolatedLink(interpolatedLink);

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
