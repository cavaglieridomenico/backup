import { graphql } from "react-apollo";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useCssHandles } from "vtex.css-handles";

import ButtonEnergyClass from "./ButtonEnergyClass";
import productsQuery from "./queries/productsQuery.gql";

const CSS_HANDLES = [
  "productCardHome__container",
  "productCardHome__imageContainer",
  "productCardHome__image",
  "productCardHome__detailsContainer",
  "productCardHome__productCodeLabel",
  "productCardHome__productNameLabel",
  "productCardHome__discoverMoreContainer",
  "productCardHome__discoverMoreText",
  "productCardHome__discoverMoreIcon",
  "productCardHome__buttonEnergyClassContainer",
  "productCardHome__energyImageMobile",
  "productCardHome__labelImageContainer",
  "productCardHome__textContainer",
  "productCardHome__textStyle",
  "productCardHome__textStyleCategory",
];

function CardHome({ id, data }) {
  const { handles } = useCssHandles(CSS_HANDLES);

  const [productDetails, setProductDetails] = useState([]);
  const { loading, error, products } = data || {};

  function getCategoryFromIdProduct(productId) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return fetch(
      "/_v/wrapper/api/product/" + productId + "/category",
      options
    ).then((response) => {
      return response.json();
    });
  }

  function getStringCategoryFromId(idCategory) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return fetch(
      "/_v/wrapper/api/catalog/category/" + idCategory,
      options
    ).then((response) => {
      return response.json();
    });
  }

  const costructionType = (cType) => {
    if (cType.indexOf("Free ") !== -1) {
      let cTypeArray = cType.split(" ");
      return cTypeArray[0] + cTypeArray[1].toLowerCase();
    } else {
      return cType.replace(" ", "-");
    }
  };

  const getDimension = (prod) => {
    const result = prod.properties.filter(
      (obj) => obj.name == "constructionType"
    );
    if (result.length > 0) {
      return costructionType(result[0].values[0]);
    }
    return "";
  };

  useEffect(() => {
    if (products) {
      const productDetailsCardArray = [];
      const impressionList = [];

      products.forEach((prod, index) => {
        if (prod && prod.properties) {
          const imageEnergyClass = prod.properties.find(
            (prop) =>
              prop.name === "ÉnergieLogo_image" ||
              prop.name === "EnergyLogo_image"
          );

          const altImage = prod.properties.find(
            (prop) =>
              prop.name === "Classe énergétique" ||
              prop.name === "Energy efficiency class"
          );

          const energyLabelPdf = prod.properties.find(
            (prop) =>
              prop.name === "étiquette énergie" ||
              prop.name === "label-energie-nouvelle" ||
              prop.name === "energy-label"
          );

          const obj = {
            altImage: altImage && altImage.values[0] ? altImage.values[0] : "",
            name: prod.productName,
            imageEnergyClass:
              imageEnergyClass && imageEnergyClass.values[0]
                ? imageEnergyClass.values[0]
                : "",
            fCode: prod.items[0].name,
            productImage: prod.items[0].images[0].imageUrl,
            productImageAlt: prod.items[0].images[0].imageLabel,
            energyLabelPdf:
              energyLabelPdf && energyLabelPdf.values[0]
                ? energyLabelPdf.values[0]
                : "",
            linkToPDP: prod.link,
            category: prod.categories[0].split("/")[2],
          };

          productDetailsCardArray.push(obj);

          const variant = prod?.properties.find((el) => el.name === "Couleur")
            .values[0];

          // const categoryAnlytics = prod.categories[1].split("/")[2];
          getCategoryFromIdProduct(prod.productId).then((response) => {
            getStringCategoryFromId(response.CategoryId).then((res) => {
              impressionList.push({
                name: obj.name,
                id: obj.fCode,
                price: prod.items[0].sellers[0].commertialOffer.Price,
                brand: prod.brand,
                category: res.AdWordsRemarketingCode,
                variant: variant,
                position: index + 1,
                list: "homepage_impression_list",
                dimension4: "Not Sellable Online",
                dimension5: getDimension(prod),
              });
            });
          });
          setProductDetails(productDetailsCardArray);
          window.indesit_card_home_list = impressionList;
        }
      });
    }
  }, [products]);

  const productClickAnalytics = (i) => {
    if (products) {
      function costructionType(cType) {
        if (cType.indexOf("Free ") !== -1) {
          let cTypeArray = cType.split(" ");
          return cTypeArray[0] + cTypeArray[1].toLowerCase();
        } else {
          return cType.replace(" ", "-");
        }
      }

      function getDimension(prod) {
        const result = prod.properties.filter(
          (obj) => obj.name == "type de construction"
        );
        if (result.length > 0) {
          return costructionType(result[0].values[0]);
        }
        return "";
      }
      const categoryAnalytics = products[i].categories[1].split("/")[2];
      const variant = products[i]
        ? products[i].properties.filter((el) => el.name === "Colore")[0]
            .values[0]
        : "";
      if (
        products &&
        products[i] &&
        categoryAnalytics !== "" &&
        categoryAnalytics !== undefined
      ) {
        window.dataLayer.push({
          event: "eec.productClick",
          ecommerce: {
            currencyCode: "EUR",
            click: {
              actionField: {
                list: "homepage_impression_list",
              },
              products: [
                {
                  name: products[i].productName,
                  id: products[i].items[0].name,
                  price: products[i].items[0].sellers[0].commertialOffer.Price,
                  brand: products[i].brand,
                  category: categoryAnalytics,
                  variant: variant,
                  position: i + 1,
                  dimension4: "Not Sellable Online",
                  dimension5: getDimension(products[i]),
                },
              ],
            },
          },
        });
      }
    }
  };

  const saveImpression = (impression, cardId) => {
    window.isPushedCard[cardId] = true;
    window.dataLayer.push({
      event: "eec.impressionView",
      ecommerce: {
        currencyCode: "EUR",
        impressions: [impression],
      },
    });
  };

  const cardRef = useRef(null);

  useLayoutEffect(() => {
    const onScrollChange = () => {
      if (window.indesit_card_home_list) {
        const actualScrollPosition = window.scrollY;
        const screenHeight = window.innerHeight;

        window.indesit_card_home_list.forEach((el, i) => {
          const cardId = "cardHome" + i;
          const element = document.getElementById("cardHome" + i);

          if (element) {
            const distanceFromTopElement = element.offsetTop;
            const heightElement = element.getBoundingClientRect().height;
            if (
              actualScrollPosition + screenHeight >=
              distanceFromTopElement + heightElement
            ) {
              if (!window.isPushedCard) {
                window.isPushedCard = {};
              }
              if (!window.isPushedCard[cardId]) {
                saveImpression(window.indesit_card_home_list[i], cardId);
              }
            }
          }
        });
      }
    };
    window.addEventListener("scroll", onScrollChange);
    return () => {
      window.removeEventListener("scroll", onScrollChange);
    };
  }, []);

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  return productDetails.map((prod, i) => {
    return (
      <>
        <style>
          {
            "\
            "
          }
        </style>
        <div
          ref={cardRef}
          key={i}
          id={"cardHome" + i}
          className={handles.productCardHome__container}
        >
          <div className={handles.productCardHome__imageContainer}>
            <img
              className={handles.productCardHome__image}
              src={prod.productImage}
            />
          </div>
          <div className={handles.productCardHome__detailsContainer}>
            <div className={handles.productCardHome__labelImageContainer}>
              <span className={handles.productCardHome__productCodeLabel}>
                {prod.fCode}
              </span>
              <img
                className={handles.productCardHome__energyImageMobile}
                src={prod.imageEnergyClass}
              />
            </div>

            <span className={handles.productCardHome__productNameLabel}>
              {prod.name}
            </span>
            <div
              className={handles.productCardHome__buttonEnergyClassContainer}
            >
              <ButtonEnergyClass
                href={prod.energyLabelPdf}
                energyClassImage={prod.imageEnergyClass}
              />
            </div>

            {/* Discover more component */}
            <a
              href={`${window.location.protocol}//${window.location.host.concat(
                prod.linkToPDP
              )}`}
              className={handles.productCardHome__discoverMoreContainer}
              onClick={() => {
                productClickAnalytics(i);
              }}
            >
              <span className={handles.productCardHome__discoverMoreText}>
                En savoir plus
              </span>
              <span className={handles.productCardHome__discoverMoreIcon} />
            </a>
          </div>
        </div>
      </>
    );
  });
}

function ComponentWrapper({ collectionID = "" }) {
  const CardHomeQuery = graphql(productsQuery, {
    options: () => ({
      ssr: true,
      variables: {
        collection: collectionID.toString(),
        from: 0,
        to: 99,
      },
    }),
  })(CardHome);

  CardHomeQuery.schema = {
    title: "admin/editor.shelf.title",
  };

  return <CardHomeQuery />;
}

export default ComponentWrapper;
