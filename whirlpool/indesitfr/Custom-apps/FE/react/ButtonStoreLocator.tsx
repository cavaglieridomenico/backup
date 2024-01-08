import React from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

export interface ButtonStoreLocatorProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  text: string;
  href: string;
  hasTargetBlank: boolean;
  onClick: any;
  classes: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
}

const CSS_HANDLES = [
  "ButtonStoreLocator__anchorContainer",
  "ButtonStoreLocator__container",
  "ButtonStoreLocator__iconLocator",
  "ButtonStoreLocator__label",
] as const;

export default function ButtonStoreLocator({
  id,
  classes,
  text = "Trouver un revendeur",
  href,
  hasTargetBlank = true,
  onClick,
}: ButtonStoreLocatorProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  return (
    <div className={handles.ButtonStoreLocator__anchorContainer}>
      <a
        id={id}
        className={handles.ButtonStoreLocator__container}
        href={href}
        target={hasTargetBlank ? "_blank" : undefined}
        onClick={(e) => {
          e.stopPropagation();
          onClick;
        }}
      >
        <span className={handles.ButtonStoreLocator__iconLocator} />
        <span className={handles.ButtonStoreLocator__label}>{text}</span>
      </a>
    </div>
  );
}
