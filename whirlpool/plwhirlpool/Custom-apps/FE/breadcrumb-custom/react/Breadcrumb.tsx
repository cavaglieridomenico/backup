//@ts-nocheck
import React from 'react';
import { Link } from 'vtex.render-runtime';
import { useCssHandles } from 'vtex.css-handles';
import CustomBreadcrumbStructuredData from "./StructuredData";
import { useProduct } from 'vtex.product-context'

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
  
  let currentPath = ""
  const isPDP = productContext?.product ? true : false
  const isDiscontinuedOrUnsellable = isPDP ? 
    productContext?.product?.specificationGroups?.find(item => item.originalName === "Other")?.specifications?.some(item => (item?.originalName === "isDiscontinued" && item?.values[0] === "true") || (item?.originalName === "sellable" && item?.values[0] === "false")) 
    : 
    false
  
  const getMappedCategories = () => {
    let mappedCategories = isDiscontinuedOrUnsellable ? 
    productContext?.product?.categories?.slice(0)?.map((x)=> {
      let splitCategory = x.split("/").filter(String)
      return splitCategory[splitCategory.length-1] 
    })
    :
    productContext?.product?.categories?.slice(0)?.reverse()?.map((x)=> {
      let splitCategory = x.split("/").filter(String)
      return splitCategory[splitCategory.length-1] 
    })
    mappedCategories?.unshift("")
    mappedCategories?.push(productContext?.product?.productName as string)
    return mappedCategories
  }

  const pathArray = isPDP ? getMappedCategories() : window?.location?.pathname?.split("/")
  let structuredDataArray:any[] = [];

  return (
    <>
      <div className={handles.sliderContainer}>
        <div data-testid="breadcrumb" className={`${handles.container} pv3 `}>
          {pathArray?.length > 0 ? 
            pathArray.map((item, index) => {
              currentPath += index === 1 ? item : "/" + item
              breadcrumbObject.name = item === "" ? homeLabel : item
              breadcrumbObject.href = item === "" ? "/": currentPath.replace(/[ ]/g,"-")
              structuredDataArray?.push({
                name: breadcrumbObject.name,
                href: breadcrumbObject.href,
                __typename: "SearchBreadcrumb"
              })

              return (index !== pathArray?.length-1) ? 
                <>
                  <Link className={`${handles.link} ${linkBaseClasses} ph2`} to={breadcrumbObject.href} key={index}>
                    {breadcrumbObject?.name?.replace(/-/g, " ")}
                  </Link>
                  <img src="https://plwhirlpool.vteximg.com.br/arquivos/arrowIconBread.svg" alt="caret icon" key={index} style={{opacity: '20%'}}></img> 
                  {/* - */}
                </>
                :
                <>
                  <span className={`${handles.term} ${spanBaseClasses} ` } key={index}>
                    {item.replace(/-/g, " ")}
                  </span>
                </>
            })
            : 
            null
          }
        </div>
      </div>
      {structuredDataArray && <CustomBreadcrumbStructuredData breadcrumb={structuredDataArray} />}
    </>
  )
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
