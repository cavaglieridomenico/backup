import React, { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { useDevice } from "vtex.device-detector";
import { useCssHandles } from "vtex.css-handles";
import { CSS_HANDLES } from "../utils/utilsFunctions";

const FormSkeleton: FC = () => {
  const { device } = useDevice();
  const handles = useCssHandles(CSS_HANDLES);

  return (
    <div className={`flex justify-center items-center w-100`}>
      {/* Phone */}
      {device === 'phone' &&
        <Skeleton
          count={1}
          containerClassName={`${handles.skeleton__wrapper}`}
          className={`${handles.skeleton}`}
          style={{ height: "580px" }}
        />
      }
      {/* Tablet */}
      {device === 'tablet' &&
        <Skeleton
          count={1}
          containerClassName={`${handles.skeleton__wrapper}`}
          className={`${handles.skeleton}`}
          style={{ height: "400px" }}
        />
      }
      {/* Desktop */}
      {device === 'desktop' &&
        <Skeleton
          count={1}
          containerClassName={`${handles.skeleton__wrapper}`}
          className={`${handles.skeleton}`}
          style={{ height: "340px" }}
        />
      }
    </div>
  );  
};

export default FormSkeleton;
