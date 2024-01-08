import React, { useMemo } from "react";
import path from "ramda/es/path";
import last from "ramda/es/last";
import { Query } from "react-apollo";
import { useDevice } from "vtex.device-detector";
import { useProduct } from "vtex.product-context";
import { useTreePath } from "vtex.render-runtime";
import { useScrollListener } from "./hooks/scrollListener";
// import { Carousel } from "react-responsive-carousel";
import SliderGlide from "./SliderGlide";
import { useCssHandles, applyModifiers } from "vtex.css-handles";

import ProductCardCarousel from "./ProductCardCarousel";

import productRecommendationsQuery from "./queries/productRecommendations.gql";

const carouselOptions = {
  type: "carousel",
  gap: 64,
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
    1300: {
      perView: 1,
      peek: {
        before: 320,
        after: 320,
      },
    },
    1124: {
      perView: 1,
      peek: {
        before: 240,
        after: 240,
      },
    },
    1024: {
      perView: 1,
      gap: 64,
      peek: {
        before: 300,
        after: 300,
      },
    },
    768: {
      perView: 1,
      gap: 32,
      peek: {
        before: 245,
        after: 245,
      },
    },
    414: {
      perView: 1,
      gap: 32,
      peek: {
        before: 58,
        after: 58,
      },
    },
    375: {
      perView: 1,
      gap: 32,
      peek: {
        before: 44,
        after: 44,
      },
    },
    360: {
      perView: 1,
      gap: 32,
      peek: {
        before: 40,
        after: 40,
      },
    },
    320: {
      perView: 1,
      gap: 32,
      peek: {
        before: 22,
        after: 22,
      },
    },
  },
};

const fixRecommendation = (recommendation) => {
  if (recommendation.includes("editor.relatedProducts.")) {
    return last(recommendation.split("."));
  }
  return recommendation;
};

const ProductRecommenndationsCarouselNew = ({
  productQuery,
  productList,
  recommendation: cmsRecommendation = "suggestions",
  trackingId: rawTrackingId,
}) => {
  const CSS_HANDLES = [
    "ProductRecommenndationsCarouselNew__seoTextContainer",
    "ProductRecommenndationsCarouselNew__seoTextStyle",
  ];
  const { handles } = useCssHandles(CSS_HANDLES);

  const { isMobile } = useDevice();
  const treePath = useTreePath();

  const productContext = useProduct();
  let trackingId = rawTrackingId;
  let seoText = "";
  switch (parseInt(productContext.product.categoryId)) {
    case 15:
      seoText = "Inspirez-vous de notre gamme de lave-linge";
      break;
    case 16:
      seoText = "Inspirez-vous de notre gamme de sèche-linge";
      break;
    case 17:
      seoText = "Inspirez-vous de notre gamme de lave-linge séchant";
      break;
    case 18:
      seoText = "Inspirez-vous de notre gamme de réfrigérateurs";
      break;
    case 19:
      seoText = "Inspirez-vous de notre gamme de congélateur";
      break;
    case 20:
      seoText = "Inspirez-vous de notre gamme de fours";
      break;
    case 21:
      seoText = "Inspirez-vous de notre gamme de micro-ondes";
      break;
    case 22:
      seoText = "Inspirez-vous de notre gamme de plaques de cuisson";
      break;
    case 23:
      seoText = "Inspirez-vous de notre gamme de hotte";
      break;
    case 24:
      seoText = "Inspirez-vous de notre gamme de cuisinières";
      break;
    case 26:
      seoText = "Inspirez-vous de notre gamme de lave-vaisselle";
      break;
    default:
      seoText = "";
      break;
  }

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

  function findVariantImpression(data) {
    const result = data.properties.filter((el) => el.name === "Couleur");
    const result2 = data.items[0]?.variations[0]?.values[0]
      ? data.items[0].variations[0].values[0]
      : "";
    return result.length > 0
      ? result[0].values[0] == "Non" && result.length >= 1
        ? result[0].values[result.length - result.length + 1]
        : result[0].values[0]
      : result2;
  }

  const getDataFromQuery = (data) => {
    let productRecommendationsNewArr = [];

    if (data) {
      data?.forEach((prod) => {
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
              name: prod && prod.productName ? prod.productName : "",
              imageEnergyClass: imageEnergyClass
                ? imageEnergyClass.values[0]
                : "",
              fCode:
                prod && prod.items && prod.items[0] ? prod.items[0].name : "",
              productImage:
                prod && prod.items && prod.items[0].images[0]
                  ? prod.items[0].images[0].imageUrl
                  : "",
              productImageAlt:
                prod && prod.items && prod.items[0] && prod.items[0].images[0]
                  ? prod.items[0].images[0].imageLabel
                  : "",
              energyLabelPdf: energyLabelPdf ? energyLabelPdf.values[0] : "",
              linkToPDP: prod && prod.link ? "/" + prodLinkFixed : "",
              category:
                prod && prod.categories[0] && prod.categories[0].split("/")[2]
                  ? prod.categories[0].split("/")[2]
                  : "",
              variant: findVariantImpression(prod),
            };

            productRecommendationsNewArr.push(obj);
          }

          /* */
          let impressionApp = [];

          if (data) {
            data?.forEach((prod, index) => {
              if (prod && prod.properties) {
                const variant =
                  prod.properties === "Couleur"
                    ? prod.properties.find((el) => el.name === "Couleur")
                        .values[0]
                    : prod.items[0].variations[0].values[0]
                    ? prod.items[0].variations[0].values[0]
                    : "";

                function getDimension(data) {
                  const result = data[0].properties.filter(
                    (el) => el.name == "constructionType"
                  );
                  if (result.length > 0) {
                    return result[0].values[0];
                  }
                  return "";
                }

                const idAnalytics = prod.items[0].name;

                getCategoryFromIdProduct(prod.productId).then((response) => {
                  getStringCategoryFromId(response.CategoryId).then((res) => {
                    impressionApp.push({
                      name: prod.productName,
                      id: idAnalytics,
                      price: prod.items[0].sellers[0].commertialOffer.Price,
                      brand: prod.brand,
                      category: res.AdWordsRemarketingCode,
                      list: "product_page_up_selling_impression_list",
                      variant: variant ? variant : "",
                      position: index + 1,
                      dimension4: "Not Sellable Online",
                      dimension5: getDimension(data),
                    });
                  });
                });
              }
            });
            window.data_carousel_analytics = impressionApp;

            if (
              !window.dataLayer.filter((e) => e.event == "eec.impressionView")
                .length
            ) {
              window.dataLayer.push({
                event: "eec.impressionView",
                ecommerce: {
                  currencyCode: "EUR",
                  impressions: impressionApp,
                },
              });
            }
          }
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
        currencyCode: "EUR",
        impressions: [impression],
      },
    });
  };

  const productClickAnalytics = (data, i) => {
    if (data) {
      function costructionType(cType) {
        if (cType.indexOf("Free ") !== -1) {
          let cTypeArray = cType.split("");
          return cTypeArray[0] + cTypeArray[1].toLowerCase();
        } else {
          return cType.replace(" ", "-");
        }
      }

      function getDimension(prod) {
        const result = prod?.properties.filter(
          (obj) => obj.name == "type de construction"
        );
        if (result.length > 0) {
          return costructionType(result[0].values[0]);
        }
        return "";
      }

      const categoryAnalytics = data[i].categories[1].split("/")[2];

      const variant = data[i]
        ? data[i].properties.filter((el) => el.name === "Couleur")[0].values[0]
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
            currencyCode: "EUR",
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

        if (getDataFromQuery(productRecommendations).length > 0) {
          return (
            <>
              <style>
                {
                  "\
                  .vtex-flex-layout-0-x-flexColChild--product-desc-info .glide--swipeable {\
                    margin: 0 0 54px;\
                  }\
            .glide__slides{\
              display:flex\
            }\
            .your_cutom_classname{\
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
            .glide__slide--active{\
              display:flex;\
              justify-content:center;\
            }\
            .glide__slide{\
              height: 250px;\
            }\
            .glide__slide .indesitfr-custom-apps-0-x-productCardCarousel__container{\
              height: 250px;\
              width: 543px !important;\
            }\
            .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__imageContainer{\
              height: 210px;\
              width: 210px;\
              border: 0;\
              padding: 18px;\
            }\
            .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:40px;\
              height:100%;\
              display:flex;\
              flex-direction:column;\
              justify-content: space-between;\
            }\
            .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 247px;\
              line-height: 16px;\
              margin: 40px 0 0 0!important;\
              color: #005c92;\
            }\
            .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer .indesitfr-custom-apps-0-x-productCardCarousel__productNameLabel{\
              font-family: 'Roboto';\
              font-style: normal;\
              font-weight: 300;\
              font-size: 22px;\
              line-height: 30px;\
              color: #005C92;\
            }\
            .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
              display:flex;\
              justify-content:flex-end;\
            }\
            .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:12px;\
              white-space:nowrap;\
            }\
            .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
              width: 28px;\
              height: 28px;\
            }\
            .card-container-carousel.glide__slide--active{\
              height: 280px;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container{\
              height: 280px;\
              width: 604px !important;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__imageContainer{\
              height: 240px;\
              width: 240px;\
              border: 0;\
              padding: 18px;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:44px;\
              height:100%;\
              display:flex;\
              flex-direction:column;\
              justify-content: space-between;\
              padding: 0;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 260px;\
              line-height: 18px !important;\
              margin: 34px 0 0 0!important;\
              color: #005c92;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer .indesitfr-custom-apps-0-x-productCardCarousel__textStyle{\
              font-family: 'Roboto';\
              font-style: normal;\
              font-size: 24px!important;\
              line-height: 32px;\
              color: #005c92;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:14px;\
              white-space:nowrap;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
              width: 32px;\
              height: 32px;\
            }\
            .card-container-carousel.glide__slide--active{\
              height: 280px;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container{\
              height: 280px;\
              width: 604px !important;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__imageContainer{\
              height: 240px;\
              width: 240px;\
              border: 0;\
              padding: 18px;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:44px;\
              height:100%;\
              display:flex;\
              flex-direction:column;\
              justify-content: space-between;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 260px;\
              line-height: 18px !important;\
              margin: 44px 0 0 0!important;\
              color: #005c92;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer .indesitfr-custom-apps-0-x-productCardCarousel__textStyle{\
              font-family: 'Roboto';\
              font-style: normal;\
              font-size: 24px!important;\
              line-height: 32px;\
              color: #005c92;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:14px;\
              white-space:nowrap;\
            }\
            .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
              width: 32px;\
              height: 32px;\
            }\
            .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__imageContainer{\
              height: 210px;\
              width: 210px;\
              border: 0;\
              padding: 18px;\
            }\
            .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:40px;\
              height:100%;\
              display:flex;\
              flex-direction:column;\
              justify-content: space-between;\
              padding: 0;\
            }\
            .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 247px;\
              line-height: 16px;\
              margin: 30px 0 0 0!important;\
              color: #005c92;\
            }\
            .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer .indesitfr-custom-apps-0-x-productCardCarousel__productNameLabel{\
              font-family: 'Roboto-Light';\
              font-style: normal;\
              font-size: 22px;\
              line-height: 30px;\
              color: #42515A;\
            }\
            .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
              display:flex;\
              justify-content:flex-end;\
            }\
            .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:12px;\
              white-space:nowrap;\
            }\
            .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
              width: 28px;\
              height: 28px;\
            }\
            @media(max-width:1024px){\
              .glide__slide--active{\
                display:flex;\
                justify-content:center;\
              }\
              .glide__slide{\
                height: 130px;\
              }\
              .glide__slide .indesitfr-custom-apps-0-x-productCardCarousel__container{\
                height: 130px;\
              }\
              .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__imageContainer{\
                height: 114px;\
                width: 104px;\
                border: 0;\
                padding: 18px;\
              }\
              .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
                margin-left:12px;\
                height:100%;\
                justify-content: space-between;\
              }\
              .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer{\
                width: 134px;\
                line-height: 16px;\
                margin: 12px 0 0 0!important;\
                color: #005c92;\
              }\
              .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer .indesitfr-custom-apps-0-x-productCardCarousel__textStyle{\
                font-family: 'Roboto-Light';\
                font-style: normal;\
                font-size: 12px!important;\
                line-height: 16px;\
                color: #42515A;\
              }\
              .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
                display:flex;\
                justify-content:flex-end !important;\
              }\
              .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                font-size:12px;\
                white-space:nowrap;\
              }\
              .glide__slide.slider .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
                width: 28px;\
                height: 28px;\
              }\
              .glide__slide.slider.glide__slide--active{\
                width: 305px !important;\
                height: 150px;\
              }\
              .glide__slide.slider.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container{\
                width: 305px !important;\
                height: 150px;\
              }\
              .glide__slide.slider.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__imageContainer{\
                height: 134px;\
                width: 124px;\
                border: 0;\
                padding: 18px;\
              }\
              .glide__slide.slider.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
                margin-left:20px;\
                height:100%;\
                justify-content: space-between;\
              }\
              .glide__slide.slider.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer{\
                width: 138px;\
                line-height: 18px;\
                padding:0px;\
                margin: 20px 0 0 0!important;\
                color: #005c92;\
              }\
              .glide__slide.slider.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer .indesitfr-custom-apps-0-x-productCardCarousel__textStyle{\
                font-family: 'Roboto-Light';\
                font-style: normal;\
                font-size: 14px!important;\
                line-height: 18px;\
                color: #42515A;\
              }\
              .glide__slide.slider.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                font-size:14px;\
                white-space:nowrap;\
              }\
              .glide__slide.slider.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
                width: 32px;\
                height: 32px;\
              }\
              .card-container-carousel.glide__slide--active{\
                width: 305px !important;\
                height: 150px;\
              }\
              .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container{\
                width: 305px !important;\
                height: 150px;\
              }\
              .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__imageContainer{\
                height: 134px;\
                width: 124px;\
                border: 0;\
                padding: 18px;\
              }\
              .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
                margin-left:20px;\
                height:100%;\
                justify-content: space-between;\
              }\
              .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer{\
                width: 138px;\
                line-height: 18px;\
                padding:0px;\
                margin: 20px 0 0 0!important;\
                color: #005c92;\
              }\
              .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer .indesitfr-custom-apps-0-x-productCardCarousel__textStyle{\
                font-family: 'Roboto-Light';\
                font-style: normal;\
                font-size: 14px!important;\
                line-height: 18px;\
                color: #005c92;\
              }\
              .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                font-size:14px;\
                white-space:nowrap;\
              }\
              .card-container-carousel.glide__slide--active .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
                width: 32px;\
                height: 32px;\
              }\
              .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__imageContainer{\
                height: 114px;\
                width: 104px;\
                border: 0;\
                padding: 18px;\
              }\
              .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
                margin-left:12px;\
                height:100%;\
                justify-content: space-between;\
              }\
              .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer{\
                width: 134px;\
                line-height: 16px;\
                margin: 12px 0 0 0!important;\
                color: #005c92;\
              }\
              .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer .indesitfr-custom-apps-0-x-productCardCarousel__textStyle{\
                font-family: 'Roboto-Light';\
                font-style: normal;\
                font-size: 12px!important;\
                line-height: 16px;\
                color: #005c92;\
              }\
              .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
                display:flex;\
                justify-content:flex-end !important;\
              }\
              .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                font-size:12px;\
                white-space:nowrap;\
              }\
              .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesitfr-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
                width: 28px;\
                height: 28px;\
              }\
              .card-container-carousel .indesitfr-custom-apps-0-x-productCardCarousel__container .indesitfr-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesitfr-custom-apps-0-x-productCardCarousel__textContainer .indesitfr-custom-apps-0-x-productCardCarousel__productNameLabel{\
                font-style: normal;\
                font-weight: 300;\
                font-size: 14px;\
                line-height: 18px;\
              }\
              .vtex-flex-layout-0-x-flexColChild--product-desc-info .glide--swipeable {\
                margin: 0 0 85px;\
            }\
            "
                }
              </style>
              <div
                className={
                  handles.ProductRecommenndationsCarouselNew__seoTextContainer
                }
              >
                <span
                  className={
                    handles.ProductRecommenndationsCarouselNew__seoTextStyle
                  }
                >
                  {seoText}
                </span>
              </div>

              <SliderGlide options={carouselOptions}>
                {getDataFromQuery(productRecommendations).map((prod, i) => {
                  return (
                    <InnerCard
                      key={"carousel" + i}
                      i={i}
                      prod={prod}
                      productClickAnalytics={productClickAnalytics}
                      eventAnaliticts={saveImpression}
                    />
                    // <div key={i} className="card-container-carousel">
                    //   <ProductCardCarousel
                    //     productImage={prod.productImage}
                    //     energyClassImage={prod.imageEnergyClass}
                    //     linkEnergyLabel={prod.energyLabelPdf}
                    //     productCode={prod.fCode}
                    //     productName={prod.name}
                    //     linkToPDP={`${window.location.protocol
                    //       }//${window.location.host.concat(prod.linkToPDP)}`}
                    //     isBottomCarousel={true}
                    //     category={prod.category}
                    //     onClickDiscoverMore={() => {
                    //       productClickAnalytics(productRecommendations, i);
                    //     }}
                    //   />
                    // </div>
                  );
                })}
              </SliderGlide>
            </>
          );
        } else return <></>;
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
      key={i}
      className="card-container-carousel your_cutom_classname"
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
          productClickAnalytics(productRecommendations, i);
        }}
      />
    </div>
  );
}

export default ProductRecommenndationsCarouselNew;
