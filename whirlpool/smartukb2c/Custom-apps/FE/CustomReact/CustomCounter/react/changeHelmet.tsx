//@ts-nocheck
import React, { useContext } from 'react'
import { ProductContext } from 'vtex.product-context';


import { Helmet } from 'react-helmet'


function changeHelmet() {

  const valuesFromContext = useContext(ProductContext)

  const product = valuesFromContext;


  const capitalizeWords = (sentence) => {
    if (sentence) {
      const words = sentence.split("-");

      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }
      return words.join(" ");
    }
    return ""
  }

  const brand = __RUNTIME__.binding.canonicalBaseAddress.includes("hotpoint") ? "Hotpoint" : "Indesit";
  const jCode = product.product  && product.product.properties.filter(prop => prop.name === "jCode")[0] ? product.product.properties.filter(prop => prop.name === "jCode")[0].values[0] : "";
  const isCleaningAndCare = __RUNTIME__.route.params.department === "cleaning-and-care";
  const metaTagDescriptionHotpointPLP = !__RUNTIME__.route.params.slug ? `Shop our genuine ${brand} ${__RUNTIME__.route.params.category ? capitalizeWords(__RUNTIME__.route.params.category) : ""} ${capitalizeWords(__RUNTIME__.route.params.subcategory)} ${__RUNTIME__.route.params.terms ? capitalizeWords(__RUNTIME__.route.params.terms) : ""} parts & accessories. Restore your appliance with our huge selection of parts. Next day delivery available.` : "";
  const metaTagDescriptionIndesitPLP = !__RUNTIME__.route.params.slug ? `For Genuine ${brand} ${__RUNTIME__.route.params.category ? capitalizeWords(__RUNTIME__.route.params.category) : ""} ${capitalizeWords(__RUNTIME__.route.params.subcategory)} ${__RUNTIME__.route.params.terms ? capitalizeWords(__RUNTIME__.route.params.terms) : ""} Spares you've come to the right place. Restore your appliance with our huge selection of parts. Next day delivery available.` : "";
  const metaTagDescriptionHotpointPDP = __RUNTIME__.route.params.slug ? `Check the specs and buy online the ${product.product.productName} ${product.product.productName.includes("J0") ? "" : jCode }: genuine Hotpoint parts for your appliance, directly from the manufacturer.` : ""
  const metaTagDescriptionIndesitPDP = __RUNTIME__.route.params.slug ? `Buy online the ${product.product.productName} ${product.product.productName.includes("J0") ? "" : jCode } directly from manufacturer: genuine Indesit parts for the maintanance and care of your appliances` : ""
  const metaTagDescriptionHotpointPLPCC = !__RUNTIME__.route.params.slug ? `Discover Hotpoint's ${__RUNTIME__.route.params.category ? capitalizeWords(__RUNTIME__.route.params.category) : ""} ${capitalizeWords(__RUNTIME__.route.params.subcategory)} ${__RUNTIME__.route.params.terms ? capitalizeWords(__RUNTIME__.route.params.terms) : ""}top cleaning & care products that will make your life easier. Shop our selection & keep your appliances running like new.` : "";
  const metaTagDescriptionIndesitPLPCC = !__RUNTIME__.route.params.slug ? `Shop Indesit  ${brand} ${__RUNTIME__.route.params.category ? capitalizeWords(__RUNTIME__.route.params.category) : ""} ${capitalizeWords(__RUNTIME__.route.params.subcategory)} ${__RUNTIME__.route.params.terms ? capitalizeWords(__RUNTIME__.route.params.terms) : ""}top cleaning & care products designed to keep your appliances looking its best and running like new.` : "";

  return (
    <>
      {__RUNTIME__.route.params.slug ?

        <Helmet>
          <meta name="description" content={brand === "Hotpoint" ? metaTagDescriptionHotpointPDP : metaTagDescriptionIndesitPDP} data-react-helmet="true"></meta>
        </Helmet>
        :
        <Helmet>
          <title>{capitalizeWords(__RUNTIME__.route.params.category)} {capitalizeWords(__RUNTIME__.route.params.subcategory)} {__RUNTIME__.route.params.terms ? capitalizeWords(__RUNTIME__.route.params.terms) : ""} {isCleaningAndCare ? "Cleaning & Care" : ""} - {brand} Spare Parts</title>

          {isCleaningAndCare ?
            <meta name="description" content={brand === "Hotpoint" ? metaTagDescriptionHotpointPLPCC : metaTagDescriptionIndesitPLPCC} data-react-helmet="true"></meta>

            :
            <meta name="description" content={brand === "Hotpoint" ? metaTagDescriptionHotpointPLP : metaTagDescriptionIndesitPLP} data-react-helmet="true"></meta>

          }
        </Helmet>
      }
    </>
  )
}

export default changeHelmet