import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { useProduct } from "vtex.product-context";
import { canUseDOM } from "vtex.render-runtime";
import { SearchPageContext } from "vtex.search-page-context/SearchPageContext";

const AggregateBreadcrumbList = () => {
  const baseUrl = "https://www.indesit.fr/";
  const productInfo = useProduct();
  const searchQuery = useContext(SearchPageContext);

  let rendered = true;

  if (canUseDOM) {
    const BreadcrumbScript = document.querySelectorAll(
      'script[type="application/ld+json"][data-react-helmet = true]'
    );
    for (let i = 0; i < BreadcrumbScript.length; i++) {
      if (BreadcrumbScript[i] !== null && BreadcrumbScript[i] !== undefined) {
        if (
          BreadcrumbScript[i].innerHTML !== null &&
          BreadcrumbScript[i].innerHTML !== undefined
        ) {
          if (BreadcrumbScript[i].id === "" && BreadcrumbScript.parentNode) {
            BreadcrumbScript[i].parentNode.removeChild(BreadcrumbScript[i]);
          }
        }
      }
    }
  }

  if (productInfo.product !== undefined && rendered) {
    let productSubcategory = productInfo.product.categories[0].split("/")[1];
    let productCategory = productInfo.product.categories[0].split("/")[2];
    let productName = productInfo.product.items[0].complementName;
    let productLink = productInfo.product.linkText;

    rendered = false;

    const fullScript = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "produits",
          item: baseUrl + "produits",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: productSubcategory,
          item: baseUrl + "produits/" + productSubcategory,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: productCategory,
          item:
            baseUrl + "produits/" + productSubcategory + "/" + productCategory,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: productName,
          item: baseUrl + productLink + "/p",
        },
      ],
    };

    return (
      <>
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(fullScript)}
          </script>
        </Helmet>
      </>
    );
  }

  if (searchQuery !== undefined && searchQuery !== null && rendered) {
    let productSubcategory = searchQuery.params.category;
    let productCategory = searchQuery.params.subcategory;

    rendered = false;

    const fullScript = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "produits",
          item: baseUrl + "produits",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: productSubcategory,
          item: baseUrl + "produits/" + productSubcategory,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: productCategory,
          item:
            baseUrl + "produits/" + productSubcategory + "/" + productCategory,
        },
      ],
    };

    return (
      <>
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(fullScript)}
          </script>
        </Helmet>
      </>
    );
  }

  return <></>;
};

export default AggregateBreadcrumbList;
