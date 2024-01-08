import React from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

export interface ButtonSpecialProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  id?: string;
  text?: string;
  href?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: any;
  isButton?: boolean;
  hasTargetBlank?: boolean;
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
}

const CSS_HANDLES = [
  "buttonSpecial__container",
  "buttonSpecial__iconBuy",
  "buttonSpecial__label",
] as const;

export default function ButtonSpecial({
  disabled = false,
  id,
  classes,
  text = "Buy online",
  onClick,
  isButton = true,
  href,
  hasTargetBlank = true,
}: ButtonSpecialProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  return isButton ? (
    <button
      className={handles.buttonSpecial__container}
      disabled={disabled}
      id={id}
      onClick={onClick}
    >
      <span className={handles.buttonSpecial__iconBuy} />
      <span className={handles.buttonSpecial__label}>{text}</span>
    </button>
  ) : (
    <a
      href={href}
      id={id}
      onClick={onClick}
      className={handles.buttonSpecial__container}
      target={hasTargetBlank ? "_blank noopener" : undefined}
    >
      <span className={handles.buttonSpecial__iconBuy} />
      <span className={handles.buttonSpecial__label}>{text}</span>
    </a>
  );
}
