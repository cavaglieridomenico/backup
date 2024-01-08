import React from "react";
import ContentLoader from "react-content-loader";
import { Spinner } from "vtex.styleguide";
import { CSS_HANDLES } from "../utils/cssHandles";
import { useCssHandles } from "vtex.css-handles";

interface LoaderProps {
  isCircle: boolean;
  formatLoading: any;
}

const Loader: StorefrontFunctionComponent<LoaderProps> = ({
  isCircle,
  formatLoading,
}) => {
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
      <Spinner size={120} />
    </div>
  );
};

Loader.schema = {
  title: "Timer Component",
  description: "Timer component used to display countdown",
  type: "object",
  properties: {
    size: {
      title: "Size of the Spinner Loader",
      description: "Set size of the Spinner Loader in number (ex. 64)",
      type: "number",
      default: 64,
    },
  },
};

export default Loader;
