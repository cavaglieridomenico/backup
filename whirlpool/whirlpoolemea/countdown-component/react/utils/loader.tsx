import React from "react";
import ContentLoader from "react-content-loader";
export const getLoader = (
  style: any,
  isCircle: boolean,
  formatLoading: any
) => {
  if (!isCircle) {
    return (
      <div className={style.containerLoader + " " + style.loaderWidth}>
        <ContentLoader
          width="100%"
          speed={1}
          height="100%"
          viewBox={"0 0 " + formatLoading.width + " " + formatLoading.height}
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
    );
  } else {
    return (
      <div
        className={style.loaderForm}
        style={{ width: formatLoading.width, height: formatLoading.height }}
      ></div>
    );
  }
};
