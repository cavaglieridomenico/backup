import React, { useState, useEffect } from "react";
import { Link } from "vtex.render-runtime";
import { useQuery } from "react-apollo";
import getProduct from "./graphql/getProduct.graphql";
import { CSS_HANDLES, linkBaseClasses } from "./utils/utils";
import { useCssHandles } from "vtex.css-handles";
import style from "./style.css";

interface BreadcrumbPdpProps {}

interface Category {
  name: string;
  href: string;
}

interface Breadcrumb {
  label: string;
  url: string;
}

const BreadcrumbPdp: React.FC<BreadcrumbPdpProps> = ({}) => {
  const handles = useCssHandles(CSS_HANDLES);

  const slug = window?.location?.pathname?.match(/^\/?([\w-]*)(\/p)?$/)?.[1];

  const [breadCrumb, setBreadCrumb] = useState([
    {
      label: "Home",
      url: "/",
    },
  ]);

  const { data } = useQuery(getProduct, {
    variables: {
      identifier: { field: "slug", value: slug },
    },
  });

  useEffect(() => {
    if (data?.product) {
      //BreadCrumb set composed by Home, categories and product name
      setBreadCrumb([
        ...breadCrumb,
        ...data?.product?.categoryTree?.map((category: Category) => ({
          label: category.name,
          url: category.href,
        })),
        { label: data?.product?.productName, url: "" },
      ]);
    }
  }, [data]);

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

export default BreadcrumbPdp;
