import React, { useState } from "react";
import { Link } from "vtex.render-runtime";
import { CSS_HANDLES, linkBaseClasses } from "./utils/utils";
import { useCssHandles } from "vtex.css-handles";
import style from "./style.css";

interface BreadcrumbPagesProps {}

interface Breadcrumb {
  label: string;
  url: string;
}

const BreadcrumbPages: React.FC<BreadcrumbPagesProps> = ({}) => {
  const handles = useCssHandles(CSS_HANDLES);
  const [breadCrumb, setBreadCrumb] = useState([
    {
      label: "Home",
      url: "/",
    },
  ]);

  const urlSplitted = window?.location?.pathname
    ?.split("/")
    .filter((location) => location != "");

  const urlBreadCrumb = urlSplitted?.reduce(
    (acc: any, cur: any) => [
      ...acc,
      {
        label: cur[0].toUpperCase() + cur.slice(1),
        url: `${acc.length ? acc[acc?.length - 1].url : ""}/${cur}`,
      },
    ],
    []
  );

  if (breadCrumb.length <= 1) {
    urlBreadCrumb && setBreadCrumb([...breadCrumb, ...urlBreadCrumb]);
  }

  return (
    <div className={style.breadcrumbSliderContainer}>
      <div
        data-testid="breadcrumb"
        className={`${handles.container} pv3 ` + style.breadcrumbContainer}
      >
        <>
          {breadCrumb.length > 1 &&
            breadCrumb?.map((breadcrumb: Breadcrumb, index: number) => (
              <>
                {index != breadCrumb?.length - 1 ? (
                  <>
                    {
                      // @ts-ignore
                      <Link
                        className={`${handles.link} ${handles.homeLink} ${linkBaseClasses} ph2 ${style.breadcrumb}`}
                        to={breadcrumb?.url}
                        key={index}
                      >
                        {breadcrumb?.label}
                      </Link>
                    }
                    <span> - </span>
                  </>
                ) : (
                  <span
                    className={`${handles.link} ${handles.homeLink} ${linkBaseClasses} ph2 ${style.breadcrumbNolink}`}
                  >
                    {breadcrumb?.label}
                  </span>
                )}
              </>
            ))}
        </>
      </div>
    </div>
  );
};

export default BreadcrumbPages;
