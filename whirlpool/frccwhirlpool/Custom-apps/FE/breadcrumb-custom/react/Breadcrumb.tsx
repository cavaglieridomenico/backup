//@ts-nocheck
import React from 'react';
import { Link } from 'vtex.render-runtime';
import { useCssHandles } from 'vtex.css-handles';
import style from './style.css'
import CustomBreadcrumbStructuredData from "./StructuredData";
import { useProduct } from 'vtex.product-context'
import { useDevice } from 'vtex.device-detector'

import {
  CSS_HANDLES,
  linkBaseClasses,
  spanBaseClasses,
  breadcrumbObject,
  homeLabel,
} from './utils/utils';
import { BreadcrumbProps } from './utils/types';

const Breadcrumb: StorefrontFunctionComponent<BreadcrumbProps> = ({ }) => {
  const handles = useCssHandles(CSS_HANDLES);
  const productContext = useProduct()
  const { isMobile } = useDevice()

  let currentPath = ""
  // const pathArray = window?.location?.pathname?.split("/")
  const isPDP = productContext?.product ? true : false
  const getMappedCategories = () => {
    let isAccessory = false
    let mappedCategories = productContext?.product?.categories?.slice(0)?.reverse()?.map((x)=> {
      if(x.search("accessoires") > 0) {
        isAccessory = true
      }
      let splitCategory = x.split("/").filter(String)
      return splitCategory[splitCategory.length-1] 
    })
    console.log("isAccessory is: %s", isAccessory)
    if(isAccessory) {
      mappedCategories = ["", "accessoires", productContext?.product?.productName as string]
    } else {
      mappedCategories?.unshift("")
      mappedCategories?.push(productContext?.product?.productName as string)
      console.log("This is mappedCategories: %o", mappedCategories)
    }
    return mappedCategories
  }
  const pathArray = isPDP? getMappedCategories() : window?.location?.pathname?.split("/")
  // console.log("This is pathArray: %o", pathArray)
  let structuredDataArray:any[] = [
  ];

  return !isMobile ? (
    <>
      <div className={style.breadcrumbSliderContainer}>
        <div data-testid="breadcrumb" className={`${handles.container} pv3 ` + style.breadcrumbContainer}>
        {
        // @ts-ignore
        pathArray?.length > 0 ? 
        // @ts-ignore
        pathArray.map((item, index) => {
        currentPath += index === 1 ? item : "/" + item
        breadcrumbObject.name = item === "" ? homeLabel : item
        breadcrumbObject.name === "accessoires" ? "accessoires" : item
        breadcrumbObject.href = item === "" ? "/": currentPath
        structuredDataArray?.push({
          name: breadcrumbObject.name,
          href: breadcrumbObject.href,
          __typename: "SearchBreadcrumb"
        })
              return (index !== pathArray?.length-1) ? 
            <>
              <Link className={`${handles.link} ${handles.homeLink} ${linkBaseClasses} ph2 ${style.breadcrumb}`} to={breadcrumbObject.href.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-")} key={index}>
              {/* x = x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-") */}
                {breadcrumbObject?.name}
              </Link>
              {/* <img src="https://frccwhirlpool.vtexassets.com/arquivos/arrowIconBread.png" alt="caret icon" key={index}className={style.arrowIconBread}></img>  */}
              -
            </>
            :
            <>
              <span className={`${handles.link} ${spanBaseClasses} ` } key={index}>
                {item.replace(/-/g, " ")}
              </span>
            </>
          })
          : null}
        </div>
      </div>
      {structuredDataArray && <CustomBreadcrumbStructuredData breadcrumb={structuredDataArray} />}
    </>
  ): null
}

Breadcrumb.schema = {
  title: 'BreadCrumbCustom',
  description: 'Custom Breadcrumb',
  type: 'object',
  properties: {  
    button: {
      title: "Structured Data",
      description: "If the breadcrumb should have structured data or not",
      default: false,
      type: "boolean",
    }
  }
}
export default Breadcrumb
