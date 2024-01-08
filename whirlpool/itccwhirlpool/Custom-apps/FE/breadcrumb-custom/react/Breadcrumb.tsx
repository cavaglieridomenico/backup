//@ts-nocheck
import React from "react";
import { Link } from "vtex.render-runtime";
import { useCssHandles } from "vtex.css-handles";
import { useRuntime } from "vtex.render-runtime";
import style from "./style.css";
import CustomBreadcrumbStructuredData from "./StructuredData";
import { ProductContext, useProduct } from "vtex.product-context";
import { useDevice } from "vtex.device-detector";

import {
  CSS_HANDLES,
  linkBaseClasses,
  spanBaseClasses,
  breadcrumbObject,
  homeLabel,
  translatedNamePLP,
  translatedNotClickableNamePLP,
} from "./utils/utils";
import { BreadcrumbProps } from "./utils/types";
import { product } from "ramda";

const Breadcrumb: StorefrontFunctionComponent<BreadcrumbProps> = ({}) => {
  const handles = useCssHandles(CSS_HANDLES);
  const productContext = useProduct();
  const { isMobile } = useDevice();
  const { culture } = useRuntime();
  let currentPath = "";
  const categoriesName = () => {
    let mappedCategories = productContext?.product?.categoryTree
      ?.slice(0)
      ?.map((x) => {
        return (breadcrumbObject.name = x.name);
      });
    mappedCategories?.unshift("");
    return mappedCategories;
  };
  const isPDP = productContext?.product ? true : false;
  const getMappedCategories = () => {
    let mappedCategories = productContext?.product?.categories
      ?.slice(0, 3)
      ?.reverse()
      ?.map((x) => {
        let splitCategory = x.split("/").filter(String);
        return splitCategory[splitCategory.length - 1];
      });
    mappedCategories?.unshift("");
    mappedCategories?.push(productContext?.product?.productName as string);
    return mappedCategories;
  };
  const pathArray = isPDP
    ? getMappedCategories()
    : window?.location?.pathname?.split("/");
  let structuredDataArray: any[] = [];
  let categoriesNameLabel = categoriesName();

  let translatedNamePDP = [];
  for (let i = 0; i < categoriesNameLabel?.length; i++) {
    isPDP ? translatedNamePDP.push({ name: categoriesNameLabel[i] }) : null;
  }

  return !isMobile ? (
    <>
      <div className={style.breadcrumbSliderContainer}>
        <div
          data-testid="breadcrumb"
          className={`${handles.container} pv3 ` + style.breadcrumbContainer}
        >
          {
            // @ts-ignore
            pathArray?.length > 0
              ? // @ts-ignore
                pathArray.map((item, index) => {
                  currentPath += index === 1 ? item : "/" + item;
                  breadcrumbObject.href = item === "" ? "/" : currentPath;
                  structuredDataArray?.push({
                    name: breadcrumbObject.name,
                    href: breadcrumbObject.href,
                    __typename: "SearchBreadcrumb",
                  });
                  // @ts-ignore
                  return index !== pathArray?.length - 1 ? (
                    <>
                      <Link
                        className={`${handles.link} ${handles.homeLink} ${linkBaseClasses} ph2 ${style.breadcrumb}`}
                        to={breadcrumbObject.href
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .replace(/ /g, "-")}
                        key={index}
                      >
                        {item === ""
                          ? isPDP && homeLabel
                          : translatedNamePDP[index]?.name.replace("-", " ")}
                        {!isPDP && item === ""
                          ? homeLabel
                          : !isPDP && culture.locale !== "it-IT"
                          ? translatedNamePLP(breadcrumbObject.href).replaceAll(
                              "-",
                              " "
                            )
                          : !isPDP && item.replaceAll("-", " ")}
                      </Link>
                      -
                    </>
                  ) : (
                    <>
                      <span
                        className={`${handles.link} ${spanBaseClasses} `}
                        key={index}
                      >
                        {isPDP
                          ? item.replace(/-/g, " ")
                          : culture.locale !== "it-IT"
                          ? translatedNotClickableNamePLP(item)
                          : item.replace(/-/g, " ")}
                      </span>
                    </>
                  );
                })
              : null
          }
        </div>
      </div>
      {structuredDataArray && (
        <CustomBreadcrumbStructuredData breadcrumb={structuredDataArray} />
      )}
    </>
  ) : null;
};

Breadcrumb.schema = {
  title: "BreadCrumbCustom",
  description: "Custom Breadcrumb",
  type: "object",
  properties: {
    button: {
      title: "Structured Data",
      description: "If the breadcrumb should have structured data or not",
      default: false,
      type: "boolean",
    },
  },
};
export default Breadcrumb;
