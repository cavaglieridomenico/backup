import React from "react";
import { useInterpolatedLink } from "./modules/useInterpolatedLink";
import { AvailableContext } from "./modules/mappings";
// @ts-ignore
import { useProduct } from "vtex.product-context";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import type { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = [
  "repairabilityButton__anchorContainer",
  "repairabilityButton__container",
  "repairabilityButton__image",
  "repairabilityButton__labelCms",
] as const;

interface RepairabilityButtonProps {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
  href: string;
  imagePath: string;
  label: string;
  target?: string;
  escapeLinkRegex?: string;
}

export default function RepairabilityButton({
  classes,
  href,
  imagePath,
  escapeLinkRegex,
  target = "_blank",
}: RepairabilityButtonProps) {
  const productContext = useProduct();

  const { handles } = useCssHandles(CSS_HANDLES, { classes });
  const resolvedLink = useInterpolatedLink(
    href,
    escapeLinkRegex ? new RegExp(escapeLinkRegex, "g") : undefined,
    [
      {
        type: AvailableContext.product,
        context: productContext,
      },
    ]
  );

  const resolvedPathImage = useInterpolatedLink(
    imagePath,
    escapeLinkRegex ? new RegExp(escapeLinkRegex, "g") : undefined,
    [
      {
        type: AvailableContext.product,
        context: productContext,
      },
    ]
  );

  const noSpaceLink = resolvedLink.replace(/ /g, "-");
  const pathImage =
    resolvedPathImage.replace(/ /g, "-").split("?")[0] +
    "?format=PNG&fillcolor=rgba:255,255,255";

  return (
    <div className={handles.repairabilityButton__anchorContainer}>
      <a
        target={target}
        className={handles.repairabilityButton__container}
        href={noSpaceLink}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <img className={handles.repairabilityButton__image} src={pathImage} />
        <span className={handles.repairabilityButton__labelCms}>
          Indice de réparabilité
        </span>
      </a>
    </div>
  );
}
