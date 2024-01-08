import React from "react";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

export interface CompareButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classes: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
  width: string;
  text: string;
}

const CSS_HANDLES = [
  "compareButton__container",
  "compareButton__label",
  "compareButton__icon",
] as const;

export default function CompareButton({
  classes,
  text = "Compare",
}: CompareButtonProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  return (
    <button className={handles.compareButton__container}>
      <span className={handles.compareButton__label}>{text}</span>
      <span className={handles.compareButton__icon} />
    </button>
  );
}
