import React, { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { useDevice } from "vtex.device-detector";
import { useCssHandles } from "vtex.css-handles";
import { CSS_HANDLES } from "../utils/utilsFunction";

const FormSkeleton: FC = (

) => {
  const { isMobile } = useDevice();
  const handles = useCssHandles(CSS_HANDLES);

  return isMobile ? (
        <Skeleton
          count={1}
          containerClassName={`${handles.skeleton__wrapper}`}
          className={`${handles.skeleton}`}
          style={{ height: "360px", width: "320px" }}
        />
      ) : (
        <Skeleton
          count={1}
          containerClassName={`${handles.skeleton__wrapper}`}
          className={`${handles.skeleton}`}
          style={{ height: "295px", width: "525px" }}
        />
      );
};

export default FormSkeleton;
