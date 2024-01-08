import React from "react";
import ContentLoader from "react-content-loader";
import { Spinner } from "vtex.styleguide";
import { CSS_HANDLES } from "./cssHandles";
import { useCssHandles } from "vtex.css-handles";

export const getLoader = (isCircle: boolean, formatLoading: any) => {
  const handles = useCssHandles(CSS_HANDLES);

  return !isCircle ? (
    /* SKELETON */
    <div className={`${handles.container__loader} ${handles.loader__width}`}>
      <ContentLoader
        width="100%"
        speed={1}
        height="100%"
        viewBox={`0 0 ${formatLoading.width} ${formatLoading.height}`}
      >
        <rect
          x="0"
          y="0"
          rx="3"
          ry="3"
          width={formatLoading.width}
          height={formatLoading.height}
        />
      </ContentLoader>
    </div>
  ) : (
    /* SPINNER */
    <div className="flex justify-center items-center w-100">
      <Spinner size={64} />
    </div>
  );
};
