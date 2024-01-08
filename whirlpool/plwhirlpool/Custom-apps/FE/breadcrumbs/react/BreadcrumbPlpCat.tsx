import React from "react";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import Helmet from "react-helmet";
import { useCssHandles } from "vtex.css-handles";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";

type BreadcrumbPlpCatProps = {
  firstLevelName: string;
  secondLevelName: string;
  secondLevelHref: string;
  thirdLevelName: string;
};

const CSS_HANDLES = ["catLink", "arrowImg", "catBold"];

const BreadcrumbPlpCat: StorefrontFunctionComponent<BreadcrumbPlpCatProps> = () => {
  const handles = useCssHandles(CSS_HANDLES);
  const { searchQuery } = useSearchPage();
  console.log("searchQuery", searchQuery);
  //GET CATEGORIES WITHOUT PRE-PLP
  const catNoPrePlp = require("./utils/categoriesWithoutPrePlp.js");
  const categoriesNoPrePlp = catNoPrePlp.default;
  const categoryToCheck = searchQuery?.variables?.selectedFacets[2]?.value;
  const category = searchQuery?.variables?.selectedFacets[2]?.value.replace(
    /-/g,
    " "
  );
  const prePlp = searchQuery?.variables?.selectedFacets[1]?.value;
  const baseUrl = window?.location?.protocol + "//" + window.location?.hostname;
  const prePlpUrl = "/" + searchQuery?.variables?.selectedFacets[2]?.value;
  const completeUrl = window.location?.href;
  console.log("category", category);

  useEffect(() => {
    localStorage.setItem("cat", categoryToCheck);
  }, []);

  return categoriesNoPrePlp?.indexOf(categoryToCheck) < 0 ? ( //it means that this category has prePlp
    <>
      <Helmet>
        <script type="application/ld+json">
          {`
          {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Strona główna",
              "item": "` +
            baseUrl +
            `"
            },{
              "@type": "ListItem",
              "position": 2,
              "name": "` +
            prePlp +
            `",
              "item": "` +
            baseUrl +
            prePlpUrl +
            `"
            },{
              "@type": "ListItem",
              "position": 3,
              "name": "` +
            category +
            `",
              "item": "` +
            completeUrl +
            `"
            }]
          }
        `}
        </script>
      </Helmet>
      <div>
        <a className={handles.catLink} href={"/"}>
          Home
        </a>
        <img
          className={handles.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a className={handles.catLink} href={prePlpUrl}>
          {prePlp}
        </a>
        <img
          className={handles.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a className={handles.catBold}>{category}</a>
      </div>
    </>
  ) : (
    <>
      <Helmet>
        <script type="application/ld+json">
          {`
          {
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Strona główna",
              "item": "` +
            baseUrl +
            `"
            },{
              "@type": "ListItem",
              "position": 2,
              "name": "` +
            category +
            `",
              "item": "` +
            completeUrl +
            `"
            }]
          }
        `}
        </script>
      </Helmet>
      <div>
        <a className={handles.catLink} href={"/"}>
          <FormattedMessage id="store/breadcrumbs.home-label"></FormattedMessage>
        </a>
        <img
          className={handles.arrowImg}
          src={
            "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
          }
        />
        <a className={handles.catBold}>{category}</a>
      </div>
    </>
  );
};

export default BreadcrumbPlpCat;
