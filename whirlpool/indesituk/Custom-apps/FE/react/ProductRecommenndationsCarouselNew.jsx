import React, { useMemo } from "react";
import path from "ramda/es/path";
import last from "ramda/es/last";
import { Query } from "react-apollo";
import { useDevice } from "vtex.device-detector";
import { useProduct } from "vtex.product-context";
import { useTreePath } from "vtex.render-runtime";
import SliderGlide from "./SliderGlide";
import { useScrollListener } from "./hooks/scrollListener";

import ProductCardCarousel from "./ProductCardCarousel";

import productRecommendationsQuery from "./queries/productRecommendations.gql";

const fixRecommendation = (recommendation) => {
  if (recommendation.includes("editor.relatedProducts.")) {
    return last(recommendation.split("."));
  }
  return recommendation;
};

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

  return fetch("/_v/wrapper/api/catalog/category/" + idCategory, options).then(
    (response) => {
      return response.json();
    }
  );
}

const ProductRecommenndationsCarouselNew = ({
  productQuery,
  productList,
  recommendation: cmsRecommendation = "suggestions",
  trackingId: rawTrackingId,
}) => {
  const { isMobile } = useDevice();
  const treePath = useTreePath();

  const productContext = useProduct();

  let trackingId = rawTrackingId;

  if (!trackingId) {
    const treePathList =
      (typeof treePath === "string" && treePath.split()) || [];
    trackingId = treePathList[treePathList.length - 1] || "List of products";
  }

  const productId =
    path(["product", "productId"], productQuery) ||
    path(["product", "productId"], productContext);

  const recommendation = productId
    ? fixRecommendation(cmsRecommendation)
    : null;
  const variables = useMemo(() => {
    if (!productId) {
      return null;
    }

    return {
      identifier: {
        field: "id",
        value: productId,
        //orderBy: "OrderByReviewRateDESC",
      },
      type: recommendation,
    };
  }, [productId, recommendation]);

  if (!productId) {
    return null;
  }

  let impressionApp = [];
  const getDataFromQuery = (data) => {
    let productRecommendationsNewArr = [];

    if (data) {
      data?.forEach((prod, index) => {
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

          const spllitedArrPath = prod.link.split("/");
          const prodLinkFixed = prod.link
            .split("/")
            [spllitedArrPath.length - 2].concat("/")
            .concat(prod.link.split("/")[spllitedArrPath.length - 1]);

          if (prodLinkFixed) {
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
              linkToPDP: prod.link ? "/" + prodLinkFixed : "",
              category: prod.categories[0].split("/")[2]
                ? prod.categories[0].split("/")[2]
                : "",
            };

            productRecommendationsNewArr.push(obj);

            function getVariant(properties) {
              let variant1 = properties.find(
                (el) => el.name.toLowerCase().replace(":", "") === "colour"
              )?.values[0];
              if (variant1 != "") return variant1;
              let variant2 = properties.find(
                (el) => el.name.toLowerCase().replace(":", "") === "color"
              )?.values[0];
              return variant2;
            }

            const variant =
              prod && prod.properties ? getVariant(prod.properties) : "";

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

            getCategoryFromIdProduct(prod.productId).then((response) => {
              getStringCategoryFromId(response.CategoryId).then((res) => {
                impressionApp.push({
                  name: obj.name,
                  id: obj.fCode,
                  price: prod.items[0].sellers[0].commertialOffer.Price,
                  brand: prod.brand,
                  category: res.AdWordsRemarketingCode,
                  variant: variant,
                  list: "product_page_up_selling_impression_list",
                  position: index + 1,
                  dimension4: "Not Sellable Online",
                  dimension5: getDimension(prod),
                });
              });
            });
          }

          window.data_carousel_analytics = impressionApp;
        }
      });
    }
    return productRecommendationsNewArr;
  };

  const saveImpression = (index) => {
    const impression = window.data_carousel_analytics[index];
    window.dataLayer.push({
      event: "eec.impressionView",
      ecommerce: {
        currencyCode: "GBP",
        impressions: [impression],
      },
    });
  };

  const productClickAnalytics = (data, i) => {
    if (data) {
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

      const categoryAnalytics = data[i].categories[1].split("/")[2];

      const variant = data[i]
        ? data[i].properties.filter((el) => el.name === "Colour")[0].values[0]
        : "";

      if (
        data &&
        data[i] &&
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
                  name: data[i].productName,
                  id: data[i].items[0].name,
                  price: data[i].items[0].sellers[0].commertialOffer.Price,
                  brand: data[i].brand,
                  category: categoryAnalytics,
                  variant: variant,
                  position: i + 1,
                  dimension4: "Not Sellable Online",
                  dimension5: getDimension(data[i]),
                },
              ],
            },
          },
        });
      }
    }
  };

  const carouselOptions = {
    animationDuration: 800,
    type: "carousel",
    peek: {
      before: 540,
      after: 540,
    },
    perView: 1,
    startAt: 0,
    focusAt: "center",
    breakpoints: {
      1840: {
        perView: 1,
        peek: {
          before: 420,
          after: 420,
        },
      },
      1640: {
        perView: 1,
        peek: {
          before: 390,
          after: 390,
        },
      },
      1440: {
        perView: 1,
        peek: {
          before: 390,
          after: 390,
        },
      },
      1366: {
        perView: 1,
        peek: {
          before: 330,
          after: 330,
        }
      },
      1024: {
        perView: 1,
        gap: 70,
        peek: {
          before: 300,
          after: 300,
        },
      },
      768: {
        perView: 1,
        gap: 60,
        peek: {
          before: 215,
          after: 215,
        },
      },
      414: {
        perView: 1,
        gap: 18,
        peek: {
          before: 58,
          after: 58,
        },
      },
      375: {
        perView: 1,
        gap: 15,
        peek: {
          before: 44,
          after: 44,
        },
      },
      360: {
        perView: 1,
        gap: 15,
        peek: {
          before: 40,
          after: 40,
        },
      },
      320: {
        perView: 1,
        gap: 10,
        peek: {
          before: 22,
          after: 22,
        },
      },
    },
  };

  return (
    <Query
      query={productRecommendationsQuery}
      variables={variables}
      partialRefetch
      ssr={false}
    >
      {({ data, loading }) => {
        if (!data) {
          return null;
        }
        if (loading) {
          return null;
        }
        const { productRecommendations } = data;

        return (
          <>
            <style>
          {
            "\
            .glide__slides{\
              display:flex\
            }\
            .glide__slide{\
              list-style-type:none!important;\
              display:flex;\
              justify-content:center;\
            }\
            .single-bullet{\
              cursor:pointer;\
              margin-right: 11px;\
              border-radius: 999px;\
              width: 8px;\
              height: 8px;\
              border: none;\
              background:#0090D0;\
              padding: 0px;\
            }\
            .single-bullet.glide__bullet--active{\
              background: #005C92;\
              border-radius: 13px;\
              border: none;\
              width: 21px;\
              height: 8px;\
            }\
            .glide__slide.your_cutom_classname{\
              height: 250px;\
            }\
            .glide__slide.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container{\
              height: 250px;\
              width: 543px !important;\
              border-radius: 32px;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__imageContainer .indesituk-custom-apps-0-x-productCardCarousel__image{\
              width: 155px;\
              transition: 0.2s;\
            }\
            @media screen and (max-width: 1024px) {\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__imageContainer .indesituk-custom-apps-0-x-productCardCarousel__image{\
                width: 70px;\
              }\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:40px;\
              height:100%;\
              display:flex;\
              flex-direction:column;\
              justify-content: space-between;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 247px;\
              line-height: 16px;\
              margin: 24px 0 0 0!important;\
              color: #005c92;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__textStyle{\
              font-family: 'Roboto-Light';\
              font-style: normal;\
              font-weight: 300;\
              font-size: 18px;\
              line-height: 30px;\
              color: #005C92;\
            }\
            .glide__slide.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__productNameLabel{\
              font-size: 24px!important;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
              display:flex;\
              justify-content:flex-end;\
              margin: 0 4px 4px 0;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:12px;\
              white-space:nowrap;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
              width: 28px;\
              height: 28px;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active{\
              height: 280px;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container{\
              height: 280px;\
              width: 604px !important;\
              border-radius: 40px;\
              transition: all 0.2s;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__imageContainer{\
              height: 240px;\
              width: 444px;\
              border: 0;\
              padding: 18px;\
              border-radius: 24px;\
              transition: all 0.2s\
            }\
            .glide__slide.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:44px;\
              height:100%;\
              width: 273px;\
              display:flex;\
              flex-direction:column;\
              justify-content: space-between;\
            }\
            .glide__slide.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 260px;\
              line-height: 18px !important;\
              margin: 30px 0 0 0!important;\
              color: #005c92;\
            }\
            .glide__slide.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__productNameLabel{\
              font-size: 24px!important;\
            }\
            .glide__slide.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__textStyle{\
              font-family: 'Roboto';\
              font-style: normal;\
              font-size: 24px!important;\
              line-height: 32px;\
              color: #005c92;\
            }\
            .glide__slide.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:14px;\
              white-space:nowrap;\
            }\
            @media screen and (max-width: 1024px){\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__imageContainer .indesituk-custom-apps-0-x-productCardCarousel__image{\
                width: 82px\
              }\
              .glide__slide.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__productNameLabel{\
                font-size: 14px!important;\
                color: #43525a !important;\
              }\
              .glide__slide.your_cutom_classname.glide__slide--clone .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__productNameLabel{\
                font-size: 12px!important;\
                color: #43525a !important;\
              }\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:44px;\
              width: 100%;\
              height:100%;\
              display:flex;\
              flex-direction:column;\
              justify-content: space-between;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 260px;\
              line-height: 18px !important;\
              margin: 24px 0 0 0!important;\
              color: #005c92;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__textStyle{\
              font-family: 'Roboto-Light';\
              font-style: normal;\
              font-size: 24px!important;\
              line-height: 32px;\
              color: #005c92;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
              margin-bottom: 8px;\
              margin-right: 8px;\
              }\
              @media screen and (max-width: 1024px) {\
                .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
                  margin-bottom: 4px;\
                  margin-right: 4px;\
                  }\
              }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:14px;\
              white-space:nowrap;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
              width: 32px;\
              height: 32px;\
            }\
            @media(max-width:1024px){\
              .glide__slide--active{\
                display:flex;\
                justify-content:center;\
              }\
              .glide__slide.your_cutom_classname{\
                height: 120px;\
              }\
              .glide__slide.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container{\
                height: 120px;\
                width: 260px !important;\
                border-radius: 24px;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__imageContainer{\
                height: 104px;\
                width: 104px;\
                border: 0;\
                padding: 18px;\
                border-radius: 20px;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
                margin-left:12px;\
                height:100%;\
                justify-content: space-between;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer{\
                width: 134px;\
                line-height: 16px;\
                margin: 4px 0 0 0!important;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__textStyle{\
                font-family: 'Roboto-Light';\
                font-style: normal;\
                font-size: 12px!important;\
                line-height: 16px;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
                display:flex;\
                justify-content:flex-end;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                font-size:12px;\
                white-space:nowrap;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
                width: 28px;\
                height: 28px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active{\
                height: 140px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container{\
                height: 140px;\
                width: 305px !important;\
                border-radius: 28px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__imageContainer{\
                height: 124px;\
                width: 124px;\
                border: 0;\
                padding: 18px;\
                border-radius: 20px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
                margin-left:20px;\
                height:100%;\
                width: auto !important;\
                justify-content: space-between;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer{\
                width: 138px;\
                line-height: 18px;\
                margin: 12px 0 0 0!important;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__textStyle{\
                font-family: 'Roboto-Light';\
                font-style: normal;\
                font-size: 14px!important;\
                line-height: 18px;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                font-size:14px;\
                white-space:nowrap;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
                width: 32px;\
                height: 32px;\
              }\
            }\
            "
          }
        </style>
            {getDataFromQuery(productRecommendations)?.length > 0 &&
              <SliderGlide options={carouselOptions}>
                {getDataFromQuery(productRecommendations).map((prod, i) => {
                  return (
                    <>
                      <InnerCard
                        key={"carousel" + i}
                        i={i}
                        prod={prod}
                        productClickAnalytics={productClickAnalytics}
                        eventAnaliticts={saveImpression}
                      />
                    </>
                  );
                })}
              </SliderGlide>
            }
          </>
        );
      }}
    </Query>
  );
};

function InnerCard({ i, prod, productClickAnalytics, eventAnaliticts }) {
  useScrollListener(
    "carousel_" + i + "_" + prod.fCode,
    "glide__slide--active",
    (id) => {
      const idReal = id.split("_")[1];
      eventAnaliticts(idReal, id);
    }
  );

  return (
    <div
      id={"carousel_" + i + "_" + prod.fCode}
      className="glide__slide your_cutom_classname slider"
    >
      <ProductCardCarousel
        productImage={prod.productImage}
        energyClassImage={prod.imageEnergyClass}
        linkEnergyLabel={prod.energyLabelPdf}
        productCode={prod.fCode}
        productName={prod.name}
        linkToPDP={`${window.location.protocol}//${window.location.host.concat(
          prod.linkToPDP
        )}`}
        isBottomCarousel={true}
        category={prod.category}
        onClickDiscoverMore={() => {
          productClickAnalytics(i);
        }}
      />
    </div>
  );
}
export default ProductRecommenndationsCarouselNew;
