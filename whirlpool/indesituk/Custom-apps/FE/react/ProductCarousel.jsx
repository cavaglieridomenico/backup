import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import { graphql } from "react-apollo";
import { useDevice } from "vtex.device-detector";

import ProductCardCarousel from "./ProductCardCarousel";
import productsQuery from "./queries/productsQuery.gql";

function ProductCarousel({ data, isBottomCarousel, collectionID }) {
  const [mobileSize, setMobileSize] = useState();

  useEffect(() => {
    setMobileSize(isMobile ? 75 : 40);
  }, []);

  const carouselProps = {
    centerMode: true,
    autoPlay: false,
    centerSlidePercentage: mobileSize,
    dynamicHeight: false,
    emulateTouch: true,
    infiniteLoop: true,
    showArrows: false,
    showIndicators: true,
    showStatus: false,
    showThumbs: false,
    stopOnHover: false,
    swipeable: true,
    useKeyboardArrows: false,
  };

  const { loading, error, products } = data || {};
  const [productDetails, setProductDetails] = useState([]);
  const { isMobile } = useDevice();

  let impressionApp = [];

  useEffect(() => {
    if (products) {
      const productDetailsCardArray = [];

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

          const variant =
            prod &&
            prod.properties &&
            prod.properties.includes((el) => el.name === "Colour")
              ? prod.properties.find((el) => el.name === "Colour").values[0]
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
              variant: variant,
              list: "product_page_up_selling_impression_list",
              position: index + 1,
              dimension4: "Not Sellable Online",
              dimension5: getDimension(prod),
            });
          }
          setProductDetails(productDetailsCardArray);
        }
      });
 
      window.dataLayer.push({
        event: "eec.impressionView",
        ecommerce: {
          currencyCode: "GBP",
          impressions: impressionApp,
        },
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

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
      />

      <style>
        {
          '\
            .carousel .control-arrow, .carousel.carousel-slider .control-arrow {\
              -webkit-transition: all 0.25s ease-in;\
              -moz-transition: all 0.25s ease-in;\
              -ms-transition: all 0.25s ease-in;\
              -o-transition: all 0.25s ease-in;\
              transition: all 0.25s ease-in;\
              opacity: 0.4;\
              filter: alpha(opacity=40);\
              position: absolute;\
              z-index: 2;\
              top: 20px;\
              background: none;\
              border: 0;\
              font-size: 32px;\
              cursor: pointer; }\
              .carousel .control-arrow:focus, .carousel .control-arrow:hover {\
                opacity: 1;\
                filter: alpha(opacity=100); }\
              .carousel .control-arrow:before, .carousel.carousel-slider .control-arrow:before {\
                margin: 0 5px;\
                display: inline-block;\
                border-top: 8px solid transparent;\
                border-bottom: 8px solid transparent;\
                content: "";\
                }\
              .carousel .control-disabled.control-arrow {\
                opacity: 0;\
                filter: alpha(opacity=0);\
                cursor: inherit;\
                display: none; }\
              .carousel .control-prev.control-arrow {\
                left: 0; }\
                .carousel .control-prev.control-arrow:before {\
                  border-right: 8px solid #fff; }\
              .carousel .control-next.control-arrow {\
                right: 0; }\
                .carousel .control-next.control-arrow:before {\
                  border-left: 8px solid #fff; }\
            .carousel-root {\
              outline: none; }\
            .carousel {\
              position: relative;\
              width: 100%; }\
              .carousel * {\
                -webkit-box-sizing: border-box;\
                -moz-box-sizing: border-box;\
                box-sizing: border-box; }\
              .carousel img {\
                width: 100%;\
                display: inline-block;\
                pointer-events: none; }\
              .carousel .carousel {\
                position: relative; }\
              .carousel .control-arrow {\
                outline: 0;\
                border: 0;\
                background: none;\
                top: 50%;\
                margin-top: -13px;\
                font-size: 18px; }\
              .carousel .thumbs-wrapper {\
                margin: 20px;\
                overflow: hidden; }\
              .carousel .thumbs {\
                -webkit-transition: all 0.15s ease-in;\
                -moz-transition: all 0.15s ease-in;\
                -ms-transition: all 0.15s ease-in;\
                -o-transition: all 0.15s ease-in;\
                transition: all 0.15s ease-in;\
                -webkit-transform: translate3d(0, 0, 0);\
                -moz-transform: translate3d(0, 0, 0);\
                -ms-transform: translate3d(0, 0, 0);\
                -o-transform: translate3d(0, 0, 0);\
                transform: translate3d(0, 0, 0);\
                position: relative;\
                list-style: none;\
                white-space: nowrap; }\
              .carousel .thumb {\
                -webkit-transition: border 0.15s ease-in;\
                -moz-transition: border 0.15s ease-in;\
                -ms-transition: border 0.15s ease-in;\
                -o-transition: border 0.15s ease-in;\
                transition: border 0.15s ease-in;\
                display: inline-block;\
                margin-right: 6px;\
                white-space: nowrap;\
                overflow: hidden;\
                border: 3px solid #fff;\
                padding: 2px; }\
                .carousel .thumb:focus {\
                  border: 3px solid #ccc;\
                  outline: none; }\
                .carousel .thumb.selected, .carousel .thumb:hover {\
                  border: 3px solid #333; }\
                .carousel .thumb img {\
                  vertical-align: top; }\
              .carousel.carousel-slider {\
                position: relative;\
                margin: 0;\
                overflow: hidden; }\
                .carousel.carousel-slider .control-arrow {\
                  top: 0;\
                  color: #fff;\
                  font-size: 26px;\
                  bottom: 0;\
                  margin-top: 0;\
                  padding: 5px; }\
                  .carousel.carousel-slider .control-arrow:hover {\
                    background: rgba(0, 0, 0, 0.2); }\
              .carousel .slider-wrapper {\
                overflow: hidden;\
                margin: auto;\
                width: 100%;\
                -webkit-transition: height 0.15s ease-in;\
                -moz-transition: height 0.15s ease-in;\
                -ms-transition: height 0.15s ease-in;\
                -o-transition: height 0.15s ease-in;\
                transition: height 0.15s ease-in; }\
                .carousel .slider-wrapper.axis-horizontal .slider {\
                  margin-top: 11px;\
                  -ms-box-orient: horizontal;\
                  display: -webkit-box;\
                  display: -moz-box;\
                  display: -ms-flexbox;\
                  display: -moz-flex;\
                  display: -webkit-flex;\
                  display: flex;\
                  width: 101.278vw; }\
                 }\
                 @media screen and (max-width: 360px) {\
                   .carousel .slider-wrapper.axis-horizontal .slider {\
                     width: 100.278vw;\
                   }\
                 }\
                 @media screen and (min-width: 361px) and (max-width: 376px) {\
                   .carousel .slider-wrapper.axis-horizontal .slider {\
                     width: 105.278vw;\
                   }\
                 }\
                 @media screen and (min-width: 377px) and (max-width: 414px) {\
                   .carousel .slider-wrapper.axis-horizontal .slider {\
                     width: 102.278vw;\
                   }\
                 }\
                 @media screen and (min-width: 415px) and (max-width: 768px) {\
                   .carousel .slider-wrapper.axis-horizontal .slider {\
                     width: 83.278vw;\
                   }\
                 }\
                 @media screen and (min-width: 769px) and (max-width: 1024px) {\
                   .carousel .slider-wrapper.axis-horizontal .slider {\
                     width: 76.278vw;\
                   }\
                 }\
                  .carousel .slider-wrapper.axis-horizontal .slider .slide {\
                    flex-direction: column;\
                    flex-flow: column;\
                  }\
                  .carousel .slider-wrapper.axis-horizontal .slider .slide .indesituk-custom-apps-0-x-productCardCarousel__container {\
                    width: 543px;\
                    height: 250px;\
                  }\
                  @media screen and (min-width: 1025px) and (max-width: 1439px) {\
                    .carousel .slider-wrapper.axis-horizontal .slider .slide .indesituk-custom-apps-0-x-productCardCarousel__container{\
                    width: 362px;\
                    height: 167px;\
                    padding: 10px;\
                    }\
                  }\
                  @media screen and (max-width: 768px) {\
                    .carousel .slider-wrapper.axis-horizontal .slider .slide .indesituk-custom-apps-0-x-productCardCarousel__container{\
                    width: 260px;\
                    height: 120px;\
                    }\
                  }\
                  .carousel .slider-wrapper.axis-horizontal .slider .slide .indesituk-custom-apps-0-x-productCardCarousel__imageContainer {\
                    width: 210px;\
                    height: 210px;\
                  }\
                  @media screen and (min-width: 1025px) and (max-width: 1439px) {\
                  .carousel .slider-wrapper.axis-horizontal .slider .slide .indesituk-custom-apps-0-x-productCardCarousel__imageContainer {\
                    width: 123px;\
                    height: 123px;\
                    }\
                  }\
                  @media screen and (min-width: 1025px) and (max-width: 1439px) {\
                    .carousel .slider-wrapper.axis-horizontal .slider .slide .indesituk-custom-apps-0-x-productCardCarousel__imageContainer {\
                      width: 140px;\
                      height: 140px;\
                      padding: 17px;\
                      border-radius: 30px;\
                    }\
                  }\
                  @media screen and (max-width: 768px) {\
                    .carousel .slider-wrapper.axis-horizontal .slider .slide .indesituk-custom-apps-0-x-productCardCarousel__imageContainer {\
                      width: 106px !important;\
                      height: 106px !important;\
                    }\
                  }\
                  // .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__container {\
                  //   width: 604px;\
                  //   height: 280px;\
                  //   border-radius: 40px;\
                  // }\
                  // @media screen and (min-width: 1025px) and (max-width: 1439px) {\
                  //   .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__container {\
                  //     width: 403px;\
                  //     height: 186px;\
                  //     padding: 10px;\
                  //     border-radius: 27px;\
                  //   }\
                  // }\
                  // @media screen and (max-width: 768px) {\
                  //   .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__container {\
                  //     width: 305px;\
                  //     height: 140px;\
                  //   }\
                  // }\
                  // .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__imageContainer {\
                  //   width: 240px;\
                  //   height: 240px;\
                  //   border-radius: 24px;\
                  // }\
                  // @media screen and (min-width: 1025px) and (max-width: 1439px) {\
                  //   .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__imageContainer {\
                  //     width: 160px;\
                  //     height: 160px;\
                  //     padding: 17px;\
                  //     border-radius: 16px;\
                  //   }\
                  // }\
                  // @media screen and (max-width: 768px) {\
                  //   .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__imageContainer {\
                  //     width: 124px;\
                  //     height: 124px;\
                  //   }\
                  // }\
                  .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__textStyle {\
                    font-size: 24px;\
                  }\
                  @media screen and (min-width: 1025px) and (max-width: 1439px) {\
                    .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__textStyle {\
                      font-size: 18px;\
                      line-height: 20px;\
                    }\
                  }\
                  // @media screen and (max-width: 768px) {\
                  //   .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__textStyle {\
                  //     font-size: 18px;\
                  //   }\
                  // }\
                  .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText {\
                    font-size: 14px;\
                  }\
                  @media screen and (min-width: 1025px) and (max-width: 1439px) {\
                    .carousel .slider-wrapper.axis-horizontal .slider .slide.selected .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText {\
                      font-size: 11px;\
                      bottom: 5px;\
                      position: absolute;\
                      right: 60px;\
                      width: 41px;\
                    }\
                  }\
                .carousel .slider-wrapper.axis-vertical {\
                  -ms-box-orient: horizontal;\
                  display: -webkit-box;\
                  display: -moz-box;\
                  display: -ms-flexbox;\
                  display: -moz-flex;\
                  display: -webkit-flex;\
                  display: flex; }\
                  .carousel .slider-wrapper.axis-vertical .slider {\
                    -webkit-flex-direction: column;\
                    flex-direction: column; }\
              .carousel .slider {\
                margin: 0;\
                padding: 0;\
                position: relative;\
                list-style: none;\
                width: 100%; }\
                .carousel .slider.animated {\
                  -webkit-transition: all 0.35s ease-in-out;\
                  -moz-transition: all 0.35s ease-in-out;\
                  -ms-transition: all 0.35s ease-in-out;\
                  -o-transition: all 0.35s ease-in-out;\
                  transition: all 0.35s ease-in-out; }\
              .carousel .slide {\
                min-width: 100%;\
                margin: 0;\
                position: relative;\
                text-align: center; }\
                .carousel .slide img {\
                  width: 100%;\
                  vertical-align: top;\
                  border: 0; }\
                .carousel .slide iframe {\
                  display: inline-block;\
                  width: calc(100% - 80px);\
                  margin: 0 40px 40px;\
                  border: 0; }\
                .carousel .slide .legend {\
                  -webkit-transition: all 0.5s ease-in-out;\
                  -moz-transition: all 0.5s ease-in-out;\
                  -ms-transition: all 0.5s ease-in-out;\
                  -o-transition: all 0.5s ease-in-out;\
                  transition: all 0.5s ease-in-out;\
                  position: absolute;\
                  bottom: 40px;\
                  left: 50%;\
                  margin-left: -45%;\
                  width: 90%;\
                  border-radius: 10px;\
                  background: #000;\
                  color: #fff;\
                  padding: 10px;\
                  font-size: 12px;\
                  text-align: center;\
                  opacity: 0.25;\
                  -webkit-transition: opacity 0.35s ease-in-out;\
                  -moz-transition: opacity 0.35s ease-in-out;\
                  -ms-transition: opacity 0.35s ease-in-out;\
                  -o-transition: opacity 0.35s ease-in-out;\
                  transition: opacity 0.35s ease-in-out; }\
              .carousel .control-dots {\
                position: absolute;\
                bottom: 0;\
                margin: 10px 0;\
                padding: 0;\
                text-align: center;\
                width: 100%;\
                z-index: 1; }\
                @media (min-width: 960px) {\
                  .carousel .control-dots {\
                    bottom: 0; } }\
                .carousel .control-dots .dot {\
                  -webkit-transition: opacity 0.25s ease-in;\
                  -moz-transition: opacity 0.25s ease-in;\
                  -ms-transition: opacity 0.25s ease-in;\
                  -o-transition: opacity 0.25s ease-in;\
                  transition: opacity 0.25s ease-in;\
                  opacity: 0.3;\
                  filter: alpha(opacity=30);\
                  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);\
                  background: #fff;\
                  border-radius: 50%;\
                  width: 8px;\
                  height: 8px;\
                  cursor: pointer;\
                  display: inline-block;\
                  margin: 0 6px; }\
                              @media screen and (max-width: 768px) {\
                                .carousel .control-dots .dot {\
                                  margin: 0 4px;\
                                }\
                              }\
                  .carousel .control-dots .dot.selected, .carousel .control-dots .dot:hover {\
                    opacity: 1;\
                    filter: alpha(opacity=100); }\
              .carousel .carousel-status {\
                position: absolute;\
                top: 0;\
                right: 0;\
                padding: 5px;\
                font-size: 10px;\
                text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.9);\
                color: #fff; }\
              .carousel:hover .slide .legend {\
                opacity: 1; }\
                .card-container-carousel{\
                  display: flex;\
                  justify-content: center;\
                  align-items: center;\
                  margin: 0 16px 62px;\
                  height: 280px;\
                  text-align: start !important;\
                  font-size: 22px;\
                }\
                @media screen and (max-width: 1024px) {\
                  .carousel .control-dots {\
                    margin: 0;\
                  }\
                }\
                .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__container{\
                  width: 604px;\
                  height: 280px !important;\
                  background: linear-gradient(102.1deg, rgba(229, 246, 255, 0.3) 0%, rgba(255, 255, 255, 0.7) 100%);\
                  box-shadow: 0px 10px 30px rgba(229, 246, 255, 0.4);\
                  backdrop-filter: blur(20px);\
                  border-radius: 40px;\
                  font-size: 24px;\
                  padding: 20px;\
                }\
                .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__textContainer{\
                  margin: 24px 0 65px 44px;\
                }\
                .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__container .indesitukqa-custom-apps-0-x-productCardCarousel__detailsContainer {\
                   margin: 30px 20px auto 44px;\
                 }\
                 .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__container .indesitukqa-custom-apps-0-x-productCardCarousel__productCodeLabel {\
                   font-size: 14px;\
                   line-height: 20px;\
                 }\
                 .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__container .indesitukqa-custom-apps-0-x-productCardCarousel__productNameLabel {\
                   font-size: 18px;\
                   line-height: 28px;\
                   margin-bottom: 20px;\
                 }\
                @media screen and (max-width: 1024px) {\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__textContainer {\
                    margin: 12px 8px auto 20px !important;\
                    line-height: 18px !important;\
                  }\
                  /* .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer {\
                    margin-right: 29px;\
                  } */\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__textStyleCategory {\
                    font-size: 14px !important;\
                  }\
                }\
                @media screen and (max-width: 1024px) {\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__productNameLabel{\
                    font-size: 14px !important;\
                    line-height: 18px !important;\
                  }\
                }\
                @media screen and (max-width: 1024px) {\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__discoverMoreIcon {\
                    height: 32px !important;\
                    width: 32px !important;\
                  }\
                }\
                .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__textStyle{\
                  font-size: 24px;\
                  line-height: 32px;\
                }\
                @media screen and (max-width: 1024px) {\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__textStyle {\
                    font-size: 14px !important;\
                    line-height: 18px !important;\
                  }\
                }\
                .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__imageContainer{\
                  border: 35px solid #ffffff;\
                }\
                @media screen and (max-width: 1024px) {\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__imageContainer {\
                    border: 0 !important;\
                    height: 123px !important;\
                    width: 124px !important;\
                    padding: 20px !important;\
                  }\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__image {\
                    height: 81px !important;\
                    width: 82px !important;\
                  }\
                }\
                .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                  font-size: 14px;\
                  line-height: 16px;\
                }\
                .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__discoverMoreIcon {\
                  height: 32px;\
                  width: 32px;\
                }\
                .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__container {\
                  padding: 20px;\
                }\
                @media screen and (max-width: 1024px) {\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__discoverMoreText {\
                    letter-spacing: 0.04em !important;\
                  }\
                }\
                .carousel .control-dots .dot{\
                  font-size: 8px;\
                  background: #0090D0 !important;\
                  opacity: 1;\
                  box-shadow: unset !important;\
                  cursor: pointer !important;\
                }\
                .carousel .control-dots .dot.selected{\
                  width: 21px !important;\
                  height: 8px!important;\
                  background: #005C92 !important;\
                  opacity: 1 !important;\
                  top: 5px;\
                  border-radius: 13px;\
                }\
                @media screen and (max-width: 1024px){\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__container{\
                    width: 305px !important;\
                    height: 140px !important;\
                    box-shadow: 0 10px 30px rgb(229 246 255 / 40%) !important;\
                    padding: 8px !important;\
                    border-radius: 28px !important;\
                  }\
                }\
                @media screen and (max-width: 320px) {\
                  .card-container-carousel {\
                    margin: 0 0 42px -32px;\
                  }\
                }\
                @media screen and (min-width: 321px) and (max-width: 360px) {\
                  .card-container-carousel {\
                    margin: 0 0 42px -16px;\
                  }\
                }\
                @media screen and (min-width: 361px) and (max-width: 377px) {\
                  .card-container-carousel {\
                    margin: 0 0 42px -13px;\
                  }\
                }\
                @media screen and (min-width: 378px) and (max-width: 767px) {\
                  .card-container-carousel {\
                    margin: 0 0 42px;\
                  }\
                }\
                @media screen and (min-width: 768px) and (max-width: 1023px){\
                  .card-container-carousel {\
                    margin: 0 0px 42px 128px;\
                    height: fit-content;\
                  }\
                }\
                @media screen and (min-width: 1023px) and (max-width: 1024px){\
                  .card-container-carousel {\
                    margin: 0 0 42px 247px;\
                    height: fit-content;\
                  }\
                }\
                @media screen and (max-width: 767px){\
                  .card-container-carousel{\
                    height: 130px;\
                    width: 305px;\
                  }\
                }\
                @media screen and (min-width: 1023px) and (max-width: 1024px){\
                  .card-container-carousel {\
                    height: fit-content;\
                  }\
                }\
                @media screen and (max-width: 320px) {\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__container {\
                    width: 280px;\
                  }\
                }\
                /* SAFARI ONLY */\
                @supports (-webkit-touch-callout: none) {\
                  .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer {\
                    margin-bottom: 35px;\
                    margin-right: 32px;\
                    right: 0;\
                  }\
                  @media screen and (min-width: 427px) and (max-width: 428px) {\
                    .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer {\
                      margin-right: -10px;\
                  }\
                  @media screen and (min-width: 413px) and (max-width: 414px) {\
                    .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer {\
                      margin-right: 28px;\
                  }\
                  @media screen and (min-width: 374px) and (max-width: 375px) {\
                    .selected .card-container-carousel .indesitukqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer {\
                      margin-right: 24px;\
                  }\
                }\
                \
              '
        }
      </style>

      <Carousel {...carouselProps}>
        {productDetails.map((prod, i) => {
          return (
            <div key={i} className="card-container-carousel">
              <ProductCardCarousel
                productImage={prod.productImage}
                energyClassImage={prod.imageEnergyClass}
                linkEnergyLabel={prod.energyLabelPdf}
                productCode={prod.fCode}
                productName={prod.name}
                linkToPDP={`${
                  window.location.protocol
                }//${window.location.host.concat(prod.linkToPDP)}`}
                isBottomCarousel={isBottomCarousel}
                category={prod.category}
                onClickDiscoverMore={() => {
                  productClickAnalytics(i);
                }}
              />
            </div>
          );
        })}
      </Carousel>
    </>
  );
}

function ComponentWrapper({ collectionID = "", isBottomCarousel }) {
  const [filterData, setFilterData] = useState(collectionID);

  useEffect(() => {
    setFilterData(collectionID);
  }, [collectionID]);

  const EnhancedShelf = graphql(productsQuery, {
    options: () => ({
      ssr: true,
      variables: {
        collection: filterData.toString(),
        from: 0,
        to: 99,
        orderBy: "OrderByReviewRateDESC",
      },
    }),
  })(ProductCarousel);

  EnhancedShelf.schema = {
    title: "admin/editor.shelf.title",
  };

  return (
    <EnhancedShelf
      isBottomCarousel={isBottomCarousel}
      collectionID={filterData}
    />
  );
}

export default ComponentWrapper;
