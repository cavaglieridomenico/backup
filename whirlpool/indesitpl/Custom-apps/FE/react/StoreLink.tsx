import React, { useState, useEffect } from "react";
import classnames from "classnames";
// @ts-ignore
import { Link } from "vtex.render-runtime";
import { defineMessages, useIntl } from "react-intl";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
// @ts-ignore
import { ModalContext } from "vtex.modal-layout";
// @ts-ignore
import { formatIOMessage } from "vtex.native-types";

import hasChildren from "./modules/hasChildren";
import useButtonClasses, { Variant } from "./modules/useButtonClasses";
import { useInterpolatedLink } from "./modules/useInterpolatedLink";

type DisplayMode = "anchor" | "button";
type Size = "small" | "regular" | "large";

export interface ButtonProps {
  variant: Variant;
  size: Size;
}

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];

interface AllProps {
  href: string;
  label: string;
  target?: string;
  scrollTo?: string;
  escapeLinkRegex?: string;
  children: React.ReactNode;
  displayMode?: DisplayMode;
  buttonProps?: Partial<ButtonProps>;
}

export type Props = RequireOnlyOne<AllProps, "label" | "children">;

defineMessages({
  labelTitle: {
    id: "admin/editor.link.label.title",
    defaultMessage: "",
  },
});

export const defaultButtonProps: ButtonProps = {
  variant: "primary",
  size: "regular",
};

const { useModalDispatch } = ModalContext;
const CSS_HANDLES = [
  "linkContainer",
  "link",
  "label",
  "childrenContainer",
  "buttonLink",
];

function StoreLink(props: Props) {
  const {
    label,
    href,
    target,
    children,
    buttonProps = defaultButtonProps,
    scrollTo,
    displayMode = "anchor",
  } = props;
  const { variant, size } = {
    ...defaultButtonProps,
    ...buttonProps,
  };
  const intl = useIntl();
  const handles = useCssHandles(CSS_HANDLES);
  const modalDispatch = useModalDispatch();
  const classes = useButtonClasses({ variant, size });
  const resolvedLink = useInterpolatedLink(href);

  const [shouldReplaceUrl, setShouldReplaceUrl] = useState(
    Boolean(modalDispatch)
  );

  useEffect(() => {
    setShouldReplaceUrl(Boolean(modalDispatch));
  }, [modalDispatch]);

  const rootClasses = classnames(handles.link, {
    [`${handles.buttonLink} ${classes.container}`]: displayMode === "button",
  });

  const labelClasses = classnames(handles.label, {
    [classes.label]: displayMode === "button",
  });

  const scrollOptions = scrollTo ? { baseElementId: scrollTo } : undefined;

  const localizedLabel = formatIOMessage({ id: label, intl });

  const handlePrevent = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <div onClick={handlePrevent} className={handles.linkContainer}>
      <Link
        style={{ textDecoration: "none" }}
        to={resolvedLink}
        target={target}
        className={rootClasses}
        replace={shouldReplaceUrl}
        scrollOptions={scrollOptions}
        onClick={handlePrevent}
      >
        {label && <span className={labelClasses}>{localizedLabel}</span>}
        {hasChildren(children) && (
          <div className={handles.childrenContainer}>{children}</div>
        )}
      </Link>
    </div>
  );
}

StoreLink.schema = {
  title: "Link",
};

export default StoreLink;
