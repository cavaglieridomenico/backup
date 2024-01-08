import { graphql } from "react-apollo";
import React, { useState, useEffect, useRef, useLayoutEffect  } from "react";
import { useCssHandles } from "vtex.css-handles";

import ButtonEnergyClass from "./ButtonEnergyClass";
import productsQuery from "./queries/productsQuery.gql";

const CSS_HANDLES = [
  "productCardHomeLandingPage__container",
  "productCardHomeLandingPage__imageContainer",
  "productCardHomeLandingPage__image",
  "productCardHomeLandingPage__detailsContainer",
  "productCardHomeLandingPage__productCodeLabel",
  "productCardHomeLandingPage__productNameLabel",
  "productCardHomeLandingPage__discoverMoreContainer",
  "productCardHomeLandingPage__discoverMoreText",
  "productCardHomeLandingPage__discoverMoreIcon",
  "productCardHomeLandingPage__buttonEnergyClassContainer",
  "productCardHomeLandingPage__energyImageMobile",
  "productCardHomeLandingPage__labelImageContainer",
  "productCardHomeLandingPage__textContainer",
  "productCardHomeLandingPage__textStyle",
  "productCardHomeLandingPage__textStyleCategory",
];

function CardHomeLandingPage({ id, data }) {
  const { handles } = useCssHandles(CSS_HANDLES);

  const [productDetails, setProductDetails] = useState([]);
  const { loading, error, products } = data || {};

  useEffect(() => {
    if (products) {
      const productDetailsCardArray = [];
      let impressionApp = [];

      products.forEach((prod, index) => {
        if (prod && prod.properties) {
          const imageEnergyClass = prod.properties.find(
            (prop) => prop.name === "EnergyLogo_image"
          );

          const altImage = prod.properties.find(
            (prop) =>
              prop.name === "Energy efficiency class" ||
              prop.name === "Energy Class"
          );

          const energyLabelPdf = prod.properties.find(
            (prop) =>
              prop.name === "energy-label" || prop.name === "new-energy-label"
          );

          const obj = {
            altImage: altImage ? altImage.values[0] : "",
            name: prod.productName ? prod.productName : "",
            imageEnergyClass: imageEnergyClass
              ? imageEnergyClass.values[0]
              : "",
            fCode: prod.items ? prod.items[0].name : "",
            productImage: prod.items[0].images[0]
              ? prod.items[0].images[0].imageUrl
              : "",
            productImageAlt: prod.items[0].images[0]
              ? prod.items[0].images[0].imageLabel
              : "",
            energyLabelPdf: energyLabelPdf ? energyLabelPdf.values[0] : "",
            linkToPDP: prod.link ? prod.link : "",
            category: prod.categories[0].split("/")[2]
              ? prod.categories[0].split("/")[2]
              : "",
          };

          productDetailsCardArray.push(obj);

          const variant = prod.properties
            ? prod.properties.filter((el) => el.name === "Colour").values[0]
            : "";

          const categoryAnlytics = prod.categories[1].split("/")[2];

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
              (obj) => obj.name == "constructionType"
            );
            if (result.length > 0) {
              return costructionType(result[0].values[0]);
            }
            return "";
          }

          if (!impressionApp.filter((e) => e.name == obj.name).length) {
            impressionApp.push({
              name: obj.name,
              id: obj.fCode,
              price: prod.items[0].sellers[0].commertialOffer.Price,
              brand: prod.brand,
              category: categoryAnlytics,
              variant: variant ? variant : "",
              list: "product_page_up_selling_impression_list",
              position: index + 1,
              dimension4: "Not Sellable Online",
              dimension5: getDimension(prod),
            });
          } 
    
          // impressionApp.push({
          //   name: obj.name,
          //   id: obj.fCode,
          //   price: prod.items[0].sellers[0].commertialOffer.Price,
          //   brand: prod.brand,
          //   category: categoryAnlytics,
          //   variant: variant,
          //   position: index + 1,
          //   list: "landing_impression_list",
          //   dimension4: "Not Sellable Online",
          //   dimension5: getDimension(prod),
          // });
    
          setProductDetails(productDetailsCardArray);
          window.landing_card_home_list = impressionApp;
        }
      });
      // if (
      //   !window.dataLayer.filter((e) => e.event == "eec.impressionView").length
      // ) {
      //   window.dataLayer.push({
      //     event: "eec.impressionView",
      //     ecommerce: {
      //       currencyCode: "GBP",
      //       impressions: impressionApp,
      //     },
      //   });
      // }
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
          (obj) => obj.name == "constructionType"
        );
        if (result.length > 0) {
          return costructionType(result[0].values[0]);
        }
        return "";
      }

      const categoryAnalytics = products[i].categories[1].split("/")[2];

      const variant = products[i]
        ? products[i].properties.filter((el) => el.name === "Colour")[0]
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
            currencyCode: "GBP",
            click: {
              actionField: {
                list: "product_page_up_selling_impression_list",
              },
              products: [
                {
                  name: products[i].productName,
                  id: products[i].items[0].name,
                  price: products[i].items[0].sellers[0].commertialOffer.Price,
                  brand: products[i].brand,
                  category: categoryAnalytics,
                  variant: variant ? variant : "",
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
        currencyCode: "GBP",
        impressions: [impression],
      },
    });
  };

  const cardRef = useRef(null);

  useLayoutEffect(() => {
    const onScrollChange = () => {  
      if (window.landing_card_home_list) {  
        const actualScrollPosition = window.scrollY;
        const screenHeight = window.innerHeight;

        window.landing_card_home_list.forEach((el, i) => {
          const cardId = "cardLanding" + i;
          const element = document.getElementById("cardLanding" + i);

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
                saveImpression(window.landing_card_home_list[i], cardId);
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
        <div
          ref={cardRef}
          key={i}
          id={"cardLanding" + i}
          className={handles.productCardHomeLandingPage__container}
        >
          <div className={handles.productCardHomeLandingPage__imageContainer}>
            <img
              className={handles.productCardHomeLandingPage__image}
              src={prod.productImage}
            />
          </div>
          <div className={handles.productCardHomeLandingPage__detailsContainer}>
            <div
              className={
                handles.productCardHomeLandingPage__labelImageContainer
              }
            >
              <span
                className={handles.productCardHomeLandingPage__productCodeLabel}
              >
                {prod.fCode}
              </span>
              <img
                className={
                  handles.productCardHomeLandingPage__energyImageMobile
                }
                src={prod.imageEnergyClass}
              />
            </div>

            <span
              className={handles.productCardHomeLandingPage__productNameLabel}
            >
              {prod.name}
            </span>
            {prod.energyLabelPdf || prod.imageEnergyClass ? (
              <div
                className={
                  handles.productCardHomeLandingPage__buttonEnergyClassContainer
                }
              >
                <ButtonEnergyClass
                  href={prod.energyLabelPdf}
                  energyClassImage={prod.imageEnergyClass}
                />
              </div>
            ) : (
              ""
            )}

            {/* Discover more component */}
            <a
              href={`${window.location.protocol}//${window.location.host.concat(
                prod.linkToPDP
              )}`}
              className={
                handles.productCardHomeLandingPage__discoverMoreContainer
              }
              onClick={() => {
                productClickAnalytics(i);
              }}
            >
              <span
                className={handles.productCardHomeLandingPage__discoverMoreText}
              >
                Discover more
              </span>
              <span
                className={handles.productCardHomeLandingPage__discoverMoreIcon}
              />
            </a>
          </div>
        </div>
      </>
    );
  });
}

function ComponentWrapper({ collectionID = "" }) {
  const CardHomeLandingPageQuery = graphql(productsQuery, {
    options: () => ({
      ssr: true,
      variables: {
        collection: collectionID.toString(),
        from: 0,
        to: 99,
      },
    }),
  })(CardHomeLandingPage);

  CardHomeLandingPageQuery.schema = {
    title: "admin/editor.shelf.title",
  };

  return <CardHomeLandingPageQuery />;
}

export default ComponentWrapper;
