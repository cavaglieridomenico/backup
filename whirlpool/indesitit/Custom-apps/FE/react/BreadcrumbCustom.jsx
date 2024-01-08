import React from "react";
import { Link } from "vtex.render-runtime";
import { useCssHandles } from "vtex.css-handles";

export default function BreadcrumbCustom({
  blockClass,
  firstPage,
  previousPage,
  previousPath,
  currentPage,
  currentPath
}) {
  const CSS_HANDLES = [
    "breadCrumbCustom__blockClass",
    "breadCrumbCustom__parentsContainerBreadcrumbs",
    "breadCrumbCustom__link",
  ];
  const { handles } = useCssHandles(CSS_HANDLES);

  let fullPath = "";

  //Condizione per utilizzare il currentPage al primo livello senza doverla dichiarare come previousPage
  if (previousPage === undefined) {
    //Sostituisco i valori
    (previousPage = currentPage), (previousPath = currentPath);
    //Riporto a zero i valori
    currentPage = undefined;
    currentPath = undefined;
  } else {
    fullPath = previousPath + currentPath;
  }

  return (
    <>
      <div className={handles.breadCrumbCustom__blockClass}>
        <div className={handles.breadCrumbCustom__parentsContainerBreadcrumbs}>
          <Link className={handles.breadCrumbCustom__link} href="/">
            {firstPage}
          </Link>
            {/* Breadcrumb secondo livello */}
            <span class="vtex-breadcrumb-1-x-arrow vtex-breadcrumb-1-x-arrow--3 ph2 c-muted-2">
            <svg fill="none" width="8" height="8" viewBox="0 0 16 16" class=" vtex-breadcrumb-1-x-caretIcon" xmlns="http://www.w3.org/2000/svg" >
              <use href="#nav-caret--right" ></use>
            </svg>
          </span>
          {/* Page secondo livello */}
          <Link className={handles.breadCrumbCustom__link} href={previousPath}>
            {previousPage}
          </Link>
          {/* Stampo il testo solo se presente */}
          {currentPage != undefined && (
          <span class="vtex-breadcrumb-1-x-arrow vtex-breadcrumb-1-x-arrow--3 ph2 c-muted-2">
            <svg fill="none" width="8" height="8" viewBox="0 0 16 16" class=" vtex-breadcrumb-1-x-caretIcon" xmlns="http://www.w3.org/2000/svg" >
              <use href="#nav-caret--right" ></use>
            </svg>
            <span className={handles.breadCrumbCustom__link}>{currentPage}</span>
          </span>
          )}
        </div>
      </div>
    </>
  );
}

BreadcrumbCustom.schema = {
  title: "edit breadcrumb",
  type: "object",
  properties: {
    currentPage:{
      title:"last breadcrumb label",
      type:"string"
    }
  }
};
