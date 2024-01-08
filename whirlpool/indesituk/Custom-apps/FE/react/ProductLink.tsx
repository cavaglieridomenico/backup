import React, { useState, useEffect } from "react";
import classnames from "classnames";
// @ts-ignore
import { Link } from "vtex.render-runtime";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
// @ts-ignore
import { ModalContext } from "vtex.modal-layout";
// @ts-ignore
import { useProduct } from "vtex.product-context";

import { Props, defaultButtonProps } from "./StoreLink";
import hasChildren from "./modules/hasChildren";
import { AvailableContext } from "./modules/mappings";
import useButtonClasses from "./modules/useButtonClasses";
import { useInterpolatedLink } from "./modules/useInterpolatedLink";

const { useModalDispatch } = ModalContext;

const CSS_HANDLES = [
  "linkContainer",
  "link",
  "label",
  "childrenContainer",
  "buttonLink",
] as const;

function ProductLink(props: Props) {
  const {
    label,
    href,
    escapeLinkRegex,
    children,
    target,
    displayMode = "anchor",
    buttonProps = defaultButtonProps,
  } = props;
  const productContext = useProduct();
  const handles = useCssHandles(CSS_HANDLES);
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

  const modalDispatch = useModalDispatch();

  const {
    size = defaultButtonProps.size,
    variant = defaultButtonProps.variant,
  } = buttonProps;
  const classes = useButtonClasses({ variant, size });
  const [shouldReplaceUrl, setShouldReplaceUrl] = useState(
    Boolean(modalDispatch)
  );

  useEffect(() => {
    // if the link is in a modal it should replace the url instead of just pushing a new one
    setShouldReplaceUrl(Boolean(modalDispatch));
  }, [modalDispatch]);

  const rootClasses = classnames(handles.link, {
    [`${handles.buttonLink} ${classes.container}`]: displayMode === "button",
  });

  const labelClasses = classnames(handles.label, {
    [classes.label]: displayMode === "button",
  });

  const handlePrevent = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const noSpaceLink = resolvedLink.replace(/ /g, "-");

  return (
    <div onClick={handlePrevent} className={handles.linkContainer}>
      <Link
        style={{ textDecoration: "none" }}
        target={target}
        to={noSpaceLink}
        className={rootClasses}
        replace={shouldReplaceUrl}
      >
        {label && <span className={labelClasses}>{label}</span>}
        {hasChildren(children) && displayMode === "anchor" && (
          <div className={handles.childrenContainer}>{children}</div>
        )}
      </Link>
    </div>
  );
}

ProductLink.schema = { title: "admin/editor.product-link.title" };

export default ProductLink;
