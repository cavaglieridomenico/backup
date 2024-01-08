import React from 'react';
import { Link } from 'vtex.render-runtime';
import { useCssHandles } from 'vtex.css-handles';
import style from './style.css'
import CustomBreadcrumbStructuredData from "./StructuredData";
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext';
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
  const { searchQuery } = useSearchPage();
  console.log(searchQuery)

  const pathArray = window?.location?.pathname?.split("/")

let currentPath = ""

  let structuredDataArray:any[] = [
  ];

  return (
    <>
      <div className={style.breadcrumbSliderContainer}>
        <div data-testid="breadcrumb" className={`${handles.container} pv3 ` + style.breadcrumbContainer}>
        {  pathArray?.length > 0 ? 
            pathArray.map((item, index) => {
              currentPath += index === 1 ? item : "/" + item
              console.log(currentPath, " currentPath")
              breadcrumbObject.name = item === "" ? homeLabel : item
              breadcrumbObject.href = item === "" ? "/": currentPath
              structuredDataArray.push({
                name: breadcrumbObject.name,
                href: breadcrumbObject.href,
                __typename: "SearchBreadcrumb"
              })
              return (index !== pathArray?.length-1) ? 
            <>
              <Link className={`${handles.link} ${handles.homeLink} ${linkBaseClasses} ph2 ${style.breadcrumb}`} to={breadcrumbObject.href} key={index}>
                {breadcrumbObject.name.replace(/-/g, " ")}
              </Link>
              <img src="https://frwhirlpool.vteximg.com.br/arquivos/arrowIconBread.svg" alt="caret icon" key={index}></img>
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
  )
}

Breadcrumb.schema = {
  title: 'BreadCrumbCustom',
  description: 'Custom Breadcrumb',
  type: 'object',
  properties: {},
}
export default Breadcrumb
